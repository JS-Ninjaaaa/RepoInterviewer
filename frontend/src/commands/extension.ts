import * as vscode from "vscode";

// 拡張機能起動時のエントリポイント
export function activate(context: vscode.ExtensionContext) {
  console.log("🟢 Mensetsu拡張が起動しました");
  const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);

  myStatusBarItem.text = 'Ⓜ️モード'; // ← 絵文字＋テキスト
  myStatusBarItem.tooltip = 'クリックして面接質問を表示';
  myStatusBarItem.command = 'menpro.menpro';
  myStatusBarItem.show();

  context.subscriptions.push(myStatusBarItem);

  context.subscriptions.push(
    vscode.commands.registerCommand("menpro.menpro", async() => {
      const panel = await openWindow(context.extensionUri);
      panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
      const sakiImageUri = getUri(panel.webview, context.extensionUri, [
        "media", "saki.png"
      ]);
      panel.webview.postMessage({
        type: "init",
        imageUri: sakiImageUri.toString(),
      });
    })
  );
}

// 画面を二分割し，右側にwebviewを開く関数
export async function openWindow(extensionUri: vscode.Uri) {
  await vscode.commands.executeCommand('workbench.action.files.newUntitledFile');

  const panel = vscode.window.createWebviewPanel(
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
  return panel;
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
      <title>Menpro</title>
      <meta http-equiv="Content-Security-Policy"
            content="default-src 'none';
                    style-src 'unsafe-inline' ${webview.cspSource};
                    img-src ${webview.cspSource};
                    script-src 'nonce-${nonce}';">
    </head>
    <body>
      <div id="app"></div>
      <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
}
