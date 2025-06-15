from typing import Union

from app.api.dependencies import get_set_up_interview_usecase
from app.domain.entities.difficulty import Difficulty
from app.schemas.interview_schema import (
    InterviewInterviewIdGetResponse,
    InterviewInterviewIdPostErrorResponse,
    InterviewInterviewIdPostRequest,
    InterviewInterviewIdPostResponse,
    InterviewInterviewIdResultGetErrorResponse,
    InterviewInterviewIdResultGetResponse,
)
from app.services.interview_service import (
    get_interview_result,
    get_question,
    get_response,
)
from app.usecase.dtos.interview_dto import (
    SetUpInterviewRequest,
    SetUpInterviewResponse,
)
from app.usecase.usecases.setup_interview_usecase import SetUpInterviewUseCase
from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, status

router = APIRouter()


@router.post(
    "",
    response_model=SetUpInterviewResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Interview"],
    summary="面接を開始する",
    operation_id="set_up_interview",
)
async def set_up_interview(
    source_code: UploadFile,
    difficulty: Difficulty = Form(Difficulty.normal),
    total_question: int = Form(4, gt=0),
    usecase: SetUpInterviewUseCase = Depends(get_set_up_interview_usecase),
):
    """
    ソースコードと面接の設定を受け取って面接を開始する
    """
    zip_bytes = await source_code.read()
    try:
        request_body = SetUpInterviewRequest(
            source_code=zip_bytes,
            difficulty=difficulty,
            total_question=total_question,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"リクエストボディが不正です: {str(e)}",
        )

    return usecase.execute(request_body)


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

    score, comment, continue_question = get_response(interview_id, request_body)

    if score == 0 and comment == "":
        return InterviewInterviewIdPostErrorResponse(
            error_message="応答の生成に失敗しました"
        )

    return InterviewInterviewIdPostResponse(
        question_id=request_body.question_id,
        score=score,
        response=comment,
        continue_question=continue_question,
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
