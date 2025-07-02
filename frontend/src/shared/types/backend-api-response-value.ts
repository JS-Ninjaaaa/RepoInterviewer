export interface BackendFirstQuestionResponse {
  interview_id: string;
  first_question: string;
}

export interface BackendNextQuestionResponse {
  question_id: number;
  question: string;
}

export interface BackendFeedBackResponse {
  question_id: number;
  response: string;
  score: number;
  continue: boolean;
}

export interface BackendGeneralFeedbackResponse {
  scores: number[];
  general_review: string;
}
