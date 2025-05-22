import re
from pathlib import Path
from typing import Union
from uuid import uuid4

from ..schemas.schemas import (
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


# POST interview用
async def set_up_interview(
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
    # - 質問内容

    return InterviewPostResponse(
        interview_id=interview_id,
        question=response
    )

# 質問の絞り込み
def filter_question(text: str,number :int) -> str:
    # number問目の問題を抽出
    pattern = rf'{number}\.\s*(.+?)(?=\n\d+\.|\Z)'
    match = re.search(pattern, text.strip(), flags=re.DOTALL)
    return match.group(1).strip() if match else ""
