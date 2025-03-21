# API

## Как запустить?

```bash
docker-compose up
```

### Переменные среды

Для конфигурации переменных среды следует создать файл .env в директории проекта.
- `SECRET_KEY` - Ключ проекта Django
- `DEBUG` - Флаг для включения (True) и выключения (False) debug-режима Django

- `POSTGRES_DB` - Имя базы данных PostgreSQL
- `POSTGRES_USER` - Имя пользователя
- `POSTGRES_PASSWORD` - Пароль пользователя
- `POSTGRES_HOST` - Адрес для подключения
- `POSTGRES_PORT` - Порт для подключения

- `REDIS_HOST` - Адрес для подключения
- `REDIS_PORT` - Порт для подключения

- `OPENAI_API_KEY` - Ключ API для модели
- `OPENAI_API_URL` - URL для API модели
- `MODEL_NAME` - Наименование модели (рекомендуется gpt-4o-mini)