import * as vscode from "vscode";
import type { VscodeApiRequestValue } from "@shared/vscode-api-request-value";
import { handleWebviewMessage } from "./functions/handle-webview-message";
import { getWebviewUris } from "./functions/get-webview-uris";
import { getNonce } from "./utilities/get-nonce";
import { openWindow } from "./functions/open-webview";

// 拡張機能起動時のエントリポイント
export function activate(context: vscode.ExtensionContext) {
  const myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    1000
  );
  myStatusBarItem.text = "RepoInterviewer";
  myStatusBarItem.tooltip = "クリックして面接開始";
  myStatusBarItem.command = "repointerviewer.repointerviewer";
  myStatusBarItem.show();

  context.subscriptions.push(myStatusBarItem);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "repointerviewer.repointerviewer",
      async () => {
        const panel = await openWindow(context.extensionUri);
        panel.webview.html = getWebviewContent(
          panel.webview,
          context.extensionUri
        );

        // reactからメッセージを受け取ったタイミングで実行される
        panel.webview.onDidReceiveMessage(
          async (message: VscodeApiRequestValue) => {
            handleWebviewMessage(panel, message);
          }
        );
      }
    )
  );
}

// Webviewに表示するHTMLの設定
function getWebviewContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): string {
  const nonce = getNonce();

  const { scriptUri, imageUris } = getWebviewUris(webview, extensionUri);

  const initDataScript = `<script nonce="${nonce}">
    window.imageUris = ${JSON.stringify(imageUris)};
  </script>`;

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
      <div id="root"></div>

      ${initDataScript}

      <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
}
