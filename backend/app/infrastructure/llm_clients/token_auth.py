from google.cloud import secretmanager
import os

# Google CloudのSecretと比較
def get_tokens_from_secret_manager() -> str:
    project_id = os.getenv("GCP_PROJECT_ID")
    # secretのカラム名をハードコードすべきか？そうでないか相談したい
    secret_id = os.getenv("SECRET_ID", "API_TOKEN")
    version = os.getenv("SECRET_VERSION", "1")

    if not project_id:
        raise ValueError("GCP_PROJECT_ID must be set.")

    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version}"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("utf-8").strip()

