import * as vscode from "vscode";
import * as path from "path";
import JSZip from "jszip";
import { spawn } from "child_process";
import { mensetsuIgnoreFiles } from "../data/mensetsuignore";

export async function fetchFiles(selected: string[]): Promise<Blob> {
  const rootFolder = vscode.workspace.workspaceFolders![0].uri.fsPath;
  const zip = new JSZip();
  for (const rel of selected) {
    const abs = vscode.Uri.file(path.join(rootFolder, rel));
    const bytes = await vscode.workspace.fs.readFile(abs);
    const content = new TextDecoder("utf-8").decode(bytes);
    zip.file(rel, content);
  }
  return zip.generateAsync({ type: "blob" });
}

export async function getFilteredFiles(): Promise<vscode.Uri[]> {
  const root = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  if (!root) {
    return [];
  }
  const ignoredRelPaths = await getGitIgnoredFilesAsync(root); // 相対パス
  const allFiles = await vscode.workspace.findFiles(
    "**/*",
    `{${mensetsuIgnoreFiles.join(",")}}`
  );

  const gitignoreFiltered = allFiles
    .filter((file) => file.fsPath.startsWith(root))
    .filter((file) => {
      const relativePath = path.relative(root, file.fsPath);
      return !ignoredRelPaths.includes(relativePath.replace(/\\/g, "/")); // Windows対策
    });

  return gitignoreFiltered;
}

function getGitIgnoredFilesAsync(rootPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const git = spawn(
      "git",
      ["ls-files", "--others", "--ignored", "--exclude-standard"],
      {
        cwd: rootPath,
      }
    );

    let result = "";
    git.stdout.on("data", (data) => {
      result += data.toString();
    });

    git.stderr.on("data", (data) => {});

    git.on("close", (code) => {
      if (code === 0) {
        const list = result
          .trim()
          .split("\n")
          .filter((line) => line);
        resolve(list);
      } else {
        reject(new Error(`git process exited with code ${code}`));
      }
    });
  });
}

export async function generateZip(files: vscode.Uri[]): Promise<Uint8Array> {
  const zip = new JSZip();

  for (const file of files) {
    const bytes = await vscode.workspace.fs.readFile(file);
    const content = new TextDecoder("utf-8").decode(bytes);
    const fileName = vscode.workspace.asRelativePath(file);
    zip.file(fileName, content);
  }

  const zipBinary = await zip.generateAsync({ type: "uint8array" });
  return zipBinary;
}
