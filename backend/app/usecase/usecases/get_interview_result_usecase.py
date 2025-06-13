from app.domain.llm_clients.llm_client import LLMClient
from app.domain.repositories.interview_repository import InterviewRepository
from app.schemas.interview_schema import (
    GetInterviewResultRequest,
    GetInterviewResultResponse,
)


class GetInterviewResultUseCase:
    first_question_id = 1

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
        """
        # FIXME: 質問IDが連番であることを仮定している
        first_question = self.interview_repository.get_question(
            request.interview_id,
            str(self.first_question_id),
        )

        difficulty = first_question.difficulty
        scores = [first_question.score]
        chat_histories = [first_question.chat_history]

        for question_id in range(
            self.first_question_id + 1,
            first_question.total_question + 1,
        ):
            question = self.interview_repository.get_question(
                request.interview_id,
                str(question_id),
            )
            scores.append(question.score)
            chat_histories.append(question.chat_history)

        general_review = self.llm_client.generate_general_review(
            difficulty,
            chat_histories,
        )

        return GetInterviewResultResponse(
            interview_id=request.interview_id,
            scores=scores,
            general_review=general_review,
        )
