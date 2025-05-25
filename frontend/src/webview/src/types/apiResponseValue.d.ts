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
  continue_question: boolean;
}

export interface GeneralFeedbackResponse {
  scores: number[];
  general_review: string;
}
