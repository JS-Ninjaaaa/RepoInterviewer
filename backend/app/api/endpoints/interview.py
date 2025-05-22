from typing import Union

from fastapi import APIRouter, Form, UploadFile

from ...schemas.schemas import (
    Difficulty,
    InterviewInterviewIdGetResponse,
    InterviewInterviewIdPostErrorResponse,
    InterviewInterviewIdPostRequest,
    InterviewInterviewIdPostResponse,
    InterviewInterviewIdResultGetErrorResponse,
    InterviewInterviewIdResultGetResponse,
    InterviewPostErrorResponse,
    InterviewPostRequest,
    InterviewPostResponse,
)
from ...services.interview_service import set_up_interview

router = APIRouter()


@router.post(
    "",
    response_model=InterviewPostResponse,
    responses={"500": {"model": InterviewPostErrorResponse}},
    tags=["InterviewAPI"],
)
async def post_interview(
    source_code: UploadFile,
    difficulty: Difficulty = Form("normal"),
    total_question: int = Form(5),
) -> Union[InterviewPostResponse, InterviewPostErrorResponse]:
    """
    コードと設定を送って面接セッションを開始
    """
    zip_bytes = await source_code.read()
    try:
        request_body = InterviewPostRequest(
            source_code=zip_bytes,
            difficulty=Difficulty(difficulty),
            total_question=total_question,
        )
    except Exception as e:
        return InterviewPostErrorResponse(error_message=f"Invalid request body: {str(e)}")

    return await set_up_interview(request_body)


@router.post(
    "/{interview_id}",
    response_model=InterviewInterviewIdPostResponse,
    responses={"500": {"model": InterviewInterviewIdPostErrorResponse}},
    tags=["InterviewAPI"],
)
def post_interview_interview_id(
    interview_id: str,
    body: InterviewInterviewIdPostRequest,
) -> Union[InterviewInterviewIdPostResponse, InterviewInterviewIdPostErrorResponse]:
    """
    ユーザーの回答に対してLLMからの返答を取得
    """
    pass


@router.get(
    "/{interview_id}",
    response_model=InterviewInterviewIdGetResponse,
    tags=["InterviewAPI"],
)
def get_interview_interview_id(
    interview_id: str, question_id: int
) -> InterviewInterviewIdGetResponse:
    """
    指定された質問IDの質問文を取得
    """
    pass


@router.get(
    "/{interview_id}/result",
    response_model=InterviewInterviewIdResultGetResponse,
    responses={"500": {"model": InterviewInterviewIdResultGetErrorResponse}},
    tags=["InterviewAPI"],
)
def get_interview_interview_id_result(
    interview_id: str,
) -> Union[
    InterviewInterviewIdResultGetResponse,
    InterviewInterviewIdResultGetErrorResponse,
]:
    """
    各質問の点数と総評を取得
    """
    pass
