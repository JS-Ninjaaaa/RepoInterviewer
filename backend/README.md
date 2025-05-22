# 🧠 RepoInterviewer

FastAPI + Ollama を用いた LLM 面接支援システムのバックエンドです。  
Redisによるセッション管理、Ollamaモデルによる質問生成・回答評価を行います。

## 仮想環境の構築

```
python -m venv .
pip install -r requirements.txt
```

## 🚀 起動方法（開発）

### ✅ 1. 前提

- Docker / Docker Compose がインストールされている
- Ollama がローカルにインストールされている
- LLMは[Llama-3-ELYZA-JP-8B-GGUF](https://huggingface.co/elyza/Llama-3-ELYZA-JP-8B-GGUF)を使用する

```bash
ollama serve
ollama run hf.co/elyza/Llama-3-ELYZA-JP-8B-GGUF:Q4_K_M
```

### ✅ 2. アプリの起動

```bash
docker compose up redis [--build] -d

source bin/activate
gunicorn main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --reload
```
