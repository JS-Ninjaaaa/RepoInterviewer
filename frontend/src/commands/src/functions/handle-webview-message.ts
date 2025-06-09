import * as vscode from "vscode";
import {
  fetchFirstQuestion,
  fetchNextQuestion,
  fetchFeedBack,
  fetchGeneralFeedback,
} from "../api/api";
import { fetchFiles } from "./fetch-files";
import { VscodeApiRequestValue } from "@shared/vscode-api-request-value";
import { VscodeApiResponseValue } from "@shared/vscode-api-response-value";

export async function handleWebviewMessage(
  panel: vscode.WebviewPanel,
  message: VscodeApiRequestValue,
) {
  switch (message.type) {
    case "fetchFirstQuestion": {
      const zipBlob: Blob = await fetchFiles();
      try {
        const questionInfo = await fetchFirstQuestion(
          zipBlob, 
          message.payload
        ); 
        
        const responsemessage: VscodeApiResponseValue = {
          type: "firstQuestion",
          payload:  questionInfo, 
        };
        panel.webview.postMessage(responsemessage);
        
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

        const responsemessage: VscodeApiResponseValue = {
          type: "nextQuestion",
          payload: nextQuestionInfo,
        };
        panel.webview.postMessage(responsemessage);

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
        
        // APIからcontinue_questionを返されなかったら
        if (typeof feedback.continue_question === "undefined") {

          feedback.continue_question = false;
        }

        const responsemessage: VscodeApiResponseValue = {
          type: "feedback",
          payload: feedback,
        };
        panel.webview.postMessage(responsemessage);
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

        const responsemessage: VscodeApiResponseValue = {
          type: "generalFeedback",
          payload: generalFeedback,
        };
        panel.webview.postMessage(responsemessage);
        
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
