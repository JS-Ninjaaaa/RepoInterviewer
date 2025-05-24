from typing import Union

from fastapi import APIRouter, Form, HTTPException, UploadFile

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
from ...services.interview_service import (
    get_interview_result,
    get_question,
    get_response,
    set_up_interview,
)

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
        return InterviewPostErrorResponse(
            error_message=f"リクエストボディが不正です: {str(e)}"
        )

    interview_id, first_question = set_up_interview(request_body)
    if first_question == "":
        return InterviewPostErrorResponse(
            error_message="面接のセットアップに失敗しました"
        )

    return InterviewPostResponse(
        interview_id=interview_id,
        question=first_question,
    )


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
    try:
        request_body = InterviewInterviewIdPostRequest(
            question_id=body.question_id,
            message=body.message,
        )
    except Exception as e:
        return InterviewInterviewIdPostErrorResponse(
            error_message=f"リクエストボディが不正です: {str(e)}"
        )

    score, comment = get_response(interview_id, request_body)

    if score == 0 and comment == "":
        return InterviewInterviewIdPostErrorResponse(
            error_message="応答の生成に失敗しました"
        )

    return InterviewInterviewIdPostResponse(
        question_id=request_body.question_id,
        score=score,
        response=comment,
    )


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
    found_question_id, found_question_text = get_question(interview_id, question_id)
    if found_question_text == "" and found_question_id == 0:
        raise HTTPException(
            status_code=404,
        )

    return InterviewInterviewIdGetResponse(
        question_id=found_question_id, question=found_question_text
    )


@router.get(
    "/{interview_id}/result",
    response_model=InterviewInterviewIdResultGetResponse,
    responses={500: {"model": InterviewInterviewIdResultGetErrorResponse}},
    tags=["InterviewAPI"],
)
def get_interview_interview_id_result(interview_id: str):
    scores, general_review = get_interview_result(interview_id)

    if scores == [] and general_review == "":
        raise HTTPException(
            status_code=500,
            detail="総評を取得できませんでした",
        )
    return {
        "scores": scores,
        "general_review": general_review,
    }
