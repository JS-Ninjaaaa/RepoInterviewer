from ollama import Client

ollama = Client(host="http://host.docker.internal:11434")
model = "Llama-3-ELYZA-JP:latest"  # 使用するモデル名

def send_prompt(prompt: str) -> str:
    message = [{"role": "assistant", "content": prompt}]
    res = ollama.chat(model=model, messages=message)
    return res["message"]["content"]
