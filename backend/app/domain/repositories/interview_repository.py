from abc import ABC, abstractmethod

from app.domain.entities.interview_question import InterviewQuestion


class InterviewRepository(ABC):
    """面接リポジトリのインタフェース"""

    @abstractmethod
    def create_interview(self, questions: list[InterviewQuestion]) -> None:
        """面接を作成する

        Args:
            questions (list[InterviewQuestion]): 面接の質問を格納したリスト
        """
        pass

    @abstractmethod
    def get_question(
        self,
        interview_id: str,
        question_id: str,
    ) -> InterviewQuestion | None:
        """質問の情報を取得する

        Args:
            interview_id (str): 面接ID
            question_id (str): 質問ID

        Returns:
            InterviewQuestion: 質問の情報
        """
        pass

    @abstractmethod
    def update_question(
        self,
        interview_id: str,
        question_id: str,
        question: InterviewQuestion,
    ) -> None:
        """質問の情報を更新する

        Args:
            interview_id (str): 面接ID
            question_id (str): 質問ID
            question (InterviewQuestion): 更新後の質問の情報
        """
        pass
