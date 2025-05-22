import redis
import os

class RedisService:
    def __init__(self):
        self._client = redis.Redis(
            host=os.getenv("REDIS_HOST", "localhost"),
            port=int(os.getenv("REDIS_PORT", 6379)),
            decode_responses=True
        )

    def get_client(self) -> redis.Redis:
        return self._client

redis_service = RedisService()
