from __future__ import annotations


class ChatMessage:
    """会話のメッセージ

    Attributes:
        role (str): メッセージの発言者
        message (str): メッセージの内容
    """

    def __init__(self, role: str, message: str):
        self.role = role
        self.message = message

    def to_dict(self) -> dict:
        """辞書に変換する"""
        return {"role": self.role, "content": self.message}

    @classmethod
    def from_dict(cls, data: dict) -> ChatMessage:
        """辞書からインスタンスを生成する"""
        if "role" not in data:
            raise ValueError("roleが存在しません")

        if "content" not in data:
            raise ValueError("contentが存在しません")

        return cls(
            role=data["role"],
            message=data["content"],
        )


class ChatHistory:
    """会話履歴

    Attributes:
        chat_history (list[ChatMessage]): 会話履歴
    """

    def __init__(self, messages: list[ChatMessage] = None):
        """コンストラクタ

        Args:
            messages (list[ChatMessage], optional): 会話履歴
        """
        self.chat_history = messages if messages is not None else []

    def append_message(self, message: ChatMessage):
        """会話履歴にメッセージを追加する

        Args:
            message (ChatMessage): 追加するメッセージ
        """
        self.chat_history.append(message)

    def to_dict(self) -> dict:
        """辞書に変換する"""
        return [message.to_dict() for message in self.chat_history]

    @classmethod
    def from_dict(cls, data: dict) -> ChatHistory:
        """辞書からインスタンスを生成する"""
        return cls(
            messages=[ChatMessage.from_dict(message) for message in data],
        )
