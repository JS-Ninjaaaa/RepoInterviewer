import random

import pytest
from app.domain.entities.chat_history import ChatHistory
from app.domain.entities.difficulty import Difficulty
from app.domain.entities.interview_question import InterviewQuestion
from app.domain.llm_clients.llm_client import LLMClient
from app.domain.repositories.interview_repository import InterviewRepository
from app.usecase.dtos.interview_dto import GetInterviewResultRequest
from app.usecase.usecases.get_interview_result_usecase import GetInterviewResultUseCase

# テストデータ
interview_id = "b5d0d93a-737b-4f90-81dc-bb58a2cba892"
total_question = 4
max_score = 100 // total_question
overall_review = "総評"


@pytest.fixture
def get_interview_result_usecase(
    mock_interview_repository,
    mock_llm_client,
) -> GetInterviewResultUseCase:
    return GetInterviewResultUseCase(
        interview_repository=mock_interview_repository,
        llm_client=mock_llm_client,
    )


def test_execute_success(
    get_interview_result_usecase: GetInterviewResultUseCase,
    mock_interview_repository: InterviewRepository,
    mock_llm_client: LLMClient,
):
    # モックの設定
    questions = [
        InterviewQuestion(
            interview_id=interview_id,
            question_id=str(i),
            difficulty=Difficulty.normal,
            total_question=total_question,
            chat_history=ChatHistory(),
            score=random.randint(0, max_score),
        )
        for i in range(1, total_question + 1)
    ]
    mock_interview_repository.get_all_questions.return_value = questions
    mock_llm_client.generate_overall_review.return_value = overall_review

    # リクエストの準備
    request = GetInterviewResultRequest(interview_id=interview_id)

    # テスト実行
    response = get_interview_result_usecase.execute(request)

    # 戻り値の検証
    assert response.interview_id == interview_id
    assert len(response.scores) == total_question
    assert response.overall_review == overall_review

    # リポジトリの呼び出し確認
    assert mock_interview_repository.get_all_questions.call_count == 1

    # LLMクライアントの呼び出し確認
    mock_llm_client.generate_overall_review.assert_called_once_with(
        Difficulty.normal,
        [question.chat_history for question in questions],
    )


def test_execute_failure_when_interview_not_found(
    get_interview_result_usecase: GetInterviewResultUseCase,
    mock_interview_repository: InterviewRepository,
    mock_llm_client: LLMClient,
):
    # モックの設定
    mock_interview_repository.get_all_questions.side_effect = Exception()

    # リクエストの準備
    request = GetInterviewResultRequest(interview_id=interview_id)

    # テスト実行と例外の検証
    with pytest.raises(Exception):
        get_interview_result_usecase.execute(request)

    # リポジトリの呼び出し確認
    mock_interview_repository.get_all_questions.assert_called_once()
    mock_llm_client.generate_overall_review.assert_not_called()


def test_execute_failure_when_overall_review_generation_fails(
    get_interview_result_usecase: GetInterviewResultUseCase,
    mock_interview_repository: InterviewRepository,
    mock_llm_client: LLMClient,
):
    # モックの設定
    questions = [
        InterviewQuestion(
            interview_id=interview_id,
            question_id=str(i),
            difficulty=Difficulty.normal,
            total_question=total_question,
            chat_history=ChatHistory(),
            score=random.randint(0, max_score),
        )
        for i in range(1, total_question + 1)
    ]
    mock_interview_repository.get_all_questions.return_value = questions
    mock_llm_client.generate_overall_review.side_effect = Exception()

    # リクエストの準備
    request = GetInterviewResultRequest(interview_id=interview_id)

    # テスト実行と例外の検証
    with pytest.raises(Exception):
        get_interview_result_usecase.execute(request)

    # リポジトリの呼び出し確認
    assert mock_interview_repository.get_all_questions.call_count == 1

    # LLMクライアントの呼び出し確認
    mock_llm_client.generate_overall_review.assert_called_once_with(
        Difficulty.normal,
        [question.chat_history for question in questions],
    )
