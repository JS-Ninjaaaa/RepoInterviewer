import * as vscode from "vscode";
import { fetchFiles } from "./functions/fetchFiles";
import { fetchFirstQuestion, fetchNextQuestion, fetchFeedBack, fetchGeneralFeedback } from "./api/api";
import {  testQuestions } from "./functions/data/test/testQuestion";
import type { apiRequestValue } from "./types/apiRequestValue";
import { testFeedback } from "./functions/data/test/testFeedback";
import { testGeneralFeedback } from "./functions/data/test/testGeneralFeedback";

let currentPanel: vscode.WebviewPanel | undefined;

// 拡張機能起動時のエントリポイント
export function activate(context: vscode.ExtensionContext) {
  const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
  myStatusBarItem.text = 'Ⓜ️モード'; 
  myStatusBarItem.tooltip = 'クリックして面接開始';
  myStatusBarItem.command = 'repointerviewer.repointerviewer';
  myStatusBarItem.show();

  context.subscriptions.push(myStatusBarItem);

  context.subscriptions.push(
    vscode.commands.registerCommand("repointerviewer.repointerviewer", async() => {
      const panel = await openWindow(context.extensionUri);
      panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
      
      // reactからメッセージを受け取ったタイミングで実行される
      panel.webview.onDidReceiveMessage(async (message: apiRequestValue) => {
        handleWebviewMessage(panel,message); 
      });
    })
  );
}

async function handleWebviewMessage(panel: vscode.WebviewPanel, message: apiRequestValue) {
  switch (message.type) {
    case "fetchFirstQuestion": {
      const zipBinary = await fetchFiles();
      try {
        const questionInfo = await fetchFirstQuestion(zipBinary, message.payload); 
        
        panel.webview.postMessage({
          type: "firstQuestion",
          payload: { questionInfo }
        });
        break;
      } catch (err: any) {
        panel.webview.postMessage({
          type: "error",
          payload: err.message || "不明なエラー"
        });
        return null;
      }
    }

    case "fetchNextQuestion": {
      try {
        const nextQuestionInfo = await fetchNextQuestion(message.payload); 

        panel.webview.postMessage({
          type: "nextQuestion",
          payload: { nextQuestionInfo }
        });
        break;
      } catch (err: any) {
        panel.webview.postMessage({
          type: "error",
          payload: err.message || "不明なエラー"
        });
        return null;
      }
    }

    case "fetchFeedBack": {
      try {
        const feedback = await fetchFeedBack(message.payload); 

        panel.webview.postMessage({
          type: "Feedback",
          payload: { feedback }
        });
        break;
      } catch (err: any) {
        panel.webview.postMessage({
          type: "error",
          payload: err.message || "不明なエラー"
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
          payload: { generalFeedback }
        });
        break;
      } catch (err: any) {
        panel.webview.postMessage({
          type: "error",
          payload: err.message || "不明なエラー"
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

// 画面を二分割し，右側にwebviewを開く関数
export async function openWindow(extensionUri: vscode.Uri): Promise<vscode.WebviewPanel> {
  await vscode.commands.executeCommand('workbench.action.files.newUntitledFile');

  if (currentPanel) {
    currentPanel.reveal();
    return currentPanel;
  }

  currentPanel = vscode.window.createWebviewPanel(
    "yourWebview",
    "RepoInterviewer",
    vscode.ViewColumn.Two, // ← 右側に表示！
    {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(extensionUri, 'build', 'webview')
      ]
    }
  );

  currentPanel.onDidDispose(() => {
    currentPanel = undefined;
  });
  
  return currentPanel;
}

export function deactivate() {}
  /**
   * Webview 内部でアクセス可能な URI に変換
   */
  function getUri(
    webview: vscode.Webview,
    extensionUri: vscode.Uri,
    pathList: string[]
  ): vscode.Uri {
    return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList));
}

/**
 * CSP用ランダム nonce を生成
 */
function getNonce(): string {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 32 }, () =>
    possible.charAt(Math.floor(Math.random() * possible.length))
  ).join("");
}

/**
 * Webview に表示する HTML を返す
 */
function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  // build/webview/assets/index.js を読み込む
  const scriptUri = getUri(webview, extensionUri, [
    "build", "webview", "index.js"
  ]);
  const nonce = getNonce();

  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>repointerviewer</title>
      <meta http-equiv="Content-Security-Policy"
            content="default-src 'none';
                    style-src 'unsafe-inline' ${webview.cspSource};
                    img-src ${webview.cspSource};
                    script-src 'nonce-${nonce}';
                    font-src ${webview.cspSource};">
    </head>
    <body>
      <div id="app"></div>
      <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
}
