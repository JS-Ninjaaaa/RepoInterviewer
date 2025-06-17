from app.api.dependencies import get_feedback_usecase, get_set_up_interview_usecase
from app.domain.entities.difficulty import Difficulty
from app.schemas.interview_schema import (
    InterviewInterviewIdGetResponse,
    InterviewInterviewIdPostRequest,
    InterviewInterviewIdPostResponse,
    InterviewInterviewIdResultGetErrorResponse,
    InterviewInterviewIdResultGetResponse,
)
from app.services.interview_service import (
    get_interview_result,
    get_question,
)
from app.usecase.dtos.interview_dto import (
    GetFeedbackRequest,
    SetUpInterviewRequest,
    SetUpInterviewResponse,
)
from app.usecase.usecases.get_feedback_usecase import GetFeedbackUseCase
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
    status_code=status.HTTP_200_OK,
    tags=["Interview"],
    summary="ユーザーの回答に対してフィードバックを返す",
    operation_id="get_feedback",
)
def get_feedback(
    interview_id: str,
    body: InterviewInterviewIdPostRequest,
    usecase: GetFeedbackUseCase = Depends(get_feedback_usecase),
):
    """
    ユーザーの回答に対してフィードバックを返す
    """
    try:
        request_body = GetFeedbackRequest(
            interview_id=interview_id,
            question_id=body.question_id,
            message=body.message,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"リクエストボディが不正です: {str(e)}",
        )

    response = usecase.execute(request_body)

    return InterviewInterviewIdPostResponse(
        question_id=response.question_id,
        score=response.score,
        response=response.comment,
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
