import pytest
from app.domain.entities.chat_history import ChatHistory, ChatMessage
from app.domain.entities.difficulty import Difficulty
from app.domain.entities.interview_question import InterviewQuestion
from app.domain.entities.source_code import SourceCode
from app.domain.llm_clients.llm_client import LLMClient
from app.domain.repositories.interview_repository import InterviewRepository
from app.domain.repositories.source_code_repository import SourceCodeRepository
from app.infrastructure.llm_clients.google.llm_client import InterviewFeedback
from app.usecase.dtos.interview_dto import GetFeedbackRequest
from app.usecase.usecases.get_feedback_usecase import GetFeedbackUseCase

# テストデータ
interview_id = "b5d0d93a-737b-4f90-81dc-bb58a2cba892"
question_id = "1"
user_message = "テストメッセージ"
source_code = SourceCode(
    {
        "main.py": "print('Hello, World!')",
    }
)
total_question = 4
feedback_score = 20
feedback_comment = "良いコードです"


@pytest.fixture
def get_feedback_usecase(
    mock_interview_repository,
    mock_source_code_repository,
    mock_llm_client,
    temp_dir,
) -> GetFeedbackUseCase:
    return GetFeedbackUseCase(
        interview_repository=mock_interview_repository,
        source_code_repository=mock_source_code_repository,
        llm_client=mock_llm_client,
        source_code_dir=temp_dir,
    )


def test_execute_success(
    get_feedback_usecase: GetFeedbackUseCase,
    mock_interview_repository: InterviewRepository,
    mock_source_code_repository: SourceCodeRepository,
    mock_llm_client: LLMClient,
):
    # モックの設定
    question = InterviewQuestion(
        interview_id=interview_id,
        question_id=question_id,
        difficulty=Difficulty.normal,
        total_question=total_question,
        chat_history=ChatHistory(),
        score=0,
    )
    mock_interview_repository.get_question.return_value = question
    mock_source_code_repository.get_source_code.return_value = source_code
    mock_llm_client.generate_feedback.return_value = InterviewFeedback(
        score=feedback_score,
        comment=feedback_comment,
    )

    # リクエストの準備
    request = GetFeedbackRequest(
        interview_id=interview_id,
        question_id=question_id,
        message=user_message,
    )

    # テスト実行
    response = get_feedback_usecase.execute(request)

    # 戻り値の検証
    assert response.interview_id == interview_id
    assert response.question_id == question_id
    assert response.score == feedback_score
    assert response.comment == feedback_comment
    assert response.continue_ is False

    # リポジトリの呼び出し確認
    mock_interview_repository.get_question.assert_called_once_with(
        interview_id,
        question_id,
    )
    mock_source_code_repository.get_source_code.assert_called_once()
    mock_llm_client.generate_feedback.assert_called_once_with(
        source_code,
        question,
    )
    mock_interview_repository.update_question.assert_called_once_with(
        interview_id,
        question_id,
        question,
    )

    # 会話履歴の更新確認
    chat_history = question.chat_history.chat_history
    assert len(chat_history) == 2
    assert chat_history[0].role == "user"
    assert chat_history[0].message == user_message
    assert chat_history[1].role == "model"
    assert chat_history[1].message == feedback_comment

    assert question.score == feedback_score

def test_execute_deep_interview_continue(
    get_feedback_usecase: GetFeedbackUseCase,
    mock_interview_repository: InterviewRepository,
    mock_source_code_repository: SourceCodeRepository,
    mock_llm_client: LLMClient,
):
    question = InterviewQuestion(
        interview_id=interview_id,
        question_id=question_id,
        difficulty=Difficulty.hard,
        total_question=total_question,
        chat_history=ChatHistory(),
        score=0,
    )
    mock_interview_repository.get_question.return_value = question
    mock_source_code_repository.get_source_code.return_value = source_code
    mock_llm_client.generate_chat_response.return_value = InterviewFeedback(
        score=0,
        comment=feedback_comment,
    )

    request = GetFeedbackRequest(
        interview_id=interview_id,
        question_id=question_id,
        message=user_message,
    )

    response = get_feedback_usecase.execute(request)

    assert response.continue_ is True
    mock_llm_client.generate_chat_response.assert_called_once()
    assert question.score == 0


def test_execute_deep_interview_final_feedback(
    get_feedback_usecase: GetFeedbackUseCase,
    mock_interview_repository: InterviewRepository,
    mock_source_code_repository: SourceCodeRepository,
    mock_llm_client: LLMClient,
):
    chat_history = ChatHistory(
        [
            ChatMessage(role="user", message="a1"),
            ChatMessage(role="model", message="q1"),
            ChatMessage(role="user", message="a2"),
            ChatMessage(role="model", message="q2"),
        ]
    )
    question = InterviewQuestion(
        interview_id=interview_id,
        question_id=question_id,
        difficulty=Difficulty.hard,
        total_question=total_question,
        chat_history=chat_history,
        score=0,
    )
    mock_interview_repository.get_question.return_value = question
    mock_source_code_repository.get_source_code.return_value = source_code
    mock_llm_client.generate_feedback.return_value = InterviewFeedback(
        score=feedback_score,
        comment=feedback_comment,
    )

    request = GetFeedbackRequest(
        interview_id=interview_id,
        question_id=question_id,
        message=user_message,
    )

    response = get_feedback_usecase.execute(request)

    assert response.continue_ is False
    assert response.score == feedback_score
    mock_llm_client.generate_feedback.assert_called_once()
    assert question.score == feedback_score

def test_execute_failure_when_interview_not_found(
    get_feedback_usecase: GetFeedbackUseCase,
    mock_interview_repository: InterviewRepository,
    mock_source_code_repository: SourceCodeRepository,
    mock_llm_client: LLMClient,
):
    # モックの設定
    mock_interview_repository.get_question.side_effect = Exception()

    # リクエストの準備
    request = GetFeedbackRequest(
        interview_id=interview_id,
        question_id=question_id,
        message=user_message,
    )

    # テスト実行と例外の検証
    with pytest.raises(Exception):
        get_feedback_usecase.execute(request)

    # リポジトリの呼び出し確認
    mock_interview_repository.get_question.assert_called_once_with(
        interview_id,
        question_id,
    )
    mock_source_code_repository.get_source_code.assert_not_called()
    mock_llm_client.generate_feedback.assert_not_called()
    mock_interview_repository.update_question.assert_not_called()


def test_execute_failure_when_source_code_not_found(
    get_feedback_usecase: GetFeedbackUseCase,
    mock_interview_repository: InterviewRepository,
    mock_source_code_repository: SourceCodeRepository,
    mock_llm_client: LLMClient,
):
    # モックの設定
    question = InterviewQuestion(
        interview_id=interview_id,
        question_id=question_id,
        difficulty=Difficulty.normal,
        total_question=total_question,
        chat_history=ChatHistory(),
        score=0,
    )
    mock_interview_repository.get_question.return_value = question
    mock_source_code_repository.get_source_code.side_effect = Exception()

    # リクエストの準備
    request = GetFeedbackRequest(
        interview_id=interview_id,
        question_id=question_id,
        message=user_message,
    )

    # テスト実行と例外の検証
    with pytest.raises(Exception):
        get_feedback_usecase.execute(request)

    # リポジトリの呼び出し確認
    mock_interview_repository.get_question.assert_called_once_with(
        interview_id,
        question_id,
    )
    mock_source_code_repository.get_source_code.assert_called_once()
    mock_llm_client.generate_feedback.assert_not_called()
    mock_interview_repository.update_question.assert_not_called()


def test_execute_failure_when_feedback_generation_fails(
    get_feedback_usecase: GetFeedbackUseCase,
    mock_interview_repository: InterviewRepository,
    mock_source_code_repository: SourceCodeRepository,
    mock_llm_client: LLMClient,
):
    # モックの設定
    question = InterviewQuestion(
        interview_id=interview_id,
        question_id=question_id,
        difficulty=Difficulty.normal,
        total_question=total_question,
        chat_history=ChatHistory(),
        score=0,
    )
    mock_interview_repository.get_question.return_value = question
    mock_source_code_repository.get_source_code.return_value = source_code
    mock_llm_client.generate_feedback.side_effect = Exception()

    # リクエストの準備
    request = GetFeedbackRequest(
        interview_id=interview_id,
        question_id=question_id,
        message=user_message,
    )

    # テスト実行と例外の検証
    with pytest.raises(Exception):
        get_feedback_usecase.execute(request)

    # リポジトリの呼び出し確認
    mock_interview_repository.get_question.assert_called_once_with(
        interview_id,
        question_id,
    )
    mock_source_code_repository.get_source_code.assert_called_once()
    mock_llm_client.generate_feedback.assert_called_once()
    mock_interview_repository.update_question.assert_not_called()


def test_execute_failure_when_score_exceeds_max_score(
    get_feedback_usecase: GetFeedbackUseCase,
    mock_interview_repository: InterviewRepository,
    mock_source_code_repository: SourceCodeRepository,
    mock_llm_client: LLMClient,
):
    # モックの設定
    question = InterviewQuestion(
        interview_id=interview_id,
        question_id=question_id,
        difficulty=Difficulty.normal,
        total_question=total_question,
        chat_history=ChatHistory(),
        score=0,
    )
    mock_interview_repository.get_question.return_value = question
    mock_source_code_repository.get_source_code.return_value = source_code
    mock_llm_client.generate_feedback.return_value = InterviewFeedback(
        score=question.max_score + 1,  # max_scoreより大きいスコア
        comment=feedback_comment,
    )

    # リクエストの準備
    request = GetFeedbackRequest(
        interview_id=interview_id,
        question_id=question_id,
        message=user_message,
    )

    # テスト実行と例外の検証
    with pytest.raises(ValueError):
        get_feedback_usecase.execute(request)

    # リポジトリの呼び出し確認
    mock_interview_repository.get_question.assert_called_once_with(
        interview_id,
        question_id,
    )
    mock_source_code_repository.get_source_code.assert_called_once()
    mock_llm_client.generate_feedback.assert_called_once()
    mock_interview_repository.update_question.assert_not_called()


def test_execute_failure_when_update_question_fails(
    get_feedback_usecase: GetFeedbackUseCase,
    mock_interview_repository: InterviewRepository,
    mock_source_code_repository: SourceCodeRepository,
    mock_llm_client: LLMClient,
):
    # モックの設定
    question = InterviewQuestion(
        interview_id=interview_id,
        question_id=question_id,
        difficulty=Difficulty.normal,
        total_question=total_question,
        chat_history=ChatHistory(),
        score=0,
    )
    mock_interview_repository.get_question.return_value = question
    mock_source_code_repository.get_source_code.return_value = source_code
    mock_llm_client.generate_feedback.return_value = InterviewFeedback(
        score=feedback_score,
        comment=feedback_comment,
    )
    mock_interview_repository.update_question.side_effect = Exception()

    # リクエストの準備
    request = GetFeedbackRequest(
        interview_id=interview_id,
        question_id=question_id,
        message=user_message,
    )

    # テスト実行と例外の検証
    with pytest.raises(Exception):
        get_feedback_usecase.execute(request)

    # リポジトリの呼び出し確認
    mock_interview_repository.get_question.assert_called_once_with(
        interview_id,
        question_id,
    )
    mock_source_code_repository.get_source_code.assert_called_once()
    mock_llm_client.generate_feedback.assert_called_once()
    mock_interview_repository.update_question.assert_called_once()
