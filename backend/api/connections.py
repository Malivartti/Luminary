from openai import OpenAI
import redis
import os

from .base import once, Singleton

# Create and configure your connections here.

class Connection(Singleton):
    """
    Базовый класс подключений
    """
    pass

class RedisConnection:
    """
    Класс подключения Redis
    """
    @once
    def __init__(self):
        self.client = None
        try:
            self.client = redis.Redis(
                host=os.getenv("REDIS_HOST"),
                port=os.getenv("REDIS_PORT"), 
                decode_responses=True
                )
            self.client.ping()
        except redis.exceptions.ConnectionError as e:
            print(f"Error connecting to Redis: {e}")


class FTPConnection(Connection):
    """
    Класс покдлючения FTP-серверу
    """
    pass

class GPTConnection(Connection):
    """
    Класс покдлючения ChatGPT
    """

    model: str = None

    @once
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            base_url=os.getenv("OPENAI_API_URL"),
            timeout=30
        )
