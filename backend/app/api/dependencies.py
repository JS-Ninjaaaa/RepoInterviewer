import os
import secrets
from pathlib import Path

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.domain.llm_clients.llm_client import LLMClient
from app.domain.repositories.interview_repository import InterviewRepository
from app.domain.repositories.source_code_repository import SourceCodeRepository
from app.infrastructure.llm_clients.google.llm_client import GoogleLLMClient
from app.infrastructure.repositories.firestore.interview_repository import (
    FirestoreInterviewRepository,
)
from app.infrastructure.repositories.local.source_code_repository import (
    LocalSourceCodeRepository,
)
from app.usecase.usecases.get_interview_result_usecase import GetInterviewResultUseCase
from app.usecase.usecases.get_question_usecase import GetQuestionUseCase
from app.usecase.usecases.get_response_usecase import GetResponseUseCase
from app.usecase.usecases.setup_interview_usecase import SetUpInterviewUseCase

bearer = HTTPBearer()


def verify_token(token: HTTPAuthorizationCredentials = Depends(bearer)) -> bool:
    API_TOKEN = os.getenv("API_TOKEN")

    if API_TOKEN is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API_TOKENが設定されていません",
        )

    # タイミング攻撃を防ぐため
    if not secrets.compare_digest(token.credentials, API_TOKEN):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="トークンが不正です",
        )

    return True


def get_interview_repository() -> InterviewRepository:
    return FirestoreInterviewRepository()


def get_source_code_repository() -> SourceCodeRepository:
    return LocalSourceCodeRepository()


def get_llm_client() -> LLMClient:
    return GoogleLLMClient()


def get_set_up_interview_usecase(
    interview_repository: InterviewRepository = Depends(get_interview_repository),
    source_code_repository: SourceCodeRepository = Depends(get_source_code_repository),
    llm_client: LLMClient = Depends(get_llm_client),
) -> SetUpInterviewUseCase:
    return SetUpInterviewUseCase(
        interview_repository=interview_repository,
        source_code_repository=source_code_repository,
        llm_client=llm_client,
        source_code_dir=Path("tmp"),
    )


def get_response_usecase(
    interview_repository: InterviewRepository = Depends(get_interview_repository),
    source_code_repository: SourceCodeRepository = Depends(get_source_code_repository),
    llm_client: LLMClient = Depends(get_llm_client),
) -> GetResponseUseCase:
    return GetResponseUseCase(
        interview_repository=interview_repository,
        source_code_repository=source_code_repository,
        llm_client=llm_client,
        source_code_dir=Path("tmp"),
    )


def get_question_usecase(
    interview_repository: InterviewRepository = Depends(get_interview_repository),
) -> GetQuestionUseCase:
    return GetQuestionUseCase(
        interview_repository=interview_repository,
    )


def get_overall_review_usecase(
    interview_repository: InterviewRepository = Depends(get_interview_repository),
    llm_client: LLMClient = Depends(get_llm_client),
) -> GetInterviewResultUseCase:
    return GetInterviewResultUseCase(
        interview_repository=interview_repository,
        llm_client=llm_client,
    )
