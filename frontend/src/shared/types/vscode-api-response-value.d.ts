import type { BackendFirstQuestionResponse, BackendNextQuestionResponse, BackendFeedBackResponse, BackendGeneralFeedbackResponse } from "./backend-api-response-value";

export type VscodeApiResponseValue =
  | { type: "firstQuestion"; payload: BackendFirstQuestionResponse }
  | { type: "nextQuestion"; payload: BackendNextQuestionResponse }
  | { type: "feedback"; payload: BackendFeedBackResponse }
  | { type: "generalFeedback"; payload: BackendGeneralFeedbackResponse }
  | { type: "error"; payload: string | unknown };