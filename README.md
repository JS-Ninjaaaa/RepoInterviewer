# RepoInterviewer

**RepoInterviewer** は、ソースコードをアップロードすることで、LLMが模擬的なコードレビューや技術面接を実施してくれる対話型システムです。主にエンジニアの技術面接対策やコード理解支援を目的としており、VSCodeのPluginとして
使用することができます。

## 📦 主な特徴

- 難易度やレビューキャラを指定可能
- 会話形式でレポジトリのコードに関するQ&Aを進行し、最終スコアとフィードバックを提供

## 🚀 技術スタック

- **バックエンド**
  - **Webフレームワーク**：FastAPI（Python 3.11）
  - **ASGIサーバー**：Uvicorn
  - **LLMサーバー**：Ollama 
  - **コンテナ環境**：Docker（Python:3.11-slim）

- **フロントエンド**
  - **言語**：TypeScript / JavaScript
  - **ビルドツール**：Vite
  - **UI構成**：HTML / CSS / WebView（VS Code Extension 向け）
  - **パッケージ管理**：npm / Node.js

