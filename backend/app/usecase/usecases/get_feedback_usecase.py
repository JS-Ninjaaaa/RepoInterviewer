from pathlib import Path

from app.domain.entities.chat_history import ChatMessage
from app.domain.entities.difficulty import Difficulty
from app.domain.llm_clients.llm_client import LLMClient
from app.domain.repositories.interview_repository import InterviewRepository
from app.domain.repositories.source_code_repository import SourceCodeRepository
from app.usecase.dtos.interview_dto import GetFeedbackRequest, GetFeedbackResponse


class GetFeedbackUseCase:
    DEEP_QUESTION_LIMIT = 3
    def __init__(
        self,
        interview_repository: InterviewRepository,
        source_code_repository: SourceCodeRepository,
        llm_client: LLMClient,
        source_code_dir: Path = Path("tmp"),
    ) -> None:
        """コンストラクタ

        Args:
            interview_repository (InterviewRepository): 面接リポジトリ
            source_code_repository (SourceCodeRepository): ソースコードリポジトリ
            llm_client (LLMClient): LLMクライアント
            source_code_dir (Path): ソースコードを保存するディレクトリ
        """
        self.interview_repository = interview_repository
        self.source_code_repository = source_code_repository
        self.llm_client = llm_client
        self.source_code_dir = source_code_dir

    def execute(self, request: GetFeedbackRequest) -> GetFeedbackResponse:
        """フィードバックを生成する

        Args:
            request (GetFeedbackRequest): フィードバックを生成するリクエスト

        Returns:
            GetFeedbackResponse: フィードバックを生成した結果
        """
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
        # 深堀り質問 or 質問
        # 質問状況を特定（深堀り条件か？）
        user_message_count = 0

        is_deep_question = question.difficulty in (Difficulty.hard, Difficulty.extreme)
        for message in question.chat_history.chat_history:
            if message.role == "user":
                user_message_count += 1

        if user_message_count < self.DEEP_QUESTION_LIMIT and is_deep_question:
            # 深堀り
            feedback = self.llm_client.generate_chat_response(source_code, question)
            continue_flag = True
            question.append_chat_history(
                ChatMessage(role="model", message=feedback.comment)
            )
        else:
            # 通常質問
            feedback = self.llm_client.generate_feedback(source_code, question)
            question.score = feedback.score
            question.append_chat_history(
                ChatMessage(role="model", message=feedback.comment)
            )
            continue_flag = False

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
            continue_=continue_flag
        )
