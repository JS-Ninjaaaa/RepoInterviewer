from pathlib import Path
from uuid import uuid4
from fastapi import UploadFile
from typing import Union

from ..utils.zip_handler import save_upload_zip, extract_zip, get_source_code
from ..models.models import InterviewPostResponse, InterviewPostResponse1
from .llm_client import send_prompt, build_question_prompt

# POST interview用
def process_interview_upload(
    source_code: UploadFile,
    difficulty: str,
    total_question: int,
) -> Union[InterviewPostResponse, InterviewPostResponse1]:
    # 不正な難易度
    if difficulty not in {"easy", "normal", "hard", "extreme"}:
        return InterviewPostResponse1(error_message="Invalid difficulty level")
    # 面接IDの生成
    interview_id = str(uuid4())
    session_dir = Path("tmp") / interview_id
    # zip解凍
    try:
        # zipファイルごと保存
        zip_path = save_upload_zip(source_code, session_dir)
        # tmp/uuid/source以下に展開
        extract_zip(zip_path, session_dir / "source")
    except Exception as e:
        return InterviewPostResponse1(error_message=f"ZIP処理に失敗: {str(e)}")
    # ソースコード整形
    try:
        repository = get_source_code(session_dir / "source")
    except Exception as e:
        return InterviewPostResponse1(error_message=f"ソースコードを正しく処理できませんでした: {str(e)}")
    # LLM question あとで実装する
    question_prompt = build_question_prompt("ギャル",difficulty,total_question,repository)
    res = send_prompt(question_prompt)
    return InterviewPostResponse(interview_id=interview_id, question=res)
