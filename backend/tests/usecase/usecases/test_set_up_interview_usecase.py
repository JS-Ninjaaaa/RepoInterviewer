import pytest
from app.domain.entities.chat_history import ChatHistory
from app.domain.entities.difficulty import Difficulty
from app.domain.entities.interview_question import InterviewQuestion
from app.domain.entities.source_code import SourceCode
from app.domain.llm_clients.llm_client import LLMClient
from app.domain.repositories.interview_repository import InterviewRepository
from app.domain.repositories.source_code_repository import SourceCodeRepository
from app.schemas.interview_schema import SetUpInterviewRequest, SetUpInterviewResponse
from app.usecase.usecases.setup_interview_usecase import SetUpInterviewUseCase

# テストデータ
source_code = b"test_zip_content"
difficulty = Difficulty.normal
total_question = 3
questions = ["質問1", "質問2", "質問3"]
extracted_code = SourceCode(
    {
        "main.py": "print('Hello, World!')",
    }
)


@pytest.fixture
def setup_interview_usecase(
    mock_interview_repository,
    mock_source_code_repository,
    mock_llm_client,
    temp_dir,
) -> SetUpInterviewUseCase:
    return SetUpInterviewUseCase(
        interview_repository=mock_interview_repository,
        source_code_repository=mock_source_code_repository,
        llm_client=mock_llm_client,
        source_code_dir=temp_dir,
    )


def test_execute_success(
    setup_interview_usecase: SetUpInterviewUseCase,
    mock_interview_repository: InterviewRepository,
    mock_source_code_repository: SourceCodeRepository,
    mock_llm_client: LLMClient,
):
    # リクエストの準備
    request = SetUpInterviewRequest(
        source_code=source_code,
        difficulty=difficulty,
        total_question=total_question,
    )

    # モックの振る舞いを設定
    mock_source_code_repository.extract_zip.return_value = extracted_code
    mock_llm_client.generate_questions.return_value = questions

    # テスト実行
    response = setup_interview_usecase.execute(request)

    # レスポンスの検証
    assert isinstance(response, SetUpInterviewResponse)
    assert response.interview_id is not None
    assert response.first_question == questions[0]

    # モックの呼び出し確認
    mock_source_code_repository.extract_zip.assert_called_once()
    mock_llm_client.generate_questions.assert_called_once_with(
        extracted_code,
        difficulty,
        total_question,
    )
    mock_interview_repository.create_interview.assert_called_once()

    # 作成された質問の検証
    call_args_tuple = mock_interview_repository.create_interview.call_args[0]
    created_questions = call_args_tuple[0]
    assert len(created_questions) == total_question

    for i, question in enumerate(created_questions):
        assert isinstance(question, InterviewQuestion)
        assert question.interview_id == response.interview_id
        assert question.question_id == str(i + 1)
        assert question.difficulty == difficulty
        assert question.max_score == 100 // total_question
        assert question.score == 0

        assert isinstance(question.chat_history, ChatHistory)
        chat_history = question.chat_history.chat_history
        assert len(chat_history) == 1

        message = chat_history[0]
        assert message.role == "model"
        assert message.message == questions[i]


def test_execute_failure_when_extract_zip_fails(
    setup_interview_usecase: SetUpInterviewUseCase,
    mock_interview_repository: InterviewRepository,
    mock_source_code_repository: SourceCodeRepository,
    mock_llm_client: LLMClient,
):
    # リクエストの準備
    request = SetUpInterviewRequest(
        source_code=source_code,
        difficulty=difficulty,
        total_question=total_question,
    )

    # モックの振る舞いを設定
    mock_source_code_repository.extract_zip.side_effect = Exception()

    # テスト実行と例外の検証
    with pytest.raises(Exception):
        setup_interview_usecase.execute(request)

    # モックの呼び出し確認
    mock_source_code_repository.extract_zip.assert_called_once()
    mock_llm_client.generate_questions.assert_not_called()
    mock_interview_repository.create_interview.assert_not_called()


def test_execute_failure_when_generate_questions_fails(
    setup_interview_usecase: SetUpInterviewUseCase,
    mock_interview_repository: InterviewRepository,
    mock_source_code_repository: SourceCodeRepository,
    mock_llm_client: LLMClient,
):
    # リクエストの準備
    request = SetUpInterviewRequest(
        source_code=source_code,
        difficulty=difficulty,
        total_question=total_question,
    )

    # モックの振る舞いを設定
    mock_source_code_repository.extract_zip.return_value = extracted_code
    mock_llm_client.generate_questions.side_effect = Exception()

    # テスト実行と例外の検証
    with pytest.raises(Exception):
        setup_interview_usecase.execute(request)

    # モックの呼び出し確認
    mock_source_code_repository.extract_zip.assert_called_once()
    mock_llm_client.generate_questions.assert_called_once()
    mock_interview_repository.create_interview.assert_not_called()


def test_execute_failure_when_create_interview_fails(
    setup_interview_usecase: SetUpInterviewUseCase,
    mock_interview_repository: InterviewRepository,
    mock_source_code_repository: SourceCodeRepository,
    mock_llm_client: LLMClient,
):
    # リクエストの準備
    request = SetUpInterviewRequest(
        source_code=source_code,
        difficulty=difficulty,
        total_question=total_question,
    )

    # モックの振る舞いを設定
    mock_source_code_repository.extract_zip.return_value = extracted_code
    mock_llm_client.generate_questions.return_value = questions
    mock_interview_repository.create_interview.side_effect = Exception()

    # テスト実行と例外の検証
    with pytest.raises(Exception):
        setup_interview_usecase.execute(request)

    # モックの呼び出し確認
    mock_source_code_repository.extract_zip.assert_called_once()
    mock_llm_client.generate_questions.assert_called_once()
    mock_interview_repository.create_interview.assert_called_once()
