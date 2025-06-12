from pathlib import Path
from uuid import uuid4

from app.domain.entities.chat_history import ChatHistory, ChatMessage
from app.domain.entities.interview_question import InterviewQuestion
from app.domain.llm_clients.llm_client import LLMClient
from app.domain.repositories.interview_repository import InterviewRepository
from app.domain.repositories.source_code_repository import SourceCodeRepository
from app.schemas.interview_schema import SetUpInterviewRequest, SetUpInterviewResponse


class SetUpInterviewUseCase:
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

    def execute(self, request: SetUpInterviewRequest) -> SetUpInterviewResponse:
        """面接を設定する

        Args:
            request (SetUpInterviewRequest): 面接を設定するリクエスト

        Returns:
            SetUpInterviewResponse: 面接を設定した結果
        """
        interview_id = str(uuid4())

        session_dir = self.source_code_dir / interview_id
        saved_code = self.source_code_repository.extract_zip(
            request.source_code,
            session_dir,
        )

        questions = self.llm_client.generate_questions(
            saved_code,
            request.difficulty,
            request.total_question,
        )

        interview_questions = [
            InterviewQuestion(
                interview_id=interview_id,
                question_id=str(i + 1),
                difficulty=request.difficulty,
                total_question=request.total_question,
                chat_history=ChatHistory([ChatMessage(role="model", message=question)]),
            )
            for i, question in enumerate(questions)
        ]

        self.interview_repository.create_interview(interview_questions)

        return SetUpInterviewResponse(
            interview_id=interview_id,
            first_question=questions[0],
        )
