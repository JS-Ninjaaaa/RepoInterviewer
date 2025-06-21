import tempfile
from pathlib import Path
from unittest.mock import MagicMock

import pytest
from app.domain.llm_clients.llm_client import LLMClient
from app.domain.repositories.interview_repository import InterviewRepository
from app.domain.repositories.source_code_repository import SourceCodeRepository


@pytest.fixture
def mock_interview_repository():
    return MagicMock(spec=InterviewRepository)


@pytest.fixture
def mock_source_code_repository():
    return MagicMock(spec=SourceCodeRepository)


@pytest.fixture
def mock_llm_client():
    return MagicMock(spec=LLMClient)


@pytest.fixture
def temp_dir():
    with tempfile.TemporaryDirectory() as tmp_dir:
        yield Path(tmp_dir)
