import {
  FileList,
  FirstQuestion,
  NextQuestion,
  Feedback,
  GeneralFeedback,
} from "./webview-api-response-type";

export type VscodeApiResponseValue =
  | { type: "fileList"; payload: FileList }
  | { type: "firstQuestion"; payload: FirstQuestion }
  | { type: "nextQuestion"; payload: NextQuestion }
  | { type: "feedback"; payload: Feedback }
  | { type: "generalFeedback"; payload: GeneralFeedback }
  | { type: "error"; payload: string };
