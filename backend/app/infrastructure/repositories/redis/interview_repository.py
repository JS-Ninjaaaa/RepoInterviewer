import json
import os

import redis
from app.domain.entities.interview_question import InterviewQuestion
from app.domain.repositories.interview_repository import InterviewRepository


class RedisInterviewRepository(InterviewRepository):
    DEFAULT_TTL = 3600

    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

    def __init__(self) -> None:
        """コンストラクタ"""
        pass

    def get_redis_client(self) -> redis.Redis:
        """redisクライアントを取得する"""
        return redis.Redis(
            host=self.REDIS_HOST,
            port=self.REDIS_PORT,
            decode_responses=True,
        )

    def create_interview(self, questions: list[InterviewQuestion]) -> None:
        """面接を作成する"""
        redis_client = self.get_redis_client()
        pipeline = redis_client.pipeline()

        for question in questions:
            pipeline.set(
                name=f"{question.interview_id}-{question.question_id}",
                value=json.dumps(question.to_dict()),
                ex=self.DEFAULT_TTL,
            )

        pipeline.execute()

    def get_question(
        self,
        interview_id: str,
        question_id: str,
    ) -> InterviewQuestion | None:
        redis_client = self.get_redis_client()
        question = redis_client.get(
            name=f"{interview_id}-{question_id}",
        )
        if question is None:
            return None

        return InterviewQuestion.from_dict(json.loads(question))

    def update_question(
        self,
        interview_id: str,
        question_id: str,
        question: InterviewQuestion,
    ) -> InterviewQuestion:
        redis_client = self.get_redis_client()
        redis_client.set(
            name=f"{interview_id}-{question_id}",
            value=json.dumps(question.to_dict()),
            ex=self.DEFAULT_TTL,
        )

        return question
