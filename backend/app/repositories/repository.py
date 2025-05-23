from pathlib import Path
import json
from ..utils.redis_client import redis_service

# ソースコードをzipから取得
def get_source_code(source_dir: Path) -> dict[str, str]:
    source_code = {}
    for file in source_dir.rglob("*"):
        if file.is_file():
            try:
                with file.open("r", encoding="utf-8") as f:
                    # LLMに渡せるようにファイルの内容を整形
                    relative_path = file.relative_to(source_dir)
                    source_code[relative_path] = f.read()
            except UnicodeDecodeError:
                # デコードできない場合はスキップ
                continue

    return source_code

# 面接用にredisをセット
def init_interview_info(interview_id: str, response_text: str, difficulty: str,
                        total_question: int):
    # 質問をセット
    conversation_history = {
        str(i): {
            "question": response_text[i] ,
            "answer": None  # 初期状態では未回答
        }
       for i in range(0, total_question)
    }
    session_data = {
        "difficulty": difficulty.value,
        "total_question": total_question,
        "history": conversation_history
    }
    redis = redis_service.get_client()
    # 有効時間は 1H とする
    redis.set(f"interview-{interview_id}", json.dumps(session_data), ex=3600)
    # テスト
    # print(f"{session_data}", flush=True)