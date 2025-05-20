# 🧠 RepoInterviewer Backend

FastAPI + Ollama を用いた LLM 面接支援システムのバックエンドです。  
Redisによるセッション管理、Ollamaモデルによる質問生成・回答評価を行います。

---

## 📦 技術スタック

| 技術 | 説明 |
|------|------|
| [FastAPI](https://fastapi.tiangolo.com/) | Python製の高速APIフレームワーク |
| [Ollama](https://ollama.com) | ローカルLLM実行環境（例：Llama3, ELYZA） |
| [Redis](https://redis.io) | 軽量なインメモリデータベース（状態管理） |
| [Gunicorn + Uvicorn](https://www.uvicorn.org/) | ASGIサーバ構成（本番環境用） |
| Docker / docker-compose | コンテナ環境 |

---

## 🚀 起動方法（開発）

### ✅ 1. 前提

- Docker / Docker Compose がインストールされていること
- Ollama がローカルにインストール & `serve` で起動済み
- 使用したLLMはElyzaの[このモデル](https://huggingface.co/elyza/Llama-3-ELYZA-JP-8B-GGUF)を使用

```bash
ollama run Llama-3-ELYZA-JP
```
または
```bash
ollama serve
```

#### ✅ 2. 本体の起動
```bash
docker compose up -build
```

