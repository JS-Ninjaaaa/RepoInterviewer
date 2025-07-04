from pathlib import Path

from app.domain.entities.chat_history import ChatMessage
from app.domain.llm_clients.llm_client import LLMClient
from app.domain.repositories.interview_repository import InterviewRepository
from app.domain.repositories.source_code_repository import SourceCodeRepository
from app.usecase.dtos.interview_dto import GetResponseRequest, GetResponseResponse


class GetResponseUseCase:

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

    def execute(self, request: GetResponseRequest) -> GetResponseResponse:
        """ユーザーの回答に対するLLMからの返答を生成する

        Args:
            request (GetResponseRequest): ユーザーの回答に対するLLMからの返答を生成するリクエスト

        Returns:
            GetResponseResponse: ユーザーの回答に対するLLMからの返答を生成した結果
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

        if question.can_continue_question:
            # 深堀りの質問を返す
            response = self.llm_client.generate_chat_response(source_code, question)
        else:
            # フィードバックと点数を返す
            response = self.llm_client.generate_feedback(source_code, question)

        question.score = response.score
        question.append_chat_history(
            ChatMessage(role="model", message=response.response)
        )

        self.interview_repository.update_question(
            request.interview_id,
            request.question_id,
            question,
        )

        return GetResponseResponse(
            interview_id=request.interview_id,
            question_id=request.question_id,
            score=response.score,
            response=response.response,
            continue_=response.continue_,
        )
