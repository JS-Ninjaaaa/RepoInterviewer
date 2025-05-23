from fastapi import APIRouter

from ...services.llm_service import chat_once

router = APIRouter()


@router.get("")
async def health_check():
    return {"status": "ok"}


# llm接続のテスト
@router.get("/llm")
async def health_check_llm():
    response = chat_once("空はなぜ青いの？")
    return {"status": "ok", "result": response}
