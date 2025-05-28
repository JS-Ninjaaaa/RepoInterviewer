# 🧠 RepoInterviewer

FastAPI を用いた LLM 面接支援システムのバックエンドです。  
Redisによるセッション管理、LLMによる質問生成・回答評価を行います。

## 環境構築

### 仮想環境の構築

```
python -m venv .
pip install -r requirements.txt
```

### 環境変数の設定

`.env.sample` をコピーして `.env` を作成し、環境変数の値を記入する。

## 🚀 起動方法（開発）

```bash
docker compose up redis [--build] -d

source bin/activate
gunicorn main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --reload
```
