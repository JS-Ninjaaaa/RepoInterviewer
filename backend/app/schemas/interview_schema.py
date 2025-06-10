from app.domain.entities.difficulty import Difficulty
from pydantic import BaseModel, Field


class SetUpInterviewRequest(BaseModel):
    source_code: bytes
    difficulty: Difficulty
    total_question: int = Field(gt=0)


class SetUpInterviewResponse(BaseModel):
    interview_id: str
    first_question: str


class GetFeedbackRequest(BaseModel):
    interview_id: str
    question_id: str
    message: str


class GetFeedbackResponse(BaseModel):
    interview_id: str
    question_id: str
    score: int
    comment: str
