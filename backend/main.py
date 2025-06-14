from app.api.routers import health, interview
from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

app = FastAPI()

app.include_router(interview.router, prefix="/interview", tags=["Interview"])
app.include_router(health.router, prefix="/health", tags=["Health"])
