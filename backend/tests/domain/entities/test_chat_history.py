from app.domain.entities.chat_history import ChatHistory, ChatMessage


def test_append_message():
    """会話履歴にメッセージを追加するテスト"""
    chat_history = ChatHistory()

    assert len(chat_history.chat_history) == 0

    user_message = ChatMessage(role="user", message="こんにちは")
    chat_history.append_message(user_message)

    assert len(chat_history.chat_history) == 1

    first_message = chat_history.chat_history[0]
    assert first_message.role == user_message.role
    assert first_message.message == user_message.message
