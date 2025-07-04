from __future__ import annotations


class InterviewChatResponse:
    """面接チャットの応答"""

    @property
    def score(self) -> int:
        return self._score

    @property
    def response(self) -> str:
        return self._response

    @property
    def continue_(self) -> bool:
        return self._continue_

    def __init__(self, score: int, response: str, continue_: bool) -> None:
        self._score = score
        self._response = response
        self._continue_ = continue_

    @classmethod
    def from_dict(cls, data: dict) -> InterviewChatResponse:
        if "score" not in data:
            raise ValueError("scoreが存在しません")
        if "response" not in data:
            raise ValueError("responseが存在しません")
        if "continue_" not in data:
            raise ValueError("continue_が存在しません")

        return cls(
            score=data["score"],
            response=data["response"],
            continue_=data["continue_"],
        )
