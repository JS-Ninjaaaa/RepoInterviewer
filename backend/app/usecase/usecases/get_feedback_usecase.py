from pathlib import Path

from app.domain.entities.chat_history import ChatMessage
from app.domain.llm_clients.llm_client import LLMClient
from app.domain.repositories.interview_repository import InterviewRepository
from app.domain.repositories.source_code_repository import SourceCodeRepository
from app.schemas.interview_schema import GetFeedbackRequest, GetFeedbackResponse


class GetFeedbackUseCase:
    def __init__(
        self,
        interview_repository: InterviewRepository,
        source_code_repository: SourceCodeRepository,
        llm_client: LLMClient,
        source_code_dir: Path = Path("tmp"),
    ) -> None:
        self.interview_repository = interview_repository
        self.source_code_repository = source_code_repository
        self.llm_client = llm_client
        self.source_code_dir = source_code_dir

    def execute(self, request: GetFeedbackRequest) -> GetFeedbackResponse:
        question = self.interview_repository.get_question(
            request.interview_id,
            request.question_id,
        )

        question.append_chat_history(
            ChatMessage(
                role="user",
                message=request.message,
            )
        )

        session_dir = self.source_code_dir / request.interview_id
        source_code = self.source_code_repository.get_source_code(session_dir)

        feedback = self.llm_client.generate_feedback(source_code, question)

        question.score = feedback.score
        question.append_chat_history(
            ChatMessage(
                role="model",
                message=feedback.comment,
            )
        )

        self.interview_repository.update_question(
            request.interview_id,
            request.question_id,
            question,
        )

        return GetFeedbackResponse(
            interview_id=request.interview_id,
            question_id=request.question_id,
            score=feedback.score,
            comment=feedback.comment,
        )
