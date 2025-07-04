from unittest.mock import MagicMock

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from app.api.dependencies import get_overall_review_usecase, verify_token
from app.usecase.dtos.interview_dto import (
    GetInterviewResultRequest,
    GetInterviewResultResponse,
)
from app.usecase.usecases.get_interview_result_usecase import GetInterviewResultUseCase
from main import app

# テストデータ
interview_id = "70da67e2-899c-44fd-8c0b-491decaecb65"
scores = [25, 25]
overall_review = "全体的に良い回答でした"


@pytest.fixture
def mock_get_interview_result_usecase():
    mock_usecase = MagicMock(spec=GetInterviewResultUseCase)
    app.dependency_overrides[verify_token] = lambda: True
    app.dependency_overrides[get_overall_review_usecase] = lambda: mock_usecase
    return mock_usecase


def test_get_interview_result_success(
    client: TestClient,
    mock_get_interview_result_usecase: GetInterviewResultUseCase,
):
    expected_response = GetInterviewResultResponse(
        interview_id=interview_id,
        scores=scores,
        overall_review=overall_review,
    )
    mock_get_interview_result_usecase.execute.return_value = expected_response

    actual_response = client.get(
        f"/interview/{interview_id}/result",
    )
    assert actual_response.status_code == status.HTTP_200_OK

    response_body = actual_response.json()
    assert response_body["interview_id"] == interview_id
    assert response_body["scores"] == scores
    assert response_body["overall_review"] == overall_review

    mock_get_interview_result_usecase.execute.assert_called_once_with(
        GetInterviewResultRequest(
            interview_id=interview_id,
        )
    )


def test_get_interview_result_use_case_raises_exception(
    client: TestClient,
    mock_get_interview_result_usecase: GetInterviewResultUseCase,
):
    mock_get_interview_result_usecase.execute.side_effect = Exception()

    with pytest.raises(Exception):
        client.get(
            f"/interview/{interview_id}/result",
        )

    mock_get_interview_result_usecase.execute.assert_called_once()
