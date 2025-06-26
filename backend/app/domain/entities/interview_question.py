from __future__ import annotations

from app.domain.entities.chat_history import ChatHistory, ChatMessage
from app.domain.entities.difficulty import Difficulty


class InterviewQuestion:
    """面接の質問

    Attributes:
        interview_id (str): 面接ID
        question_id (str): 質問ID
        difficulty (Difficulty): 難易度
        total_question (int): 質問数
        score (int): スコア
        chat_history (ChatHistory): 会話履歴
    """

    DEEP_MODE_ROUND_LIMIT = 3

    @property
    def interview_id(self) -> str:
        return self._interview_id

    @property
    def question_id(self) -> str:
        return self._question_id

    @property
    def difficulty(self) -> Difficulty:
        return self._difficulty

    @property
    def total_question(self) -> int:
        return self._total_question

    @property
    def max_score(self):
        return 100 // self.total_question

    @property
    def score(self) -> int:
        return self._score

    @property
    def chat_history(self) -> ChatHistory:
        return self._chat_history

    @score.setter
    def score(self, value: int):
        if value < 0 or self.max_score < value:
            raise ValueError(
                f"スコアは0から最大スコア({self.max_score})までの間でなければなりません"
            )

        self._score = value

    @property
    def can_continue_question(self) -> bool:
        match self.difficulty:
            case Difficulty.easy | Difficulty.normal:
                return False
            case Difficulty.hard | Difficulty.extreme:
                return self.chat_history.round_count < self.DEEP_MODE_ROUND_LIMIT

    def __init__(
        self,
        interview_id: str,
        question_id: str,
        difficulty: Difficulty,
        total_question: int,
        chat_history: ChatHistory,
        score: int = 0,
    ):
        """コンストラクタ

        Args:
            interview_id (str): 面接ID
            question_id (str): 質問ID
            difficulty (Difficulty): 難易度
            total_question (int): 質問数
            chat_history (ChatHistory): 会話履歴
            score (int): スコア
        """
        self._interview_id = interview_id
        self._question_id = question_id
        self._difficulty = difficulty
        self._total_question = total_question
        self._chat_history = chat_history
        self._score = score

    def append_chat_history(self, message: ChatMessage):
        """会話履歴にメッセージを追加する

        Args:
            message (ChatMessage): 追加するメッセージ
        """
        self._chat_history.append(message)

    def to_dict(self) -> dict:
        """辞書に変換する"""
        return {
            "interview_id": self._interview_id,
            "question_id": self._question_id,
            "difficulty": self._difficulty.value,
            "total_question": self._total_question,
            "score": self._score,
            "chat_history": self._chat_history.to_dict(),
        }

    @classmethod
    def from_dict(cls, data: dict) -> InterviewQuestion:
        """辞書からインスタンスを生成する"""
        if "interview_id" not in data:
            raise ValueError("interview_idが存在しません")
        if "question_id" not in data:
            raise ValueError("question_idが存在しません")
        if "difficulty" not in data:
            raise ValueError("difficultyが存在しません")
        if "total_question" not in data:
            raise ValueError("total_questionが存在しません")
        if "score" not in data:
            raise ValueError("scoreが存在しません")
        if "chat_history" not in data:
            raise ValueError("chat_historyが存在しません")

        return cls(
            interview_id=data["interview_id"],
            question_id=data["question_id"],
            difficulty=Difficulty(data["difficulty"]),
            total_question=data["total_question"],
            score=data["score"],
            chat_history=ChatHistory.from_dict(data["chat_history"]),
        )
