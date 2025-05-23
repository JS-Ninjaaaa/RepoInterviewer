import json
import os
from typing import List,Dict
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
    redis_client = get_redis_client()

    # 面接全体の情報を保存する
    interview_data = {
        "difficulty": difficulty.value,
        "total_question": total_question,
        "results": [{"score": 0, "comment": ""} for _ in range(total_question)],
    }
    redis_client.set(interview_id, json.dumps(interview_data), ex=3600)

    # print(f"Created interview cache: {interview_data}")

    # 各質問の会話履歴を保存する
    for question_id in range(total_question):
        question_data = {"history": [{"role": "model", "content": questions[question_id]}]}
        redis_client.set(f"{interview_id}-{question_id}", json.dumps(question_data), ex=3600)

    # print(f"Created conversation cache: {question_data}")

# redisから履歴とメッセージを取得，追加( {interview-id} メモリ )
def append_interview_id_cache(interview_id: str, comment: str, score: int):
    redis_client = get_redis_client()
    key = f"{interview_id}"
    history_raw = redis_client.get(key)
    if history_raw is None:
        raise ValueError(f"No interview history found for {interview_id}")

    history = json.loads(history_raw)
    history["results"].append({"score": score, "comment": comment})
    redis_client.set(key, json.dumps(history), ex=3600)
    print(f"Updated interview results for {interview_id} => {history}")

# redisから履歴とメッセージを取得，追加( {interview-id}-{question_id} メモリ )
def append_interview_cache(
    interview_id: str, question_id: int, role: str, message: str
) -> List[Dict[str, str]]:
    redis_client = get_redis_client()
    key = f"{interview_id}-{question_id}"
    history_raw = redis_client.get(key)

    if history_raw is None:
        # 初期化（初めての質問用）
        history = {"history": []}
    else:
        history = json.loads(history_raw)
        if not isinstance(history, dict) or "history" not in history:
            raise ValueError(f"Corrupted history structure in Redis for {key}")

    # 追記
    history["history"].append({"role": role, "content": message})

    # Redisに上書き保存
    redis_client.set(key, json.dumps(history, ensure_ascii=False), ex=3600)
    print(f"Updated message history for {key} => {history}")

    return history["history"]