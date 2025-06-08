import type { FirstQuestionResponse, NextQuestionResponse, FeedBackResponse, GeneralFeedbackResponse } from "./backend-api-response-value";

export type VscodeApiResponseValue =
  | { type: "firstQuestion"; payload: FirstQuestionResponse }
  | { type: "nextQuestion"; payload: NextQuestionResponse }
  | { type: "feedback"; payload: FeedBackResponse }
  | { type: "generalFeedback"; payload: GeneralFeedbackResponse }
  | { type: "error"; payload: string | unknown };