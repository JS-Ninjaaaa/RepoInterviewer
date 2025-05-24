import * as vscode from "vscode";
import {
  fetchFirstQuestion,
  fetchNextQuestion,
  fetchFeedBack,
  fetchGeneralFeedback,
} from "../api/api";
import { fetchFiles } from "./fetchFiles";
import { apiRequestValue } from "../types/apiRequestValue";

export async function handleWebviewMessage(
  panel: vscode.WebviewPanel,
  message: apiRequestValue,
) {
  switch (message.type) {
    case "fetchFirstQuestion": {
      const zipBlob: Blob = await fetchFiles();
      try {
        const questionInfo = await fetchFirstQuestion(
          zipBlob, 
          message.payload
        ); 
        
        panel.webview.postMessage({
          type: "firstQuestion",
          payload:  questionInfo, 
        });
        break;
      } catch (err: unknown) {
        panel.webview.postMessage({
          type: "error",
          payload: err || "不明なエラー",
        });
        return null;
      }
    }

    case "fetchNextQuestion": {
      try {
        const nextQuestionInfo = await fetchNextQuestion(message.payload);

        panel.webview.postMessage({
          type: "nextQuestion",
          payload: nextQuestionInfo,
        });
        break;
      } catch (err: unknown) {
        panel.webview.postMessage({
          type: "error",
          payload: err || "不明なエラー",
        });
        return null;
      }
    }

    case "fetchFeedback": {
      try {
        const feedback = await fetchFeedBack(message.payload); 
        
        // APIからcontinue_deep_questionを返されなかったら
        if (typeof feedback.continue_deep_question === "undefined") {

          feedback.continue_deep_question = false;
        }

        panel.webview.postMessage({
          type: "Feedback",
          payload: feedback,
        });
        break;
      } catch (err: unknown) {
        panel.webview.postMessage({
          type: "error",
          payload: err || "不明なエラー",
        });
        return null;
      }
    }

    case "fetchGeneralFeedback": {
      // interview_id, question_idで次の質問を取得する
      try {
        const generalFeedback = await fetchGeneralFeedback(message.payload);

        panel.webview.postMessage({
          type: "GeneralFeedback",
          payload: generalFeedback,
        });
        break;
      } catch (err: unknown) {
        panel.webview.postMessage({
          type: "error",
          payload: err || "不明なエラー",
        });
        return null;
      }
    }
    case "closeWebview": {
      panel.dispose();
      break;
    }
  }
}
