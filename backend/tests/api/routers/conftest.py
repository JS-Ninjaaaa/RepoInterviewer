import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture(scope="module")
def client():
    return TestClient(app)


@pytest.fixture(autouse=True)
def dependency_overrides():
    """
    テスト間の依存関係の干渉を防ぐために
    各テスト実行後にFastAPIの依存性を自動的にクリアする
    """
    yield
    app.dependency_overrides.clear()
