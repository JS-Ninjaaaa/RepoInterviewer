import type {
  BackendFeedBackResponse,
  BackendFirstQuestionResponse,
  BackendGeneralFeedbackResponse,
  BackendNextQuestionResponse,
} from "@shared/backend-api-response-value";
import type {
  Feedback,
  FirstQuestion,
  GeneralFeedback,
  NextQuestion,
} from "@shared/webview-api-response-type";

// 変数名の変換関数の定義
export function mapFirstQuestion(
  src: BackendFirstQuestionResponse
): FirstQuestion {
  return {
    interviewId: src.interview_id,
    question: src.first_question,
  };
}

export function mapNextQuestion(
  src: BackendNextQuestionResponse
): NextQuestion {
  return {
    questionId: Number(src.question_id),
    question: src.question,
  };
}

export function mapFeedback(src: BackendFeedBackResponse): Feedback {
  return {
    questionId: Number(src.question_id),
    response: src.response,
    score: src.score,
    continueQuestion: src.continue,
  };
}

export function mapGeneralFeedback(
  src: BackendGeneralFeedbackResponse
): GeneralFeedback {
  return {
    scores: src.scores,
    generalReview: src.general_review,
  };
}
