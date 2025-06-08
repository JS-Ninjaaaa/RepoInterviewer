class QuestionEvaluationResult:
    def __init__(self, score: int, comment: str) -> None:
        self.score = score
        self.comment = comment

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
