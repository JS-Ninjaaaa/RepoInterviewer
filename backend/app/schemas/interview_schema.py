from app.domain.entities.difficulty import Difficulty
from pydantic import BaseModel


class SetUpInterviewRequest(BaseModel):
    source_code: bytes
    difficulty: Difficulty
    total_question: int


class SetUpInterviewResponse(BaseModel):
    interview_id: str
    first_question: str
