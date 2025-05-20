from typing import Union

from fastapi import APIRouter, Form, UploadFile

from ...models.models import (InterviewInterviewIdGetResponse,
                              InterviewInterviewIdPostRequest,
                              InterviewInterviewIdPostResponse,
                              InterviewInterviewIdPostResponse1,
                              InterviewInterviewIdResultGetResponse,
                              InterviewInterviewIdResultGetResponse1,
                              InterviewPostResponse, InterviewPostResponse1)

router = APIRouter()


@router.post(
    "/",
    response_model=InterviewPostResponse,
    responses={"500": {"model": InterviewPostResponse1}},
    tags=["InterviewAPI"],
)
def post_interview(
    file: UploadFile,
) -> Union[InterviewPostResponse, InterviewPostResponse1]:
    """
    コードと設定を送って面接セッションを開始
    """
    pass


@router.post(
    "/{interview_id}",
    response_model=InterviewInterviewIdPostResponse,
    responses={"500": {"model": InterviewInterviewIdPostResponse1}},
    tags=["InterviewAPI"],
)
def post_interview_interview_id(
    interview_id: str, body: InterviewInterviewIdPostRequest = ...
) -> Union[InterviewInterviewIdPostResponse, InterviewInterviewIdPostResponse1]:
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
    interview_id: str, question_id: int = ...
) -> InterviewInterviewIdGetResponse:
    """
    指定された質問IDの質問文を取得
    """
    pass


@router.get(
    "/{interview_id}/result",
    response_model=InterviewInterviewIdResultGetResponse,
    responses={"500": {"model": InterviewInterviewIdResultGetResponse1}},
    tags=["InterviewAPI"],
)
def get_interview_interview_id_result(
    interview_id: str,
) -> Union[
    InterviewInterviewIdResultGetResponse, InterviewInterviewIdResultGetResponse1
]:
    """
    各質問の点数と総評を取得
    """
    pass
