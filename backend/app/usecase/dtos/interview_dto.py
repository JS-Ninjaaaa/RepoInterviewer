from dataclasses import dataclass

from app.domain.entities.difficulty import Difficulty


@dataclass(frozen=True, kw_only=True)
class SetUpInterviewRequest:
    source_code: bytes
    difficulty: Difficulty
    total_question: int


@dataclass(frozen=True, kw_only=True)
class SetUpInterviewResponse:
    interview_id: str
    first_question: str


@dataclass(frozen=True, kw_only=True)
class GetResponseRequest:
    interview_id: str
    question_id: str
    message: str


@dataclass(frozen=True, kw_only=True)
class GetResponseResponse:
    interview_id: str
    question_id: str
    score: int
    response: str
    continue_: bool


@dataclass(frozen=True, kw_only=True)
class GetQuestionRequest:
    interview_id: str
    question_id: str


@dataclass(frozen=True, kw_only=True)
class GetQuestionResponse:
    interview_id: str
    question_id: str
    question: str


@dataclass(frozen=True, kw_only=True)
class GetInterviewResultRequest:
    interview_id: str


@dataclass(frozen=True, kw_only=True)
class GetInterviewResultResponse:
    interview_id: str
    scores: list[int]
    overall_review: str
