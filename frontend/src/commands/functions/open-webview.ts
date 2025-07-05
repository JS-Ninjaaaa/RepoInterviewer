import * as vscode from "vscode";

let currentPanel: vscode.WebviewPanel | undefined;

// 画面を二分割し，右側にwebviewを開く関数
export async function openWindow(
  extensionUri: vscode.Uri
): Promise<vscode.WebviewPanel> {
  if (vscode.window.visibleTextEditors.length === 0) {
    await vscode.commands.executeCommand(
      "workbench.action.openWalkthrough"
    );
  }

  if (currentPanel) {
    currentPanel.reveal();
    return currentPanel;
  }

  currentPanel = vscode.window.createWebviewPanel(
    // 左側に開くUntitledファイルのタブの名前
    "yourWebview",
    // Webviewのタブの名前
    "RepoInterviewer",
    vscode.ViewColumn.Two, // ← 右側に表示！
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode.Uri.joinPath(extensionUri, "build", "webview"),
      ],
    }
  );

  currentPanel.onDidDispose(() => {
    currentPanel = undefined;
  });

  return currentPanel;
}
