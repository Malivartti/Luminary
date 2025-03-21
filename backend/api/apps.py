from django.apps import AppConfig
from django.db.models.signals import post_migrate


def add_initial_data(sender, app_config, **kwargs):
    # Проверка, что миграция применена к нужному приложению
    if app_config.label == 'api':
        from .models import Role, Assistant

        if not Role.objects.exists():  # Проверка, что таблица пуста (чтобы добавить данные только один раз)
            Role.objects.bulk_create([
                Role(name='demo', rubles_limit=0),
            ])

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        super().ready()
        post_migrate.connect(add_initial_data, sender=self)

