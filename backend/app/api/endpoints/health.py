from fastapi import APIRouter

from ...services.llm_service import send_prompt

router = APIRouter()


@router.get("/")
async def health_check():
    return {"status": "ok"}


# llm接続のテスト
@router.get("/llm")
async def health_check_llm():
    messages = [
        {"role": "user", "content": "なぜ空は青いの？"},
    ]
    res = send_prompt(messages)
    return {"status": "ok", "result": res}
