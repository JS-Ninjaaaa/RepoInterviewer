// 変数名の変換文字列の定義
export interface FileList {
  allFiles: string;
}

export interface FirstQuestion {
  interviewId: string;
  question: string;
}

export interface NextQuestion {
  questionId: number;
  question: string;
}

export interface Feedback {
  questionId: number;
  response: string;
  score: number;
  continueQuestion: boolean;
}

export interface GeneralFeedback {
  scores: number[];
  generalReview: string;
}
