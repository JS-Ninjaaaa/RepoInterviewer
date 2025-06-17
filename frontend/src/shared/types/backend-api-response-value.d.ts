export interface BackendFirstQuestionResponse {
  interview_id: string;
  question: string;
}

export interface BackendNextQuestionResponse {
  question_id: number;
  question: string;
}

export interface BackendFeedBackResponse {
  question_id: number;
  response: string;
  score: number;
  continue_question: boolean;
}

export interface BackendGeneralFeedbackResponse {
  scores: number[];
  general_review: string;
}
