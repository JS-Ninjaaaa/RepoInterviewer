import { Uri, Webview } from "vscode";
import * as vscode from "vscode";

export function getUri(
  webview: Webview,
  extensionUri: Uri,
  pathList: string[],
): vscode.Uri {
  return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList));
}
