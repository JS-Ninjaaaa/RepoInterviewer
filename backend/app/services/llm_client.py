from ollama import Client
# docker実行用
ollama = Client(host="http://host.docker.internal:11434")
# ollama = Client(host="http://localhost:11434") # ローカルで実行する
model = "elyza-interview:latest"  # 使用するモデル名


def send_prompt(prompt: str, max_tokens: int = 1024) -> str:
    messages = [{"role": "user", "content": prompt}]
    res = ollama.chat(
        model=model,
        messages=messages,
        options={"num_predict": max_tokens}
    )
    return res["message"]["content"]

def build_question_prompt(character: str, difficulty: str, total_question: int, repository: str) -> str:
    return f"""
        キャラ: {character}
        難易度: {difficulty}
        
        以下のソースコードをレビューしてください。  
        {character}口調で、技術的な観点から{total_question}つの質問を作成してください。  
        **必ずキャラの言葉遣いや話し方を強く反映させてください**。  
        口調や語尾がキャラに合っていないと不正解です。
        
        出力ルール：
        - 質問文だけ（説明・コメントは禁止）
        - 番号付き（1.〜{total_question}.）
        - Markdownや枠線・装飾は禁止
        - 質問数はちょうど{total_question}つ
        
        # 対象コード
        {repository}
        """