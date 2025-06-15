from app.domain.llm_clients.llm_client import LLMClient
from app.domain.repositories.interview_repository import InterviewRepository
from app.usecase.dtos.interview_dto import (
    GetInterviewResultRequest,
    GetInterviewResultResponse,
)


class GetInterviewResultUseCase:
    def __init__(
        self,
        interview_repository: InterviewRepository,
        llm_client: LLMClient,
    ):
        """コンストラクタ

        Args:
            interview_repository (InterviewRepository): 面接リポジトリ
            llm_client (LLMClient): LLMクライアント
        """
        self.interview_repository = interview_repository
        self.llm_client = llm_client

    def execute(self, request: GetInterviewResultRequest) -> GetInterviewResultResponse:
        """面接結果を取得する

        Args:
            request (GetInterviewResultRequest): 面接結果を取得するリクエスト

        Returns:
            GetInterviewResultResponse: 面接結果を取得した結果

        Raises:
            Exception: 面接結果が存在しない場合
        """
        questions = self.interview_repository.get_all_questions(request.interview_id)

        if len(questions) == 0:
            raise Exception("面接結果が存在しません")

        difficulty = questions[0].difficulty
        scores = [question.score for question in questions]
        chat_histories = [question.chat_history for question in questions]

        overall_review = self.llm_client.generate_general_review(
            difficulty,
            chat_histories,
        )

        return GetInterviewResultResponse(
            interview_id=request.interview_id,
            scores=scores,
            overall_review=overall_review,
        )
