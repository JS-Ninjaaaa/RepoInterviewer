from unittest.mock import MagicMock

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from app.api.dependencies import get_response_usecase, verify_token
from app.usecase.dtos.interview_dto import (
    GetResponseRequest,
    GetResponseResponse,
)
from app.usecase.usecases.get_response_usecase import GetResponseUseCase
from main import app

# テストデータ
interview_id = "70da67e2-899c-44fd-8c0b-491decaecb65"
question_id = "1"
message = "テスト回答"
score = 80
chat_response = "良い回答です"


@pytest.fixture
def mock_get_response_usecase():
    mock_usecase = MagicMock(spec=GetResponseUseCase)
    app.dependency_overrides[verify_token] = lambda: True
    app.dependency_overrides[get_response_usecase] = lambda: mock_usecase
    return mock_usecase


def test_get_response_success(
    client: TestClient,
    mock_get_response_usecase: GetResponseUseCase,
):
    expected_response = GetResponseResponse(
        interview_id=interview_id,
        question_id=question_id,
        score=score,
        response=chat_response,
        continue_=False,
    )
    mock_get_response_usecase.execute.return_value = expected_response

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
    assert response_body["response"] == chat_response
    assert response_body["continue"] is False

    mock_get_response_usecase.execute.assert_called_once_with(
        GetResponseRequest(
            interview_id=interview_id,
            question_id=question_id,
            message=message,
        )
    )


def test_get_response_missing_question_id(
    client: TestClient,
    mock_get_response_usecase: GetResponseUseCase,  # GCPのFirestoreへ接続しないため
):
    request_body = {
        "message": message,
    }

    response = client.post(
        f"/interview/{interview_id}",
        json=request_body,
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_get_response_missing_message(
    client: TestClient,
    mock_get_response_usecase: GetResponseUseCase,  # GCPのFirestoreへ接続しないため
):
    request_body = {
        "question_id": question_id,
    }

    response = client.post(
        f"/interview/{interview_id}",
        json=request_body,
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_get_response_use_case_raises_exception(
    client: TestClient,
    mock_get_response_usecase: GetResponseUseCase,  # GCPのFirestoreへ接続しないため
):
    mock_get_response_usecase.execute.side_effect = Exception()

    request_body = {
        "question_id": question_id,
        "message": message,
    }

    with pytest.raises(Exception):
        client.post(
            f"/interview/{interview_id}",
            json=request_body,
        )

    mock_get_response_usecase.execute.assert_called_once()
