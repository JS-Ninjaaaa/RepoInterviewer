from dotenv import load_dotenv
from fastapi import FastAPI

from app.api.endpoints import health, interview

load_dotenv()

app = FastAPI()

# ルーティング設定
app.include_router(interview.router, prefix="/interview", tags=["Interview"])
app.include_router(health.router, prefix="/health", tags=["Health"])
