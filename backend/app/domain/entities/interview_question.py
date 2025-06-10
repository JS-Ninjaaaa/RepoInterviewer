from __future__ import annotations

from app.domain.entities.chat_history import ChatHistory, ChatMessage
from app.domain.entities.difficulty import Difficulty


class InterviewQuestion:
    """面接の質問

    Attributes:
        interview_id (str): 面接ID
        question_id (str): 質問ID
        difficulty (Difficulty): 難易度
        max_score (int): 最大スコア
        score (int): スコア
        chat_history (ChatHistory): 会話履歴
    """

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
    def max_score(self) -> int:
        return self._max_score

    @property
    def score(self) -> int:
        return self._score

    @property
    def chat_history(self) -> ChatHistory:
        return self._chat_history

    @score.setter
    def score(self, value: int):
        if value < 0 or value > self.max_score:
            raise ValueError(
                f"スコアは0から最大スコア({self.max_score})までの間でなければなりません"
            )

        self._score = value

    def __init__(
        self,
        interview_id: str,
        question_id: str,
        difficulty: Difficulty,
        max_score: int,
        chat_history: ChatHistory,
        score: int = 0,
    ):
        """コンストラクタ

        Args:
            interview_id (str): 面接ID
            question_id (str): 質問ID
            difficulty (Difficulty): 難易度
            max_score (int): 最大スコア
            chat_history (ChatHistory): 会話履歴
            score (int): スコア
        """
        self._interview_id = interview_id
        self._question_id = question_id
        self._difficulty = difficulty
        self._max_score = max_score
        self._chat_history = chat_history
        self._score = score

    def append_chat_history(self, message: ChatMessage):
        """会話履歴にメッセージを追加する

        Args:
            message (ChatMessage): 追加するメッセージ
        """
        self._chat_history.append_message(message)

    def to_dict(self) -> dict:
        """辞書に変換する"""
        return {
            "interview_id": self._interview_id,
            "question_id": self._question_id,
            "difficulty": self._difficulty.value,
            "max_score": self._max_score,
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
        if "max_score" not in data:
            raise ValueError("max_scoreが存在しません")
        if "score" not in data:
            raise ValueError("scoreが存在しません")
        if "chat_history" not in data:
            raise ValueError("chat_historyが存在しません")

        return cls(
            interview_id=data["interview_id"],
            question_id=data["question_id"],
            difficulty=Difficulty(data["difficulty"]),
            max_score=data["max_score"],
            score=data["score"],
            chat_history=ChatHistory.from_dict(data["chat_history"]),
        )
