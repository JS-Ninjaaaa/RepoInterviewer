import * as vscode from "vscode";
import { getUri } from "../utilities/get-uri";
import type { ImageUri } from "@shared/uri";

export interface WebviewUris {
  scriptUri: vscode.Uri;
  imageUris: ImageUri; 
}

const imageFileNames: { [K in keyof ImageUri]: string } = {
  yuzu: "yuzu.png",
  haru: "haru.png",
  saki: "saki.png",
  ren: "ren.png",
  wholeYuzu: "whole-yuzu.png",
  wholeHaru: "whole-haru.png",
  wholeSaki: "whole-saki.png",
  wholeRen: "whole-ren.png",
};

export function getWebviewUris(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): WebviewUris {
  // スクリプトのURI
  const scriptUri = getUri(webview, extensionUri, [
    "build",
    "webview",
    "index.js",
  ]);

  // 画像のURIをループで生成
  const basePath = ["build", "webview", "assets", "images"];
  const imageUris = {} as ImageUri;

  for (const key of Object.keys(imageFileNames) as (keyof ImageUri)[]) {
    const fileName = imageFileNames[key];
    imageUris[key] = getUri(webview, extensionUri, [
      ...basePath,
      fileName,
    ]).toString();
  }

  return { scriptUri, imageUris };
}
