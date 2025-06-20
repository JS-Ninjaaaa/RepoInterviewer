from app.api.dependencies import get_llm_client
from app.domain.llm_clients.llm_client import LLMClient
from fastapi import APIRouter
from fastapi.params import Depends

router = APIRouter()


@router.get("")
async def health_check():
    return {"status": "ok"}


@router.get("/llm")
async def health_check_llm(llm_client: LLMClient = Depends(get_llm_client)):
    response = llm_client.chat_once("空はなぜ青いの？")
    return {"status": "ok", "result": response}
