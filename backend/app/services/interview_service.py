import re
from pathlib import Path
from typing import Union
from uuid import uuid4

from ..schemas.schemas import (
    InterviewInterviewIdPostRequest,
    InterviewPostErrorResponse,
    InterviewPostRequest,
    InterviewPostResponse,
)
from ..services.llm_service import (
    format_source_code,
    make_gen_question_prompt,
    send_prompt,
)
from ..utils.zip_handler import extract_zip
from ..repositories.repository import init_interview_info

# POST /interview
def set_up_interview(
    request_body: InterviewPostRequest,
) -> Union[InterviewPostResponse, InterviewPostErrorResponse]:
    # 面接IDの生成
    interview_id = str(uuid4())

    # zipファイルを解凍して中身を保存する
    zip_bytes = request_body.source_code
    session_dir = Path("tmp") / interview_id
    saved_files = extract_zip(zip_bytes, session_dir)

    # LLMに渡すプロンプトを格納する配列
    messages = []

    # 質問を生成するプロンプト
    formatted_code = format_source_code(saved_files)
    gen_question_prompt = make_gen_question_prompt(request_body.difficulty, request_body.total_question, formatted_code)
    messages.append({"role": "user", "content": gen_question_prompt})

    # LLMにプロンプトを送る
    response = send_prompt(messages)

    # 以下をredisに保存する
    # - 面接ID
    # - キャラ設定
    # - 質問文
    init_interview_info(
        interview_id=interview_id,
        response_text=response,
        difficulty=request_body.difficulty,
        total_question=request_body.total_question,
    )

    return InterviewPostResponse(
        interview_id=interview_id,
        question=response
    )

# POST /interview/{interview_id}
def get_response(interview_id: str, request_body: InterviewInterviewIdPostRequest) -> str:
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
