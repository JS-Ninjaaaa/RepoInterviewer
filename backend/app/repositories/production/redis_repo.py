import json
import os

import redis

from ...schemas.schemas import Difficulty


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
        "results": [
            {
                "score": 0,
                "comment": "",
            }
            for _ in range(total_question + 1)
        ],
    }
    redis_client.set(interview_id, json.dumps(interview_data), ex=3600)

    # 各質問の会話履歴を保存する
    for question_id in range(1, total_question + 1):
        question_data = {
            "history": [{"role": "model", "content": questions[question_id - 1]}]
        }
        redis_client.set(
            f"{interview_id}-{question_id}",
            json.dumps(question_data),
            ex=3600,
        )


def get_chat_history(
    interview_id: str,
    question_id: int,
) -> list[dict[str, str]] | None:
    redis_client = get_redis_client()
    key = f"{interview_id}-{question_id}"
    response = redis_client.get(key)

    if response is None:
        return None

    chat_history = json.loads(str(response))
    if not isinstance(chat_history, dict):
        raise ValueError(f"会話履歴の型が不正です: {type(chat_history)}")

    if "history" not in chat_history:
        raise ValueError("会話履歴に 'history' がありません")

    return chat_history["history"]


def get_interview_data(
    interview_id: str,
) -> dict | None:
    redis_client = get_redis_client()
    response = redis_client.get(interview_id)

    if response is None:
        return None

    interview_data = json.loads(str(response))
    if not isinstance(interview_data, dict):
        raise ValueError(f"面接データの型が不正です: {type(interview_data)}")

    return interview_data


def update_chat_history(
    interview_id: str,
    question_id: int,
    chat_history: list[dict[str, str]],
) -> list[dict[str, str]]:
    redis_client = get_redis_client()

    # Redisに上書き保存
    key = f"{interview_id}-{question_id}"
    redis_client.hset(key, "history", json.dumps(chat_history))

    return chat_history


def update_interview_result(
    interview_id: str,
    question_id: int,
    score: int,
    comment: str,
) -> dict:
    redis_client = get_redis_client()

    response = redis_client.get(interview_id)
    if response is None:
        raise ValueError(
            f"面接のデータが見つかりませんでした: {interview_id}-{question_id}"
        )

    # 面接全体の情報を更新する
    interview_data = json.loads(str(response))
    if not isinstance(interview_data, dict):
        raise ValueError(f"面接データの型が不正です: {type(interview_data)}")

    if "results" not in interview_data:
        raise ValueError("面接データに 'results' がありません")

    results = interview_data.get("results", [])
    if len(results) <= question_id:
        raise ValueError(f"質問IDが面接の質問数を超えています: {question_id}")

    results[question_id]["score"] = score
    results[question_id]["comment"] = comment

    redis_client.hset(
        interview_id,
        "results",
        json.dumps(results),
    )

    return results
