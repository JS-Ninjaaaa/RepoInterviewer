from ollama import Client

ollama = Client(host="http://host.docker.internal:11434")
model = "Llama-3-ELYZA-JP:latest"  # 使用するモデル名


def send_prompt(prompt: str) -> str:
    message = [{"role": "assistant", "content": prompt}]
    res = ollama.chat(model=model, messages=message)
    return res["message"]["content"]

def build_question_prompt(character: str, difficulty: str, total_question: int, repository: str) -> str:
    return f"""
        キャラ: {character}
        難易度: {difficulty}
        
        以下のソースコードをレビューしてください。  
        ギャル口調で、技術的な観点から{total_question}つの質問を作成してください。  
        出力は以下のルールを守ってください：
        
        - 質問文だけ（説明、コメントは禁止）
        - 番号付き（1.〜5.）
        - Markdownや枠線・装飾は禁止
        - 質問数はちょうど5つ
        
        # 対象コード
        {repository}
        """