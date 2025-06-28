# 🧠 RepoInterviewer

FastAPI を用いた LLM 面接支援システムのバックエンドです。  
Redisによるセッション管理、LLMによる質問生成・回答評価を行います。

## 環境構築

### 仮想環境の構築

[uv](https://docs.astral.sh/uv/) を使用して仮想環境を構築する。

```sh
uv venv
uv sync
```

[PyCharm用の設定](https://pleiades.io/help/pycharm/uv.html)

### 環境変数の設定

`.env.sample` をコピーして `.env` を作成し、環境変数の値を記入する。

## 🚀 起動方法（開発環境）

Dockerコンテナが削除される度にVS Codeの拡張機能をインストールし直すのが面倒なので、
ホストの環境でFastAPIを起動し、RedisのみをDockerで起動する。

```sh
docker compose up firestore-emulator -d

source .venv/bin/activate
task start
```

タスクの内容は `pyproject.toml` の `[tool.taskipy.tasks]` セクションに記載されている。

## 🚀 起動方法（本番環境）

FastAPIとRedisの両方をDockerコンテナで起動する。

```sh
docker compose up -d
```
