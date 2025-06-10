import type {
  BackendFirstQuestionResponse,
  BackendNextQuestionResponse,
  BackendFeedBackResponse,
  BackendGeneralFeedbackResponse
} from "@shared/backend-api-response-value";
import type {
  FirstQuestion,
  NextQuestion,
  Feedback,
  GeneralFeedback
} from "@shared/webview-api-response-type";

// 変数名の変換関数の定義
export function mapFirstQuestion(
  src: BackendFirstQuestionResponse
): FirstQuestion {
  return {
    interviewId: src.interview_id,
    question: src.question,
  };
}

export function mapNextQuestion(
  src: BackendNextQuestionResponse
): NextQuestion {
  return {
    questionId: src.question_id,
    question: src.question,
  };
}

export function mapFeedback(
  src: BackendFeedBackResponse
): Feedback {
  return {
    questionId: src.question_id,
    response: src.response,
    score: src.score,
    continueQuestion: src.continue_question,
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