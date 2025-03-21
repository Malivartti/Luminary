from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'environments', views.EnvironmentViewSet, basename='environment')
router.register(r'assistants', views.AssistantViewSet, basename='assistant')
router.register(r'ai-models', views.AIModelViewSet, basename='ai-model')
router.register(r'history', views.CostOfGenerationViewSet, basename='history')

urlpatterns = [
    path('register/', views.RegisterView().as_view()),
    path('auth/', views.LoginView().as_view()),
    path('api/v1/', include(router.urls)),
]
