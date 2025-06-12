from app.domain.repositories.interview_repository import InterviewRepository
from app.schemas.interview_schema import GetQuestionRequest, GetQuestionResponse


class GetQuestionUseCase:
    def __init__(self, interview_repository: InterviewRepository) -> None:
        self.interview_repository = interview_repository

    def execute(self, request: GetQuestionRequest) -> GetQuestionResponse:
        # 質問の情報を取得する
        question = self.interview_repository.get_question(
            request.interview_id,
            request.question_id,
        )

        if question is None:
            return None

        # 質問文を取得する
        chat_history = question.chat_history.chat_history
        question_text = chat_history[0].message

        # 質問文を返す
        return GetQuestionResponse(
            interview_id=request.interview_id,
            question_id=request.question_id,
            question=question_text,
        )
