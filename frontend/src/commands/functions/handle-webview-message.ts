import * as vscode from "vscode";
import {
  fetchFirstQuestion,
  fetchNextQuestion,
  fetchFeedBack,
  fetchGeneralFeedback,
} from "../api/api";
import { fetchFiles } from "./fetch-files";
import type { VscodeApiRequestValue } from "@shared/vscode-api-request-value";
import type { VscodeApiResponseValue } from "@shared/vscode-api-response-value";

export async function handleWebviewMessage(
  panel: vscode.WebviewPanel,
  message: VscodeApiRequestValue
) {
  switch (message.type) {
    case "fetchFirstQuestion": {
      const zipBlob: Blob = await fetchFiles();
      try {
        const questionInfo = await fetchFirstQuestion(zipBlob, message.payload);

        const responseMessage: VscodeApiResponseValue = {
          type: "firstQuestion",
          payload: questionInfo,
        };
        panel.webview.postMessage(responseMessage);

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

        const responseMessage: VscodeApiResponseValue = {
          type: "nextQuestion",
          payload: nextQuestionInfo,
        };
        panel.webview.postMessage(responseMessage);

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

        // APIからcontinueQuestionを返されなかったら
        if (typeof feedback.continueQuestion === "undefined") {
          feedback.continueQuestion = false;
        }

        const responseMessage: VscodeApiResponseValue = {
          type: "feedback",
          payload: feedback,
        };
        panel.webview.postMessage(responseMessage);
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

        const responseMessage: VscodeApiResponseValue = {
          type: "generalFeedback",
          payload: generalFeedback,
        };
        panel.webview.postMessage(responseMessage);

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
