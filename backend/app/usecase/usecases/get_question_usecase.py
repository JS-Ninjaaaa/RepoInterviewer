from app.domain.repositories.interview_repository import InterviewRepository
from app.usecase.dtos.interview_dto import GetQuestionRequest, GetQuestionResponse


class GetQuestionUseCase:
    def __init__(self, interview_repository: InterviewRepository) -> None:
        """コンストラクタ

        Args:
            interview_repository (InterviewRepository): 面接リポジトリ
        """
        self.interview_repository = interview_repository

    def execute(self, request: GetQuestionRequest) -> GetQuestionResponse | None:
        """質問文を取得する

        Args:
            request (GetQuestionRequest): 質問文を取得するリクエスト

        Returns:
            GetQuestionResponse: 質問文を取得した結果

        Raises:
            Exception: 質問文が存在しない場合
        """
        # 質問の情報を取得する
        question = self.interview_repository.get_question(
            request.interview_id,
            request.question_id,
        )

        if question is None:
            return None

        # 質問文を取得する
        chat_history = question.chat_history.chat_history
        if len(chat_history) == 0:
            raise Exception("質問文が存在しません")

        question_text = chat_history[0].message

        # 質問文を返す
        return GetQuestionResponse(
            interview_id=request.interview_id,
            question_id=request.question_id,
            question=question_text,
        )
