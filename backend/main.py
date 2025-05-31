from app.api.routers import health, interview
from fastapi import FastAPI

app = FastAPI()

# ルーティング設定
app.include_router(interview.router, prefix="/interview", tags=["Interview"])
app.include_router(health.router, prefix="/health", tags=["Health"])
