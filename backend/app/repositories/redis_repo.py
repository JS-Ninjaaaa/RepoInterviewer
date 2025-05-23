import json
import os

import redis

from ..schemas.schemas import Difficulty


def get_redis_client():
    return redis.Redis(
        host=os.getenv("REDIS_HOST", "localhost"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        decode_responses=True
    )

# redisに面接の情報を保存する
def create_interview_cache(
    interview_id: str,
    questions: list[str],
    difficulty: Difficulty,
    total_question: int
):
    # 質問をセット
    conversation_history = {
        str(i): {
            "question": questions[i],
            "answer": None  # 初期状態では未回答
        }
        for i in range(0, total_question)
    }
    interview_data = {
        "difficulty": difficulty.value,
        "total_question": total_question,
        "history": conversation_history
    }
    redis = get_redis_client()
    # 有効時間は 1H とする
    redis.set(interview_id, json.dumps(interview_data), ex=3600)
