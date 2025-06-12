import pytest
from app.domain.entities.chat_history import ChatHistory, ChatMessage
from app.domain.entities.difficulty import Difficulty
from app.domain.entities.interview_question import InterviewQuestion
from app.domain.repositories.interview_repository import InterviewRepository
from app.schemas.interview_schema import GetQuestionRequest
from app.usecase.usecases.get_question_usecase import GetQuestionUseCase

# テストデータ
interview_id = "b5d0d93a-737b-4f90-81dc-bb58a2cba892"
question_id = "1"
question_text = "このプログラムの最悪計算量を教えてください"


@pytest.fixture
def get_question_usecase(mock_interview_repository) -> GetQuestionUseCase:
    return GetQuestionUseCase(interview_repository=mock_interview_repository)


def test_execute_success(
    get_question_usecase: GetQuestionUseCase,
    mock_interview_repository: InterviewRepository,
):
    # モックの設定
    chat_history = ChatHistory()
    chat_history.append(ChatMessage(role="model", message=question_text))
    question = InterviewQuestion(
        interview_id=interview_id,
        question_id=question_id,
        difficulty=Difficulty.normal,
        total_question=4,
        chat_history=chat_history,
        score=0,
    )
    mock_interview_repository.get_question.return_value = question

    # リクエストの準備
    request = GetQuestionRequest(
        interview_id=interview_id,
        question_id=question_id,
    )

    # テスト実行
    response = get_question_usecase.execute(request)

    # 戻り値の検証
    assert response.interview_id == interview_id
    assert response.question_id == question_id
    assert response.question == question_text

    # リポジトリの呼び出し確認
    mock_interview_repository.get_question.assert_called_once_with(
        interview_id,
        question_id,
    )


def test_execute_failure_when_question_not_found(
    get_question_usecase: GetQuestionUseCase,
    mock_interview_repository: InterviewRepository,
):
    # モックの設定
    mock_interview_repository.get_question.return_value = None

    # リクエストの準備
    request = GetQuestionRequest(
        interview_id=interview_id,
        question_id=question_id,
    )

    # テスト実行
    response = get_question_usecase.execute(request)

    # 戻り値の検証
    assert response is None

    # リポジトリの呼び出し確認
    mock_interview_repository.get_question.assert_called_once_with(
        interview_id,
        question_id,
    )


def test_execute_failure_when_repository_raises_exception(
    get_question_usecase: GetQuestionUseCase,
    mock_interview_repository: InterviewRepository,
):
    # モックの設定
    mock_interview_repository.get_question.side_effect = Exception()

    # リクエストの準備
    request = GetQuestionRequest(
        interview_id=interview_id,
        question_id=question_id,
    )

    # テスト実行と例外の検証
    with pytest.raises(Exception):
        get_question_usecase.execute(request)

    # リポジトリの呼び出し確認
    mock_interview_repository.get_question.assert_called_once_with(
        interview_id,
        question_id,
    )
