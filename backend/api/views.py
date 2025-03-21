from django.http import JsonResponse, StreamingHttpResponse
from rest_framework import status, permissions, views, viewsets, serializers, mixins
from rest_framework.request import HttpRequest
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication


from rest_framework.exceptions import (
    APIException, 
    NotFound
)

from django.db.models import Manager
from django.contrib.auth import authenticate

from drf_spectacular.utils import (
    extend_schema, 
    extend_schema_view, 
    OpenApiResponse,
    OpenApiRequest,
    OpenApiExample,
    OpenApiParameter,
)
from drf_spectacular.types import OpenApiTypes

from http import HTTPMethod
from typing import List
from functools import wraps

from .models import (
    User,
    Assistant,
    AIModel,
    Environment,
    CostOfGeneration
)
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    EnvironmentSerializer, 
    FileSerializer,
    FileNameSerializer,
    PromptSerializer,
    GeneratePromptSerializer,
    AssistantSerializer,
    AIModelSerializer,
    CostOfGenerationSerializer
)
from .services import EnvironmentService

# Create your views here.

def serialize(queryset: Manager, serializers: List[type[serializers.Serializer]] = []):
    """Декоратор для проверки объекта на существование по pk и обработки других ошибок"""
    def decorator(func):
        @wraps(func)
        def wrapper(self: viewsets.ModelViewSet, request: HttpRequest, pk: str, **kwargs):
            try:
                obj = self.get_object()
            except NotFound as e:
                return JsonResponse(
                    {"detail": "Not found."}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            for x in serializers:
                serializer = x(data=request.data)
                if (serializer.is_valid() == False):
                    return JsonResponse(
                        {"detail": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            try:
                return func(self, request, pk, **kwargs)
            except Exception as e:
                return JsonResponse(
                    {"detail": " ".join(e.args)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return wrapper
    return decorator

@extend_schema_view(
    post=extend_schema(
        summary="Регистрация",
        description="Регистрация на основе имени и почты",
        request=RegisterSerializer,
        responses={
            201: {
                "description": "Успешная регистрация",
                "type": "object",
                "properties": {
                    "token": {"type": "string", "description": "Токен доступа"},
                    "user": {"$ref": "#/components/schemas/User"}, # ссылка на UserSerializer
                },
            },
        }
    )
)
class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request: HttpRequest):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                token, created = Token.objects.get_or_create(user=user)

                return Response({
                    "token": token.key,
                    "user": UserSerializer(user).data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f"Error creating user: {e}")
                return Response({"detail": "Внутренняя ошибка сервера"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema_view(
    post=extend_schema(
        summary="Авторизация",
        description="Авторизация на основе постоянных токенов.",
        # parameters=[
        #     OpenApiParameter(
        #         name="username",
        #         description="Имя пользователя",
        #         type=str,
        #         location=OpenApiParameter.QUERY,
        #         required=True,
        #     ),
        #     OpenApiParameter(
        #         name="password",
        #         description="Пароль",
        #         type=str,
        #         location=OpenApiParameter.QUERY,
        #         required=True,
        #     ),
        # ],
        request=LoginSerializer,
        responses={
            200: {
                "description": "Успешная регистрация",
                "type": "object",
                "properties": {
                    "token": {"type": "string", "description": "Токен доступа"},
                    "user": {"$ref": "#/components/schemas/User"}, # ссылка на UserSerializer
                },
            },
            400: {
                "description": "Неверные данные",
                "type": "object",
                "properties": {
                    "detail": {"type": "string", "description": "Сообщение об ошибке"},
                },
            },
        },
    )
)

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request: HttpRequest):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if (user):
            token, created = Token.objects.get_or_create(user=user)
            return Response(
                {
                    "token": token.key, 
                    "user": UserSerializer(user).data
                }, 
                status=status.HTTP_200_OK
            )
        
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@extend_schema(tags=["Users"])
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(url_path="me", detail=False, methods=[HTTPMethod.GET])
    def me(self, request):
        """
        Возвращает информацию о текущем аутентифицированном пользователе.
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class AssistantViewSet(viewsets.ModelViewSet):
    serializer_class = AssistantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
          """
          Получение пользователя из запроса
          """
          return {'request': self.request}

    def get_queryset(self):
        """
        Filter assistants based on the authenticated user.
        """
        user = self.request.user
        return Assistant.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Automatically set the user when creating an assistant.
        """
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """
        Automatically set the user when updating an assistant.
        """
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """
        Delete an assistant if the user owns it.
        """
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"detail": "You do not have permission to delete this assistant."},
                status=status.HTTP_403_FORBIDDEN
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class AIModelViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = AIModel.objects.all()
    serializer_class = AIModelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Переопределяем get_queryset, чтобы только возвращать модели
        """
        return AIModel.objects.all()

class CostOfGenerationViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = AIModel.objects.all()
    serializer_class = CostOfGenerationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
          """
          Получение пользователя из запроса
          """
          return {'request': self.request}

    def get_queryset(self):
        """
        Filter history based on the authenticated user.
        """
        user = self.request.user
        return CostOfGeneration.objects.filter(environment__user=user)


@extend_schema(tags=["Environments"])
@extend_schema_view(
    list=extend_schema(
        summary="Получить список окружений",
    ),
    create=extend_schema(
        summary="Создание окружение",
        description="Создает объект в базе данных, директорию с файлами окружниея, загружет контекст по умолчанию."
    ),
    retrieve=extend_schema(
        summary="Получить информацию о окружении",
    ),
    update=extend_schema(
        summary="Обновить существующее окружение",
    ),
    partial_update=extend_schema(
        summary="Обновить определенные поля существующего окружения",
    ),
    destroy=extend_schema(
        summary="Удалить окружение",
    ),
    drop=extend_schema(
        summary="Очистить окружение без его удаления",
        description="Удаляет файлы окружения и очищаем контекст модели.",
        request=None,
        responses={
            200: None
        },
    ),
    loadFile=extend_schema(
        summary="Загрузить файл в окружение",
        description="Загружает один файл в окружение. Если файл с таким именем уже существует, он будет замен полученным файлом.",
        request=FileSerializer,
        responses={
            201: None
        },
    ),
    updateFile=extend_schema(
        summary="Обновить файл в окружение",
        description="Дополняет содержимое файла в окружении. Если файла не существует, он будет создан с полученным содержанием файла.",
        request=FileSerializer,
        responses={
            200: None
        },
    ),
    removeFile=extend_schema(
        summary="Удалить файл из окружения",
        description="Удаляет файл из окружения по его имени. Независимо от существования файла, возвращает 200 код ответа.",
        request=FileNameSerializer, # не отображается, переместить из body в path через OpenApiParameter.PATH
        responses={
            200: None
        },
    ),
    readFile=extend_schema(
        summary="Получить файл из окружения",
        description="Получает содержание файла из окружения по его имени.",
        request=FileNameSerializer, # не отображается, переместить из body в path через OpenApiParameter.PATH
        responses={
            200: OpenApiResponse(
                response={
                    "type": "object",
                    "properties": {
                        "filename": {"type": "string"},
                        "file": {"type": "string"},
                    }
                }
            ),
            404: OpenApiResponse(
                description="Файл не найден",
                response={
                    "type": "object",
                    "properties": {
                        "detail": {"type": "string"}
                    }
                }
            )
        },
    ),
    listFiles=extend_schema(
        summary="Получить список файлов из окружения",
        description="Получает список файлов из окружения.",
        request=None,
        responses={
            200: OpenApiResponse(
                response={
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "filename": {"type": "string"},
                            "size": {"type": "integer", "format": "int64"},
                            "updatedAt": {"type": "integer", "format": "int64"},
                        }
                    }
                }
            )
        },
    ),
    generate=extend_schema(
        summary="Отправить запрос на генерацию текста по файлам окружения",
        description="""Отправляет запрос на генерацию текста на основе файлов из окружения и дополнительного запроса, если он есть. 
                    Этот эндпоинт автоматически загрузит файлы в окружение аналогично commit-files""",
        request=GeneratePromptSerializer,
        responses={
            200: OpenApiResponse(
                response={
                    "type": "object", 
                    "properties": {
                        "response": {
                            "type": "string"
                        }
                    }
                }
            )
        },
    ),
    sendPrompt=extend_schema(
        summary="Отправить простой запрос на генерацию текста",
        description="Отправляет простой запрос на генерацию текста модели.",
        request=PromptSerializer,
        responses={
            200: OpenApiResponse(
                response={
                    "type": "object", 
                    "properties": {
                        "response": {
                            "type": "string"
                        }
                    }
                },
            )
        },
    ),
    commitFiles=extend_schema(
        summary="Загрузить содержание файлов окружения в контекст",
        description="Загружает содержание файлов окружения в контекст модели. Если файлов не сущетсвует, загружается пустой контекст.",
        request=None,
        responses={
            200: None
        },
    ),
    getContext=extend_schema(
        summary="Получить историю чата с моделью",
        description="Получает сообщения из контекста модели. Системные сообщения игнорируются, например, промпт по умолчанию или содержаение файлов.",
        request=None,
        responses={
            200: OpenApiResponse(
                response={
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "role": {"type": "string"},
                            "content": {"type": "string"}
                        }
                    },
                },
                examples=[
                    OpenApiExample(
                        name="Пример ответа",
                        value=[
                            {"role": "user", "content": "request"},
                            {"role": "assistant", "content": "response"},
                        ],
                        response_only=True,
                    )
                ]
            )
        },
    ),
    clearContext=extend_schema(
        summary="Очистить контекст модели",
        description="Очищает контекст модели, оставляя промпт по умолчанию",
        request={},
        responses={
            200: None
        },
    ),
)

class EnvironmentViewSet(viewsets.ModelViewSet):
    queryset = Environment.objects.all()
    serializer_class = EnvironmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    environmentService = EnvironmentService()

    """Endpoints: """
    """For Environment:"""

    def get_queryset(self):
        """
        Фильтрация queryset для отображения только окружений текущего пользователя.
        """
        return Environment.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        """
        Добавляем request в контекст сериализатора.
        """
        return {'request': self.request}

    def perform_create(self, serializer: EnvironmentSerializer):
        serializer.save(user=self.request.user)
        
        self.environmentService.createEnvironment(serializer.data.get("id"))

    def perform_update(self, serializer: EnvironmentSerializer):
        serializer.save(user=self.request.user)

        self.environmentService.updateEnvironment()

    def perform_destroy(self, instance):
        self.environmentService.removeEnvironment(str(instance.id))
        instance.delete()

    @action(url_path="drop", detail=True, methods=[HTTPMethod.POST])
    @serialize(queryset=queryset)
    def drop(self, request: HttpRequest, pk: str) -> JsonResponse:
        """Очистка окружения без его удаления"""

        return self.environmentService.clearEnvironment(pk)
    
    """For Files:"""

    @action(url_path="load-file", detail=True, methods=[HTTPMethod.POST])
    @serialize(queryset=queryset, serializers=[FileSerializer])
    def loadFile(self, request: HttpRequest, pk: str) -> JsonResponse:
        """Загрузка файла в окружение"""
        
        file = request.FILES['file']
        return self.environmentService.saveFile(pk, file, file.name)
    
    @action(url_path="update-file", detail=True, methods=[HTTPMethod.POST])
    @serialize(queryset=queryset, serializers=[FileSerializer])
    def updateFile(self, request: HttpRequest, pk: str) -> JsonResponse:
        """Обновление файла в окружение"""

        file = request.FILES['file']
        return self.environmentService.updateFile(pk, file, file.name)
    
    @action(url_path="remove-file", detail=True, methods=[HTTPMethod.DELETE])
    def removeFile(self, request: HttpRequest, pk: str) -> JsonResponse:
        """Удаление файла из окружения"""

        filename = request.query_params.get("filename", None)
        return self.environmentService.removeFile(pk, filename)
    
    @action(url_path="read-file", detail=True, methods=[HTTPMethod.GET])
    def readFile(self, request: HttpRequest, pk: str) -> JsonResponse:
        """Считывание файла из окружения"""

        filename = request.query_params.get("filename", None)
        return self.environmentService.readFile(pk, filename)
    
    @action(url_path="list-files", detail=True, methods=[HTTPMethod.GET])
    @serialize(queryset=queryset)
    def listFiles(self, request: HttpRequest, pk: str) -> JsonResponse:
        """Получение списка файлов окружения и их свойств"""

        return self.environmentService.listFiles(pk)
    
    """For AI Model:"""
    
    @action(url_path="generate", detail=True, methods=[HTTPMethod.POST])
    @serialize(queryset=queryset, serializers=[GeneratePromptSerializer])
    def generate(self, request: HttpRequest, pk: str) -> JsonResponse:
        """Отправка запроса модели на генерацию текстового файла на основе файлов из окружения и дополнительного запроса"""
        
        return self.environmentService.generate(pk, request.data.get("prompt", ''))

    @action(url_path="send-prompt", detail=True, methods=[HTTPMethod.POST])
    @serialize(queryset=queryset, serializers=[PromptSerializer])
    def sendPrompt(self, request: HttpRequest, pk: str) -> JsonResponse:
        """Отправка произвольного запроса модели"""

        return self.environmentService.sendPrompt(pk, request.data.get("prompt", ''))
    
    @action(url_path="commit-files", detail=True, methods=[HTTPMethod.POST])
    @serialize(queryset=queryset)
    def commitFiles(self, request: HttpRequest, pk: str) -> JsonResponse:
        """Загрузка текстовых файлов из окружения в контекст модели"""

        return self.environmentService.commitFiles(pk)

    @action(url_path="get-context", detail=True, methods=[HTTPMethod.GET])
    @serialize(queryset=queryset)
    def getContext(self, request: HttpRequest, pk: str) -> JsonResponse:
        """Получение истории сообщений переписки с моделью"""

        return self.environmentService.getChatContext(pk)

    @action(url_path="clear-context", detail=True, methods=[HTTPMethod.DELETE])
    @serialize(queryset=queryset)
    def clearContext(self, request: HttpRequest, pk: str) -> JsonResponse:
        """Очистка контекста модели"""

        return self.environmentService.clearChatContext(pk)