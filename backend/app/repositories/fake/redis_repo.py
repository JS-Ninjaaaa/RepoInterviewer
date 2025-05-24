import os

import redis

from ...schemas.schemas import Difficulty

global_interview_id = "1571bf78-84ee-4d1a-9e76-3b2e518a18a7"

questions = [
    "ranker.pyのcalculate_ranking関数で、同じスコアのプレイヤーがいる場合のランキングってどうやって決めてるんだっけ？",
    "data_loader.pyのload_entries関数で、ファイルが空の場合にエラーをraiseしてるけど、それ以外にどんな時にエラーが発生する可能性があると思う？",
    "main.pyで、try-except構文を使ってエラーハンドリングしてるけど、具体的にどんなエラーを想定してるか説明してみて☆",
    "data_loader.pyのload_entries関数で、ファイルが見つからない時のエラー処理、main.pyでもやってるけど、これって重複じゃない？",
]


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
) -> None:
    pass


def get_chat_history(
    interview_id: str,
    question_id: int,
) -> list[dict[str, str]] | None:
    question = questions[question_id]
    return [
        {
            "role": "model",
            "content": question,
        }
    ]


def get_interview_data(
    interview_id: str,
) -> dict | None:
    return {
        "difficulty": "easy",
        "total_question": len(questions),
        "results": [{"score": 0, "comment": ""} for _ in range(len(questions))],
    }


def update_chat_history(
    interview_id: str,
    question_id: int,
    chat_history: list[dict[str, str]],
) -> list[dict[str, str]]:
    return chat_history


def update_interview_result(
    interview_id: str,
    question_id: int,
    score: int,
    comment: str,
) -> dict:
    return {
        "difficulty": "normal",
        "total_question": len(questions),
        "results": [
            {
                "score": score,
                "comment": comment,
            }
        ],
    }
