import * as vscode from "vscode";
import { getUri } from "../utilities/get-uri";
import type { ImageUri } from "@shared/uri";

export interface WebviewUris {
  scriptUri: vscode.Uri;
  imageUris: ImageUri;
}

const imageFileNames: { [K in keyof ImageUri]: string } = {
  yuzu: "characters/yuzu.png",
  haru: "characters/haru.png",
  saki: "characters/saki.png",
  ren: "characters/ren.png",
  halfYuzu: "characters/half-yuzu.png",
  halfHaru: "characters/half-haru.png",
  halfSaki: "characters/half-saki.png",
  halfRen: "characters/half-ren.png",
  wholeYuzu: "characters/whole-yuzu.png",
  wholeHaru: "characters/whole-haru.png",
  wholeSaki: "characters/whole-saki.png",
  wholeRen: "characters/whole-ren.png",
  lightBackground: "background/light-mode-background.png",
  darkBackground: "background/dark-mode-background.png",
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
    const filePath = imageFileNames[key].split("/");
    imageUris[key] = getUri(webview, extensionUri, [
      ...basePath,
      ...filePath,
    ]).toString();
  }

  return { scriptUri, imageUris };
}
