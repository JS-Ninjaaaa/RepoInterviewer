# fmt: off
from dotenv import load_dotenv

load_dotenv()


from app.api.routers import health, interview
from fastapi import FastAPI

# fmt: on

app = FastAPI()

app.include_router(interview.router, prefix="/interview", tags=["Interview"])
app.include_router(health.router, prefix="/health", tags=["Health"])
