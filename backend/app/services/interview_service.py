from pathlib import Path
from uuid import uuid4

from ..repositories.redis_repo import create_interview_cache
from ..schemas.schemas import (InterviewInterviewIdPostRequest,
                               InterviewPostRequest)
from ..services.llm_service import generate_question
from ..services.prompt_service import format_source_code
from ..utils.zip_handler import extract_zip


# POST /interview
def set_up_interview(
    request_body: InterviewPostRequest,
) -> tuple[str, str]:
    # 面接IDの生成
    interview_id = str(uuid4())

    # zipファイルを解凍して中身を保存する
    zip_bytes = request_body.source_code
    session_dir = Path("tmp") / interview_id
    saved_files = extract_zip(zip_bytes, session_dir)

    # 質問文を生成する
    formatted_code = format_source_code(saved_files)
    questions = generate_question(
        formatted_code, request_body.difficulty, request_body.total_question
    )

    if questions is None:
        return interview_id, ""

    # 面接の情報をredisに保存する
    create_interview_cache(
        interview_id=interview_id,
        difficulty=request_body.difficulty,
        total_question=request_body.total_question,
        questions=questions,
    )

    # 面接IDと最初の質問文を返す
    return interview_id, questions[0]


# POST /interview/{interview_id}
def get_response(
    interview_id: str, request_body: InterviewInterviewIdPostRequest
) -> str:
    # redisから会話履歴を取得する

    # ユーザーからのメッセージを会話履歴に追加する

    # 返答生成用のプロンプトを組み立てる

    # LLMにプロンプトを送る

    # LLMのメッセージを会話履歴に追加する

    # redisに会話履歴を保存する

    # LLMのメッセージを返す
    return ""


# GET /interview/{interview_id}
def get_question(interview_id: str, question_id: int) -> str:
    # redisから質問文の一覧を取得する

    # question_idに対応する質問文を取得する

    # 質問文を返す
    return ""


# GET /interview/{interview_id}/result
def get_interview_result(interview_id: str) -> tuple[list[int], str]:
    # redisから各質問のスコアと会話履歴を取得する

    # 各質問の最後の発言(LLMからのコメント)を取得する

    # 総評生成用のプロンプトを組み立てる

    # LLMにプロンプトを送る

    # 各質問のスコアと総評を返す
    return [], ""
