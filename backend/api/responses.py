from pydantic import BaseModel, Field, field_validator

from typing import List, Dict

from django.http import JsonResponse
from rest_framework import status

# Create your responses here.

class FileStat(BaseModel):
    filename: str
    size: int
    updatedAt: int

class ChatMessage(BaseModel):
    role: str
    content: str

    @field_validator('role')
    def validate_role(cls, value):
        if (value not in ["system", "assistant", "user"]):
            raise ValueError("Role must be system, assistant or user")
        return value

class BaseResponse(BaseModel):
    status: int = Field(400, exclude=True)

    def toResponse(self) -> JsonResponse:
        return JsonResponse(
            self.model_dump(),
            status=self.status
        )

class EmptyResponse(BaseResponse):
    ...

class ExceptionResponse(BaseResponse):
    detail: str | List

class FileResponse(BaseResponse):
    filename: str = ""
    file: str

class FileInfoResponse(BaseResponse):
    files: List[Dict] = []

    def toResponse(self) -> JsonResponse:
        return JsonResponse(
            self.files,
            safe=False,
            status=self.status
        )
    
class PromptResponse(BaseResponse):
    response: str

class ChatContextResponse(BaseResponse):
    messages: List = []

    def toResponse(self) -> JsonResponse:
        return JsonResponse(
            self.messages,
            safe=False,
            status=self.status
        )
