import * as vscode from "vscode";
import {
  fetchFirstQuestion,
  fetchNextQuestion,
  fetchFeedBack,
  fetchGeneralFeedback,
} from "../api/api";
import { fetchFiles, getFilteredFiles } from "./fetch-files";
import type { VscodeApiRequestValue } from "@shared/vscode-api-request-value";
import type { VscodeApiResponseValue } from "@shared/vscode-api-response-value";

export async function handleWebviewMessage(
  panel: vscode.WebviewPanel,
  message: VscodeApiRequestValue
) {
  switch (message.type) {
    case "fetchFileList": {
      const uris = await getFilteredFiles();
      const root = vscode.workspace.workspaceFolders?.[0].uri.fsPath!;
      const rels = uris.map((u) =>
        vscode.workspace.asRelativePath(u).replace(/\\/g, "/")
      );
      panel.webview.postMessage({ type: "fileList", payload: rels });
      break;
    }

    case "fetchFirstQuestion": {
      try {
        const blob = await fetchFiles(message.payload.selectedFiles);
        const questionInfo = await fetchFirstQuestion(blob, message.payload);
        panel.webview.postMessage({
          type: "firstQuestion",
          payload: questionInfo,
        });
      } catch (err) {
        panel.webview.postMessage({
          type: "error",
          payload: err instanceof Error ? err.message : String(err),
        });
      }
      break;
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
