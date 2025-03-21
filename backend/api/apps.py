from django.apps import AppConfig
from django.db.models.signals import post_migrate


def add_initial_data(sender, app_config, **kwargs):
    # Проверка, что миграция применена к нужному приложению
    if app_config.label == 'api':
        from .models import Role, AIModel

        if not Role.objects.exists():  # Проверка, что таблица пуста (чтобы добавить данные только один раз)
            Role.objects.bulk_create([
                Role(name='demo', rubles_limit=0),
            ])
        
        if not AIModel.objects.exists():
            AIModel.objects.bulk_create([
                AIModel(
                    id_model="google/gemini-flash-1.5-8b",
                    name="google/gemini-flash-1.5-8b",
                    context=1000000,
                    input_price=0.0150,
                    output_price=0.0400,
                ),
                AIModel(
                    id_model="openai/gpt-4o-mini",
                    name="openai/gpt-4o-mini",
                    context=128000,
                    input_price=0.0200,
                    output_price=0.0800,
                ),
                AIModel(
                    id_model="anthropic/claude-3-haiku",
                    name="anthropic/claude-3-haiku",
                    context=200000,
                    input_price=0.0375,
                    output_price=0.1875,
                ),
                AIModel(
                    id_model="deepseek/deepseek-chat",
                    name="deepseek/deepseek-v3",
                    context=128000,
                    input_price=0.0500,
                    output_price=0.1600,
                ),
            ])
        

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        super().ready()
        post_migrate.connect(add_initial_data, sender=self)

