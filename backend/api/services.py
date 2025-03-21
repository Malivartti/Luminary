from datetime import datetime
from django.core.files.uploadedfile import UploadedFile
from django.http import JsonResponse, FileResponse
from rest_framework import status
from rest_framework.request import HttpRequest
from .models import CostOfGeneration, Environment, User
from django.db.models import F
from django.db import transaction


from dataclasses import dataclass

from typing import Dict, List, Iterator, overload, Union

from .base import once, Singleton
from .managers import FileManager, LocalFileManager, RemoteFileManager
from .connections import GPTConnection

# Create your services here.

class Service(Singleton):
    """
    Базовый класс сервисов
    """
    pass

class FileService(Service):
    """
    Отвечает за обработку файлов
    """

    fileManager: FileManager = None

    @once
    def __init__(self):
        self.fileManager = LocalFileManager(basePath="environments")

    def exists(self, path: str, filename: str = '') -> bool:
        return self.fileManager.exists(f"{path}/{filename}")

    def listFiles(self, path: str) -> List[str]:
        """Возвращает список файлов директории"""

        return self.fileManager.listFiles(path=path)
    
    def listFilesStat(self, path: str) -> List[Dict]:
        """Возвращает список файлов директории"""

        return self.fileManager.listFilesStat(path=path)
    
    def readFile(self, path: str, filename: str) -> str:
        """Возвращает содержимое файла с именем `filename`"""
        if (self.exists(path, filename) == False):
            raise FileNotFoundError(f"file with name: {filename} not found")
        return self.fileManager.readFile(path, filename) 

    def removeFile(self, path: str, filename: str) -> str:
        """Удаляет файл с именем `filename`"""
        if (self.exists(path, filename) == False):
            raise FileNotFoundError(f"file with name: {filename} not found")
        print('[x] rem file', f"{path}/{filename}")
        return self.fileManager.removeFile(path, filename)

    def replaceFile(self, path: str, file: Union[UploadedFile, str], filename: str, returning=False) -> None | Union[Iterator[bytes], str]:
        """Заменяет файл с именем `filename` файлом, представленным как `UploadedFile` или `str`"""
        if (self.fileManager.exists(f"{path}/{file.name}")):
            self.fileManager.removeFile(path, file.name)
        
        return self.saveFile(path, file, filename, returning)

    def saveFile(self, path: str, file: Union[UploadedFile, str], filename: str, returning=False) -> None | Union[Iterator[bytes], str]:
        """Сохраняет файл, представленный как `UploadedFile` или `str`, с именем `filename`"""
        if isinstance(file, str):
            return self.fileManager.saveFile(
                path=path,
                name=filename,
                data=file
            )
        elif isinstance(file, UploadedFile):
            return self.fileManager.saveFileByChunks(
                path=path,
                name=filename,
                data=file.chunks()
            )
        if (returning):
            return file
        return None
    
    def createDir(self, path: str) -> None:
        """Создает директорию"""
        if (self.fileManager.exists(path) == False):
            self.fileManager.makeDir(path)

    def removeDir(self, path: str) -> None:
        """Удаляет директорию"""
        if (self.fileManager.exists(path)):
            self.fileManager.removeDir(path)

    def clearDir(self, path: str) -> None:
        """Очищает директорию"""
        return self.fileManager.clearDir(path)

class GPTService(Service):
    """
    Отвечает за общение с GPT-моделью
    """

    @dataclass
    class Chat():
        messages: List[Dict[str, str]] = None
        tokens: int = 0
        commited: bool = False

        def clear(self):
            self.messages = self.messages[:1]
            self.tokens = 0
            self.commited = False

    connection: GPTConnection = None
    environment = None
    input_char = 0
    output_char = 0

    default_context: List[Dict[str, str]] = [
        {
            "role": "system",
            "content": ""
        }
    ]
    prompts: Dict[str, str] = {
        "generate": "Извлечь и суммировать основные идеи и важные детали из предоставленного текста, чтобы создать краткое и информативное резюме.",
        "generate-instructed": "На основе ранее полученных вами файлов сгенерируйте ответ согласно инструкциям: ",
    }

    @once
    def __init__(self):
        self.connection = GPTConnection()
        self.conversations: Dict[str, GPTService.Chat] = {}

    def updateEnvironment(self):
        self.environment = None

    def getConversation(self, id: str) -> Chat:
        """Получает чат с моделью по id окружения"""
        result = self.conversations.get(id, None)
        if (result is None):
            result = self.createConversation(id)
            # Добавить подгрузку из БД: есть - return, нет - KeyError
            # raise KeyError(f"id: {id} not found in conversations")
        if not self.environment:
            print('[x] env is None')
            self.environment = Environment.objects.get(pk=id)
            self.default_context[0]['content'] = self.environment.assistant.context
            self.connection.model = self.environment.ai_model.id_model

        return result

    def createConversation(self, id: str, files: List[Dict[str, str]] = [], context: List[Dict[str, str]] = []) -> Chat:
        """Создает или заменяет чат с моделью по id окружения"""

        # Добавить загрузку в БД

        chat = self.conversations[id] = GPTService.Chat(
            messages=self.default_context + files + context, 
            commited=bool(len(files))
        )
        self.input_char = 0
        self.output_char = 0
        
        return chat

    def closeConversation(self, id: str) -> None:
        """Удаляет чат с моделью по id окружения"""

        # Добавить удаление из БД

        self.conversations.pop(id, None)

    def sendMessage(self, id: str, prompt: str) -> str:
        """Отправляет `prompt` модели"""
        chat: GPTService.Chat = self.getConversation(id)

        user_id = self.environment.user.id
        self.environment.user = User.objects.get(pk=user_id)

        print('[x] if rubles', self.environment.user.rubles_used, self.environment.user.role.rubles_limit)
        if (self.environment.user.rubles_used > self.environment.user.role.rubles_limit):
            return {
                "response": "Баланс исчерпан",
                "created_at": datetime.now().isoformat(),
                "cost": 0
            }

        # if (chat.tokens > self.tokenLimit):
            # print('[x] token limit of {self.tokenLimit} exeeded')
            # raise Exception(f"token limit of {self.tokenLimit} exeeded")

        chat.messages.append(
            {
                "role": "user",
                "content": prompt,
                "created_at": datetime.now().isoformat()
            }
        )

        completion = self.connection.client.chat.completions.create(
            model=self.connection.model,
            messages=chat.messages,
            extra_headers={ "X-Title": "Luminary" }
        )

        # completion.usage.completion_tokens completion.usage.prompt_tokens
        cost_tokens = self.environment.ai_model.input_price * completion.usage.prompt_tokens / 1000 + self.environment.ai_model.output_price * completion.usage.completion_tokens / 1000
        print('[x] cost_tokens', cost_tokens)

        with transaction.atomic():
            CostOfGeneration.objects.create(
                environment=self.environment,
                ai_model=self.environment.ai_model,
                input_tokens=completion.usage.prompt_tokens,
                output_tokens=completion.usage.completion_tokens,
                cost=cost_tokens
            )

            user = self.environment.user
            user.rubles_used = F('rubles_used') + cost_tokens
            user.save()


        chat.tokens += completion.usage.total_tokens
        print("used tokens:", completion.usage)
        print("total tokens:", chat.tokens)

        created_at = datetime.now().isoformat()

        chat.messages.append(
            {
                "role": "assistant",
                "content": completion.choices[0].message.content,
                "model": self.environment.ai_model.name,
                "cost": float(cost_tokens),
                "created_at": created_at
            }
        )

        print(chat.messages)

        return {
            "response": completion.choices[0].message.content,
            "model": self.environment.ai_model.name,
            "cost": float(cost_tokens),
            "created_at": created_at
        }
        

    def loadContext(self, id: str, context: List[Dict[str, str]]) -> None:
        """Загружает `context` в контекст модели"""
        chat: GPTService.Chat = self.getConversation(id)
        chat.messages.append(context)

    def clearContext(self, id: str) -> None:
        """Очищает контекст модели"""
        chat: GPTService.Chat = self.getConversation(id)
        chat.clear()
        self.input_char = 0
        self.output_char = 0

class EnvironmentService(Service):
    """
    Отвечает за бизнес-логику обработки запросов к окружению.
    """

    fileService = None
    gptService = None

    @once
    def __init__(self):
        self.fileService = FileService()
        self.gptService = GPTService()

    def createEnvironment(self, id: str) -> None:
        self.fileService.createDir(id)
        self.gptService.createConversation(id)
        print('createEnvironment', id)

    def updateEnvironment(self) -> None:
        self.gptService.updateEnvironment()

    def removeEnvironment(self, id: str) -> None:
        self.fileService.removeDir(id)
        self.gptService.closeConversation(id)

    def clearEnvironment(self, id: str) -> JsonResponse:
        """Очищает файлы окружения и контекст модели"""
        try:
            self.fileService.clearDir(id)
            self.gptService.clearContext(id)
        except KeyError as e:
            ...
        return JsonResponse({}, status=status.HTTP_200_OK)

    def saveFile(self, id: str, file: Union[UploadedFile, str], filename: str = None) -> JsonResponse:
        """Загружает файл, представленный `UploadedFile` или `str`, или заменяет файл с таким же именем в хранилище."""
        self.fileService.replaceFile(id, file, filename)

        return JsonResponse({}, status=status.HTTP_201_CREATED)

    def updateFile(self, id: str, file: Union[UploadedFile, str], filename: str = None) -> JsonResponse:
        """Дополняет файл в хранилище файлом с тем же именем, представленным `UploadedFile` или `str`"""
        self.fileService.saveFile(id, file, filename)
            
        return JsonResponse({}, status=status.HTTP_200_OK)

    def removeFile(self, id: str, filename: str) -> JsonResponse:
        """Удаляет файл c именем `filename` из хранилища"""
        try:
            self.fileService.removeFile(id, filename)
        except FileNotFoundError as e:
            ...
        return JsonResponse({}, status=status.HTTP_200_OK)

    def readFile(self, id: str, filename: str) -> JsonResponse:
        """Считывает файл c именем `filename` из хранилища"""
        file = self.fileService.readFile(id, filename)
        return JsonResponse({
                "filename": filename,
                "file": file
            }, status=status.HTTP_200_OK)

    def listFiles(self, id: str) -> JsonResponse:
        """Получает информацию о файлах в окружении"""
        return JsonResponse(
            self.fileService.listFilesStat(id),
            safe=False,
            status=status.HTTP_200_OK,
        )

    def generate(self, id: str, prompt: str = '') -> JsonResponse:
        """Генерирует текстовый файл на основе файлов окружения"""
        chat = self.gptService.getConversation(id)
        
        if (chat.commited == False):
            # raise Exception("files not commited")
            self.commitFiles(id)

        if (not prompt):
            prompt = self.gptService.prompts.get("generate")
        else:
            prompt = self.gptService.prompts.get("generate-instructed") \
                + prompt

        response = self.gptService.sendMessage(id, prompt)

        return JsonResponse(response, status=status.HTTP_200_OK)

    def sendPrompt(self, id: str, prompt: str) -> JsonResponse:
        """Отправляет запрос модели"""
        response = self.gptService.sendMessage(id, prompt)

        return JsonResponse(response, status=status.HTTP_200_OK)

    def commitFiles(self, id: str) -> JsonResponse:
        """Загружает файлы окружения в контекст модели, перезаписывая его"""
        self.gptService.createConversation(id, files=self.getFilesContext(id))

        return JsonResponse({}, status=status.HTTP_200_OK)

    def getChatContext(self, id: str) -> JsonResponse:
        """Получает контекст модели по идентификатору окружения"""
        context = [x for x in self.gptService.getConversation(id).messages if x["role"] != "system"]

        return JsonResponse(
            context,
            safe=False,
            status=status.HTTP_200_OK
        )

    def clearChatContext(self, id: str) -> JsonResponse:
        """Очищает контекст модели"""
        self.gptService.clearContext(id)

        return JsonResponse({}, status=status.HTTP_200_OK)

    def getFilesContext(self, id: str) -> List[Dict[str, str]]:
        """Получаем содержание файлов"""
        context=[]
        for filename in self.fileService.listFiles(id):
            context.append({
                    "role": "system",
                    "content": f"This is the content of file {filename}: " \
                        + self.fileService.readFile(id, filename)
                })
        return context