export interface FirstQuestionResponse {
  interview_id: string;
  question: string;
}

export interface NextQuestionResponse {
  question_id: number;
  question: string;
}

export interface FeedBackResponse {
  question_id: number;
  response: string;
  score: number;
}

export interface GeneralFeedbackResponse {
  scores: number[];
  General_review: string;
}
