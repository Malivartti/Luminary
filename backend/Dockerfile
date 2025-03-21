FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /backend

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Монтируется Volume с кодом в docker-compose
COPY . .

EXPOSE 8000
