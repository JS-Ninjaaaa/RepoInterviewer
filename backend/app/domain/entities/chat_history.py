class ChatMessage:
    """会話のメッセージ

    Attributes:
        role (str): メッセージの発言者
        message (str): メッセージの内容
    """

    def __init__(self, role: str, message: str):
        self.role = role
        self.message = message


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
