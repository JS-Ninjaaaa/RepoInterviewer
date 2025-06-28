import io
import zipfile
from unittest.mock import MagicMock

import pytest
from app.api.dependencies import get_set_up_interview_usecase
from app.domain.entities.difficulty import Difficulty
from app.usecase.dtos.interview_dto import (
    SetUpInterviewRequest,
    SetUpInterviewResponse,
)
from app.usecase.usecases.setup_interview_usecase import (
    SetUpInterviewUseCase,
)
from fastapi import status
from fastapi.testclient import TestClient
from main import app

# テストデータ
difficulty = "normal"
total_question = 4
interview_id = "70da67e2-899c-44fd-8c0b-491decaecb65"
first_question = "最初の質問文"


@pytest.fixture(scope="module")
def test_zip_file():
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.writestr("test.py", 'print("Hello, World!")')

    return zip_buffer.getvalue()


@pytest.fixture
def mock_set_up_interview_usecase():
    mock_usecase = MagicMock(spec=SetUpInterviewUseCase)
    app.dependency_overrides[get_set_up_interview_usecase] = lambda: mock_usecase
    return mock_usecase


def test_set_up_interview_success(
    client: TestClient,
    test_zip_file: bytes,
    mock_set_up_interview_usecase: SetUpInterviewUseCase,
):
    expected_response = SetUpInterviewResponse(
        interview_id=interview_id,
        first_question=first_question,
    )
    mock_set_up_interview_usecase.execute.return_value = expected_response

    actual_response = client.post(
        "/interview",
        files={
            "source_code": (
                "archive.zip",
                test_zip_file,
                "application/zip",
            )
        },
        data={
            "difficulty": difficulty,
            "total_question": total_question,
        },
    )
    assert actual_response.status_code == status.HTTP_201_CREATED

    response_body = actual_response.json()
    assert response_body["interview_id"] == interview_id
    assert response_body["first_question"] == first_question

    mock_set_up_interview_usecase.execute.assert_called_once_with(
        SetUpInterviewRequest(
            source_code=test_zip_file,
            difficulty=Difficulty(difficulty),
            total_question=total_question,
        )
    )


def test_set_up_interview_missing_source_code(
    client: TestClient,
    mock_set_up_interview_usecase: SetUpInterviewUseCase,  # GCPのFirestoreへ接続しないため
):
    response = client.post(
        "/interview",
        data={
            "difficulty": difficulty,
            "total_question": total_question,
        },
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_set_up_interview_invalid_difficulty_format(
    client: TestClient,
    mock_set_up_interview_usecase: SetUpInterviewUseCase,  # GCPのFirestoreへ接続しないため
):
    response = client.post(
        "/interview",
        files={
            "source_code": (
                "archive.zip",
                test_zip_file,
                "application/zip",
            )
        },
        data={
            "difficulty": "difficulty",
            "total_question": total_question,
        },
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_set_up_interview_minus_total_question(
    client: TestClient,
    mock_set_up_interview_usecase: SetUpInterviewUseCase,  # GCPのFirestoreへ接続しないため
):
    response = client.post(
        "/interview",
        files={
            "source_code": (
                "archive.zip",
                test_zip_file,
                "application/zip",
            )
        },
        data={
            "difficulty": difficulty,
            "total_question": -1,
        },
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_set_up_interview_use_case_raises_exception(
    client: TestClient,
    test_zip_file: bytes,
    mock_set_up_interview_usecase: SetUpInterviewUseCase,
):
    mock_set_up_interview_usecase.execute.side_effect = Exception()

    with pytest.raises(Exception):
        client.post(
            "/interview",
            files={
                "source_code": (
                    "archive.zip",
                    test_zip_file,
                    "application/zip",
                )
            },
            data={
                "difficulty": difficulty,
                "total_question": total_question,
            },
        )

    mock_set_up_interview_usecase.execute.assert_called_once()
