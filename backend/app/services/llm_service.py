import json
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel

from ..repositories.fake.redis_repo import get_interview_data
from ..schemas.schemas import Difficulty
from ..services.prompt_service import (
    get_character_prompt,
    make_feedback_prompt,
    make_gen_question_prompt,
)

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))


class InterviewFeedback(BaseModel):
    score: int
    comment: str


# 相応しくない内容を生成させないようにする設定
safety_settings = [
    # 一番制限が厳しい設定を指定
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold=types.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    ),
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold=types.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    ),
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold=types.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    ),
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold=types.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    ),
]


def get_model_id() -> str:
    model_id = os.getenv("MODEL_NAME")
    if model_id is None:
        raise ValueError("モデルの名前が環境変数に設定されていません")

    return model_id


def chat_once(message: str) -> str | None:
    # モデルの挙動を設定する
    gen_content_config = types.GenerateContentConfig(
        max_output_tokens=1024,
        response_mime_type="text/plain",
        safety_settings=safety_settings,
        temperature=0.1,
        top_p=0.95,
    )

    # クライアントからのメッセージを会話履歴に追加する
    contents = [types.Content(role="user", parts=[types.Part.from_text(text=message)])]

    # LLMにプロンプトを送信して応答を得る
    model_id = get_model_id()
    response = client.models.generate_content(
        model=model_id,
        contents=contents,
        config=gen_content_config,
    )

    return response.text


# ソースコードを元に質問文を生成する
def generate_question(
    source_code: str,
    difficulty: Difficulty,
    total_question: int,
) -> list[str] | None:
    # モデルの挙動を設定する
    character_prompt = get_character_prompt(difficulty)
    gen_content_config = types.GenerateContentConfig(
        max_output_tokens=1024,
        response_mime_type="application/json",
        response_schema=list[str],
        safety_settings=safety_settings,
        system_instruction=[types.Part.from_text(text=character_prompt)],
        temperature=0.1,
        top_p=0.95,
    )

    # 質問文を生成するプロンプトを作成する
    gen_question_prompt = make_gen_question_prompt(source_code, total_question)
    contents = [
        types.Content(
            role="user", parts=[types.Part.from_text(text=gen_question_prompt)]
        )
    ]

    # LLMにプロンプトを送信して質問文を生成する
    model_id = get_model_id()
    response = client.models.generate_content(
        model=model_id,
        contents=contents,
        config=gen_content_config,
    )

    if response.text is None:
        return None

    # LLMからの応答をJSONとして解釈する
    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        return None


# 質問文と回答を元にFBを生成する
def generate_feedback(
    interview_id: str,
    source_code: str,
    chat_history: list[dict[str, str]],
) -> dict | None:
    interview_data = get_interview_data(interview_id)
    if interview_data is None:
        return None

    difficulty = Difficulty(interview_data["difficulty"])
    character_prompt = get_character_prompt(difficulty)

    # モデルの挙動を設定する
    gen_content_config = types.GenerateContentConfig(
        max_output_tokens=1024,
        response_mime_type="application/json",
        response_schema=InterviewFeedback,
        safety_settings=safety_settings,
        system_instruction=[types.Part.from_text(text=character_prompt)],
        temperature=0.2,
        top_p=0.95,
    )

    total_question = interview_data["total_question"]
    # FIXME: 100で割り切れない場合に合計が100にならない
    max_score = 100 // total_question

    # 評価用のプロンプトを生成する
    feedback_prompt = make_feedback_prompt(max_score, source_code)

    contents = []  # LLMに渡すデータ
    for message in chat_history:
        # 会話履歴を追加する
        contents.append(
            types.Content(
                role=message["role"],
                parts=[types.Part.from_text(text=message["content"])],
            )
        )

    # FB生成用のプロンプトを追加する
    contents.append(
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=feedback_prompt)],
        )
    )

    # LLMにプロンプトを送信してFBを生成する
    model_id = get_model_id()
    feedback = client.models.generate_content(
        model=model_id,
        contents=contents,
        config=gen_content_config,
    )

    if feedback.text is None:
        return None

    # JSONとして解釈する
    try:
        return json.loads(feedback.text)
    except json.JSONDecodeError:
        return None


def generate_chat_response():
    pass
