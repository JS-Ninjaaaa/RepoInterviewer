from fastapi import APIRouter
from ...services.llm_client import send_prompt
router = APIRouter()

@router.get("/")
async def health_check():
    return {"status": "ok"}

# llm接続のテスト
@router.get("/llm")
async def health_check_llm():
    res = send_prompt("なぜ空は青いの？")
    return {"status": "ok",
            "result": res}

