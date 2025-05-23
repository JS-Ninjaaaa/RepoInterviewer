import json
import os

import redis

from ..schemas.schemas import Difficulty


def get_redis_client():
    return redis.Redis(
        host=os.getenv("REDIS_HOST", "localhost"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        decode_responses=True,
    )


# redisに面接の情報を保存する
def create_interview_cache(
    interview_id: str,
    difficulty: Difficulty,
    total_question: int,
    questions: list[str],
):
    redis = get_redis_client()

    # 面接全体の情報を保存する
    interview_data = {
        "difficulty": difficulty.value,
        "total_question": total_question,
        "results": [{"score": 0, "comment": ""} for _ in range(total_question)],
    }
    redis.set(interview_id, json.dumps(interview_data), ex=3600)

    # print(f"Created interview cache: {interview_data}")

    # 各質問の会話履歴を保存する
    for question_id in range(total_question):
        question_data = [{"role": "model", "content": questions[question_id]}]
        redis.set(f"{interview_id}-{question_id}", json.dumps(question_data), ex=3600)

    # print(f"Created conversation cache: {question_data}")
