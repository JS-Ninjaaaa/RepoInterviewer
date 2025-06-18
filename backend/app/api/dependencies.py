from pathlib import Path

from app.domain.llm_clients.llm_client import LLMClient
from app.domain.repositories.interview_repository import InterviewRepository
from app.domain.repositories.source_code_repository import SourceCodeRepository
from app.infrastructure.llm_clients.google.llm_client import GoogleLLMClient
from app.infrastructure.repositories.local.source_code_repository import (
    LocalSourceCodeRepository,
)
from app.infrastructure.repositories.redis.interview_repository import (
    RedisInterviewRepository,
)
from app.usecase.usecases.get_feedback_usecase import GetFeedbackUseCase
from app.usecase.usecases.get_question_usecase import GetQuestionUseCase
from app.usecase.usecases.setup_interview_usecase import SetUpInterviewUseCase
from fastapi import Depends


def get_interview_repository() -> InterviewRepository:
    return RedisInterviewRepository()


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


def get_feedback_usecase(
    interview_repository: InterviewRepository = Depends(get_interview_repository),
    source_code_repository: SourceCodeRepository = Depends(get_source_code_repository),
    llm_client: LLMClient = Depends(get_llm_client),
) -> GetFeedbackUseCase:
    return GetFeedbackUseCase(
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
