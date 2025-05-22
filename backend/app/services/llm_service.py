import os
from textwrap import dedent
from typing import Literal

from app.schemas.schemas import Difficulty
from ollama import Client

ollama = Client(host="http://localhost:11434")

interview_settings = {
    "easy": {
        "character": "ギャル",
        "difficulty": "易しい",
    },
    "normal": {
        "character": "先輩園ジニア",
        "difficulty": "普通",
    },
    "hard": {
        "character": "辛口メンター",
        "difficulty": "難しい",
    },
    "extreme": {
        "character": "冷酷非情なスーパー上司",
        "difficulty": "超難しい",
    }
}

def send_prompt(messages: list[dict[str, str]], format: Literal['', 'json'] | None = None) -> str:
    model = os.getenv("LLM_MODEL")
    if model is None:
        raise ValueError("LLM_MODEL environment variable is not set")

    response = ollama.chat(model=model, messages=messages, format=format)
    return response["message"]["content"]

def format_source_code(source_code: dict[str, str]) -> str:
    """
    ソースコードを整形して返す
    """
    formatted_code = ""
    for file_name, code in source_code.items():
        formatted_code += f"# --- {file_name} ---\n{code}\n"

    return formatted_code

def make_gen_question_prompt(difficulty: Difficulty, total_question: int, repository: str) -> str:
    setting = interview_settings[difficulty.value]
    
    return dedent(
        f"""
        キャラクター: {setting['character']}
        難易度: {setting['difficulty']}

        以下のソースコードをレビューしてください。
        キャラクターの口調で技術的な観点から{total_question}つの質問を作成してください。
        **必ずキャラの言葉遣いや話し方を強く反映させてください**。  
        口調や語尾がキャラに合っていないとペナルティーを課します。
        
        # 出力ルール：
        - 質問文だけ（説明・コメントは禁止）
        - 番号付き（1.〜{total_question}.）
        - Markdownや枠線・装飾は禁止
        - 質問数はちょうど{total_question}つ
        
        # レビュー対象コード:
        {repository}
        """
    )
