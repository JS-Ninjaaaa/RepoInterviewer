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

    def __init__(
        self,
        interview_id: str,
        question_id: str,
        difficulty: Difficulty,
        max_score: int,
        chat_history: ChatHistory,
    ):
        """コンストラクタ

        Args:
            interview_id (str): 面接ID
            question_id (str): 質問ID
            difficulty (Difficulty): 難易度
            max_score (int): 最大スコア
            chat_history (ChatHistory): 会話履歴
        """
        self.interview_id = interview_id
        self.question_id = question_id
        self.difficulty = difficulty
        self.max_score = max_score
        self.chat_history = chat_history

    def get_chat_history(self) -> ChatHistory:
        """会話履歴を取得する

        Returns:
            ChatHistory: 会話履歴
        """
        return self.chat_history

    def append_chat_history(self, message: ChatMessage):
        """会話履歴にメッセージを追加する

        Args:
            message (ChatMessage): 追加するメッセージ
        """
        self.chat_history.append_message(message)
