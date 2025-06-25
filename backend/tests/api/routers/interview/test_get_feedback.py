from unittest.mock import MagicMock

import pytest
from app.api.dependencies import get_feedback_usecase
from app.usecase.dtos.interview_dto import (
    GetFeedbackRequest,
    GetFeedbackResponse,
)
from app.usecase.usecases.get_feedback_usecase import GetFeedbackUseCase
from fastapi import status
from fastapi.testclient import TestClient
from main import app

# テストデータ
interview_id = "70da67e2-899c-44fd-8c0b-491decaecb65"
question_id = "1"
message = "テスト回答"
score = 80
comment = "良い回答です"


@pytest.fixture
def mock_get_feedback_usecase():
    mock_usecase = MagicMock(spec=GetFeedbackUseCase)
    app.dependency_overrides[get_feedback_usecase] = lambda: mock_usecase
    return mock_usecase


def test_get_feedback_success(
    client: TestClient,
    mock_get_feedback_usecase: GetFeedbackUseCase,
):
    expected_response = GetFeedbackResponse(
        interview_id=interview_id,
        question_id=question_id,
        score=score,
        comment=comment,
        continue_=False,
    )
    mock_get_feedback_usecase.execute.return_value = expected_response

    request_body = {
        "question_id": question_id,
        "message": message,
    }

    actual_response = client.post(
        f"/interview/{interview_id}",
        json=request_body,
    )
    assert actual_response.status_code == status.HTTP_200_OK

    response_body = actual_response.json()
    assert response_body["question_id"] == question_id
    assert response_body["score"] == score
    assert response_body["response"] == comment
    assert response_body["continue"] is False

    mock_get_feedback_usecase.execute.assert_called_once_with(
        GetFeedbackRequest(
            interview_id=interview_id,
            question_id=question_id,
            message=message,
        )
    )


def test_get_feedback_missing_question_id(client: TestClient):
    request_body = {
        "message": message,
    }

    response = client.post(
        f"/interview/{interview_id}",
        json=request_body,
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_get_feedback_missing_message(client: TestClient):
    request_body = {
        "question_id": question_id,
    }

    response = client.post(
        f"/interview/{interview_id}",
        json=request_body,
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_get_feedback_use_case_raises_exception(
    client: TestClient,
    mock_get_feedback_usecase: GetFeedbackUseCase,
):
    mock_get_feedback_usecase.execute.side_effect = Exception()

    request_body = {
        "question_id": question_id,
        "message": message,
    }

    with pytest.raises(Exception):
        client.post(
            f"/interview/{interview_id}",
            json=request_body,
        )

    mock_get_feedback_usecase.execute.assert_called_once()
