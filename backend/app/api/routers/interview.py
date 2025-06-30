from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, status

from app.api.dependencies import (
    get_overall_review_usecase,
    get_question_usecase,
    get_response_usecase,
    get_set_up_interview_usecase,
)
from app.domain.entities.difficulty import Difficulty
from app.schemas.interview_schema import (
    InterviewInterviewIdPostRequest,
    InterviewInterviewIdPostResponse,
)
from app.usecase.dtos.interview_dto import (
    GetInterviewResultRequest,
    GetInterviewResultResponse,
    GetQuestionRequest,
    GetQuestionResponse,
    GetResponseRequest,
    SetUpInterviewRequest,
    SetUpInterviewResponse,
)
from app.usecase.usecases.get_interview_result_usecase import GetInterviewResultUseCase
from app.usecase.usecases.get_question_usecase import GetQuestionUseCase
from app.usecase.usecases.get_response_usecase import GetResponseUseCase
from app.usecase.usecases.setup_interview_usecase import SetUpInterviewUseCase

router = APIRouter()


@router.post(
    "",
    response_model=SetUpInterviewResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Interview"],
    summary="ソースコードと面接の設定を受け取って面接を開始する",
    operation_id="set_up_interview",
)
async def set_up_interview(
    source_code: UploadFile,
    difficulty: Difficulty = Form(Difficulty.normal),
    total_question: int = Form(4, gt=0),
    usecase: SetUpInterviewUseCase = Depends(get_set_up_interview_usecase),
):
    zip_bytes = await source_code.read()
    try:
        request = SetUpInterviewRequest(
            source_code=zip_bytes,
            difficulty=difficulty,
            total_question=total_question,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"リクエストボディが不正です: {str(e)}",
        )

    return usecase.execute(request)


@router.post(
    "/{interview_id}",
    response_model=InterviewInterviewIdPostResponse,
    status_code=status.HTTP_200_OK,
    tags=["Interview"],
    summary="ユーザーの回答に対するLLMからの返答と評価を取得する",
    operation_id="get_response",
)
def get_response(
    interview_id: str,
    body: InterviewInterviewIdPostRequest,
    usecase: GetResponseUseCase = Depends(get_response_usecase),
):
    try:
        request = GetResponseRequest(
            interview_id=interview_id,
            question_id=body.question_id,
            message=body.message,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"リクエストボディが不正です: {str(e)}",
        )

    response = usecase.execute(request)

    return InterviewInterviewIdPostResponse(
        interview_id=response.interview_id,
        question_id=response.question_id,
        score=response.score,
        response=response.response,
        continue_=response.continue_,
    )


@router.get(
    "/{interview_id}",
    response_model=GetQuestionResponse,
    tags=["Interview"],
    summary="指定された質問IDの質問文を取得する",
    operation_id="get_question",
)
def get_interview_interview_id(
    interview_id: str,
    question_id: str,
    usecase: GetQuestionUseCase = Depends(get_question_usecase),
):
    try:
        request = GetQuestionRequest(
            interview_id=interview_id,
            question_id=question_id,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"パラメータが不正です: {str(e)}",
        )

    response = usecase.execute(request)

    if response is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="質問が見つかりません",
        )

    return response


@router.get(
    "/{interview_id}/result",
    response_model=GetInterviewResultResponse,
    tags=["Interview"],
    summary="面接結果を取得する",
    operation_id="get_interview_result",
)
def get_interview_result(
    interview_id: str,
    usecase: GetInterviewResultUseCase = Depends(get_overall_review_usecase),
):
    try:
        request = GetInterviewResultRequest(
            interview_id=interview_id,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"パラメータが不正です: {str(e)}",
        )

    return usecase.execute(request)
