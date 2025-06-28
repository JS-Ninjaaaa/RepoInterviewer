from unittest.mock import MagicMock

import pytest
from app.api.dependencies import get_question_usecase
from app.usecase.dtos.interview_dto import (
    GetQuestionRequest,
    GetQuestionResponse,
)
from app.usecase.usecases.get_question_usecase import GetQuestionUseCase
from fastapi import status
from fastapi.testclient import TestClient
from main import app

# テストデータ
interview_id = "70da67e2-899c-44fd-8c0b-491decaecb65"
question_id = "1"
question = "質問文"


@pytest.fixture
def mock_get_question_usecase():
    mock_usecase = MagicMock(spec=GetQuestionUseCase)
    app.dependency_overrides[get_question_usecase] = lambda: mock_usecase
    return mock_usecase


def test_get_question_success(
    client: TestClient,
    mock_get_question_usecase: GetQuestionUseCase,
):
    expected_response = GetQuestionResponse(
        interview_id=interview_id,
        question_id=question_id,
        question=question,
    )
    mock_get_question_usecase.execute.return_value = expected_response

    actual_response = client.get(
        f"/interview/{interview_id}?question_id={question_id}",
    )
    assert actual_response.status_code == status.HTTP_200_OK

    response_body = actual_response.json()
    assert response_body["question"] == question

    mock_get_question_usecase.execute.assert_called_once_with(
        GetQuestionRequest(
            interview_id=interview_id,
            question_id=question_id,
        )
    )


def test_get_question_not_found(
    client: TestClient,
    mock_get_question_usecase: GetQuestionUseCase,  # GCPのFirestoreへ接続しないため
):
    mock_get_question_usecase.execute.return_value = None

    response = client.get(
        f"/interview/{interview_id}?question_id={question_id}",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_question_missing_question_id(
    client: TestClient,
    mock_get_question_usecase: GetQuestionUseCase,  # GCPのFirestoreへ接続しないため
):
    response = client.get(
        f"/interview/{interview_id}",
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_get_question_use_case_raises_exception(
    client: TestClient,
    mock_get_question_usecase: GetQuestionUseCase,  # GCPのFirestoreへ接続しないため
):
    mock_get_question_usecase.execute.side_effect = Exception()

    with pytest.raises(Exception):
        client.get(
            f"/interview/{interview_id}?question_id={question_id}",
        )

    mock_get_question_usecase.execute.assert_called_once()
