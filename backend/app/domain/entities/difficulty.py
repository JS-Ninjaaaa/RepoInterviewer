from enum import Enum


class Difficulty(Enum):
    """面接の難易度

    Attributes:
        easy (str): 初級
        normal (str): 中級
        hard (str): 上級
        extreme (str): 激詰め
    """

    easy = "easy"
    normal = "normal"
    hard = "hard"
    extreme = "extreme"

    def is_deep_mode(self) -> bool:
        return self in (Difficulty.hard, Difficulty.extreme)
