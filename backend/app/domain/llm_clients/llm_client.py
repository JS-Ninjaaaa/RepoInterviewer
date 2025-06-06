from abc import ABC, abstractmethod

from app.domain.entities.chat_history import ChatHistory
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
    def generate_question(self, source_code: SourceCode) -> list[str]:
        """質問を生成する

        Args:
            source_code (SourceCode): ソースコード

        Returns:
            list[str]: 質問
        """
        pass

    @abstractmethod
    def generate_feedback(
        self,
        source_code: SourceCode,
        chat_history: ChatHistory,
    ) -> str:
        """深掘りなしの面接においてフィードバックを生成する

        Args:
            source_code (SourceCode): ソースコード
            chat_history (ChatHistory): 会話履歴

        Returns:
            str: フィードバック
        """
        pass

    @abstractmethod
    def generate_chat_response(
        self,
        source_code: SourceCode,
        chat_history: ChatHistory,
    ) -> dict:
        """深掘りありの面接において会話の応答を生成する

        Args:
            source_code (SourceCode): ソースコード
            chat_history (ChatHistory): 会話履歴

        Returns:
            dict: 会話の応答
        """
        pass

    @abstractmethod
    def generate_general_review(self, chat_history: ChatHistory) -> str:
        """総評を生成する

        Args:
            chat_history (ChatHistory): 会話履歴

        Returns:
            str: 総評
        """
        pass
