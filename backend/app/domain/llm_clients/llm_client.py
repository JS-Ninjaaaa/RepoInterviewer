from abc import ABC, abstractmethod

from app.domain.entities.difficulty import Difficulty
from app.domain.entities.evaluation_result import QuestionEvaluationResult
from app.domain.entities.interview_question import InterviewQuestion
from app.domain.entities.source_code import SourceCode


class LLMClient(ABC):
    """LLMクライアントのインタフェース"""

    @abstractmethod
    def chat_once(self, message: str) -> str:
        """1回だけ会話を行う

        Args:
            message (str): メッセージ

        Returns:
            str: メッセージ
        """
        pass

    @abstractmethod
    def generate_questions(
        self,
        source_code: SourceCode,
        difficulty: Difficulty,
        total_question: int,
    ) -> list[str]:
        """質問を生成する

        Args:
            source_code (SourceCode): ソースコード
            difficulty (Difficulty): 難易度
            total_question (int): 質問数

        Returns:
            list[str]: 質問文のリスト
        """
        pass

    @abstractmethod
    def generate_feedback(
        self,
        source_code: SourceCode,
        question: InterviewQuestion,
    ) -> QuestionEvaluationResult:
        """深掘りなしの面接においてフィードバックを生成する

        Args:
            source_code (SourceCode): ソースコード
            question (InterviewQuestion): 質問の情報

        Returns:
            QuestionEvaluationResult: 質問の評価結果
        """
        pass

    @abstractmethod
    def generate_chat_response(
        self,
        source_code: SourceCode,
        question: InterviewQuestion,
    ) -> QuestionEvaluationResult:
        """深掘りありの面接において会話の応答を生成する

        Args:
            source_code (SourceCode): ソースコード
            question (InterviewQuestion): 質問の情報

        Returns:
            QuestionEvaluationResult: 質問の評価結果
        """
        pass

    @abstractmethod
    def generate_general_review(self, question: InterviewQuestion) -> str:
        """総評を生成する

        Args:
            question (InterviewQuestion): 質問の情報

        Returns:
            str: 総評文
        """
        pass
