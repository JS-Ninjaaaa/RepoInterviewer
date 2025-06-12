import {
  FirstQuestion,
  NextQuestion,
  Feedback,
  GeneralFeedback,
} from "./webview-api-response-type";

export type VscodeApiResponseValue =
  | { type: "firstQuestion"; payload: FirstQuestion }
  | { type: "nextQuestion"; payload: NextQuestion }
  | { type: "feedback"; payload: Feedback }
  | { type: "generalFeedback"; payload: GeneralFeedback }
  | { type: "error"; payload: string };
