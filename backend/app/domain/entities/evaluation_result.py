class QuestionEvaluationResult:
    """質問の評価結果

    Attributes:
        score (int): 評価結果のスコア
        comment (str): 評価結果のコメント
    """

    @property
    def score(self) -> int:
        return self._score

    @property
    def comment(self) -> str:
        return self._comment

    def __init__(self, score: int, comment: str) -> None:
        self._score = score
        self._comment = comment

    @classmethod
    def from_dict(cls, data: dict) -> "QuestionEvaluationResult":
        if "score" not in data:
            raise ValueError("scoreが存在しません")
        if "comment" not in data:
            raise ValueError("commentが存在しません")

        return cls(
            score=data["score"],
            comment=data["comment"],
        )
