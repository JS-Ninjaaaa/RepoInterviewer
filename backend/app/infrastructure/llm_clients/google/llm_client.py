import json
import os

from google import genai
from google.genai import types
from pydantic import BaseModel

from app.domain.entities.chat_history import ChatHistory
from app.domain.entities.chat_response import InterviewChatResponse
from app.domain.entities.difficulty import Difficulty
from app.domain.entities.interview_question import InterviewQuestion
from app.domain.entities.source_code import SourceCode
from app.domain.llm_clients.llm_client import LLMClient
from app.infrastructure.llm_clients.prompt_service import PromptService

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


class InterviewFeedbackSchema(BaseModel):
    """FB生成時に指定するスキーマ

    LLMはこのスキーマに従った応答を出力する

    Attributes:
        score (int): スコア
        comment (str): コメント
    """

    score: int
    comment: str


class InterviewChatResponseSchema(BaseModel):
    """深掘りありの面接における応答生成時に指定するスキーマ

    Attributes:
        score (int): スコア
        response (str): 応答
        continue_ (bool): 質問を続けるかどうか
    """

    score: int
    response: str
    continue_: bool


class GoogleLLMClient(LLMClient):
    """GoogleのLLMクライアント"""

    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    MODEL_NAME = os.getenv("GOOGLE_MODEL_NAME")

    def __init__(self):
        """コンストラクタ"""
        pass

    def make_content_config(
        self,
        character_prompt: str,
        response_mime_type: str = "text/plain",
        response_schema: types.SchemaUnion = None,
    ) -> types.GenerateContentConfig:
        """モデルの挙動の設定を生成する

        Args:
            character_prompt (str): キャラクターのプロンプト
            response_mime_type (str): 応答のMIMEタイプ
            response_schema (types.SchemaUnion): 応答のスキーマ

        Returns:
            types.GenerateContentConfig: モデルの挙動の設定

        Note:
            response_mime_typeに指定できる値
            - text/plain
            - application/json
        """
        return types.GenerateContentConfig(
            max_output_tokens=1024,
            response_mime_type=response_mime_type,
            response_schema=response_schema,
            safety_settings=safety_settings,
            system_instruction=[types.Part.from_text(text=character_prompt)],
            # 低いほど一貫した出力が得られる
            temperature=0.1,
            # 選択されたトークンの確率の合計がtop_pの値に達するまでトークンを選択する
            top_p=0.95,
        )

    def make_chat_history_contents(
        self,
        chat_history: ChatHistory,
    ) -> list[types.Content]:
        """会話履歴を格納したデータを生成する

        Args:
            chat_history (ChatHistory): 会話履歴

        Returns:
            list[types.Content]: 会話履歴の内容
        """
        contents = []
        for chat_message in chat_history.chat_history:
            contents.append(
                types.Content(
                    role=chat_message.role,
                    parts=[types.Part.from_text(text=chat_message.message)],
                )
            )

        return contents

    def generate_content(
        self,
        contents: list[types.Content],
        config: types.GenerateContentConfig,
    ) -> types.GenerateContentResponse:
        """プロンプトを送信して応答を生成する

        Args:
            contents (list[types.Content]): プロンプト
            config (types.GenerateContentConfig): モデルの挙動の設定

        Returns:
            types.GenerateContentResponse: モデルからの応答
        """
        client = genai.Client(api_key=self.GOOGLE_API_KEY)
        response = client.models.generate_content(
            model=self.MODEL_NAME,
            contents=contents,
            config=config,
        )

        return response

    def chat_once(self, message: str) -> str:
        """LLMと1回だけ会話を行う

        Args:
            message (str): ユーザーからのメッセージ

        Returns:
            str: モデルからの応答
        """
        contents = [
            types.Content(role="user", parts=[types.Part.from_text(text=message)])
        ]
        character_prompt = PromptService.get_character_prompt(Difficulty.easy)
        config = self.make_content_config(
            character_prompt=character_prompt,
            response_mime_type="text/plain",
        )

        response = self.generate_content(
            contents=contents,
            config=config,
        )
        return response.text

    def generate_questions(
        self,
        source_code: SourceCode,
        difficulty: Difficulty,
        total_question: int,
    ) -> list[str]:
        """質問文を生成する

        Args:
            source_code (SourceCode): ソースコード
            difficulty (Difficulty): 難易度
            total_question (int): 質問数

        Raises:
            ValueError: 質問文の生成に失敗した場合
            ValueError: 質問文をJSONに変換できなかった場合

        Returns:
            list[str]: 質問文のリスト
        """
        character_prompt = PromptService.get_character_prompt(difficulty)
        content_config = self.make_content_config(
            character_prompt=character_prompt,
            response_mime_type="application/json",
            response_schema=list[str],
        )

        questions_prompt = PromptService.make_questions_prompt(
            total_question=total_question,
            source_code=source_code,
        )
        contents = [
            types.Content(
                role="user", parts=[types.Part.from_text(text=questions_prompt)]
            )
        ]

        response = self.generate_content(
            contents=contents,
            config=content_config,
        )

        if response.text is None:
            raise ValueError("質問文の生成に失敗しました")

        try:
            return json.loads(response.text)
        except json.JSONDecodeError:
            raise ValueError("質問文をJSONに変換できませんでした")

    def generate_feedback(
        self,
        source_code: SourceCode,
        question: InterviewQuestion,
    ) -> InterviewChatResponse:
        """FBを生成する

        Args:
            source_code (SourceCode): ソースコード
            question (InterviewQuestion): 質問の情報

        Raises:
            ValueError: FBの生成に失敗した場合
            ValueError: FBをJSONに変換できなかった場合

        Returns:
            InterviewChatResponse: 面接の評価結果
        """
        character_prompt = PromptService.get_character_prompt(question.difficulty)
        content_config = self.make_content_config(
            character_prompt=character_prompt,
            response_mime_type="application/json",
            response_schema=InterviewFeedbackSchema,
        )

        contents = self.make_chat_history_contents(question.chat_history)

        feedback_prompt = PromptService.make_feedback_prompt(
            question.max_score,
            source_code,
        )
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=feedback_prompt)],
            )
        )

        response = self.generate_content(
            contents=contents,
            config=content_config,
        )

        if response.text is None:
            raise ValueError("FBの生成に失敗しました")

        try:
            response_dict = json.loads(response.text)
            return InterviewChatResponse(
                score=response_dict["score"],
                response=response_dict["comment"],
                continue_=False,
            )
        except json.JSONDecodeError:
            raise ValueError("FBをJSONに変換できませんでした")

    def generate_chat_response(
        self,
        source_code: SourceCode,
        question: InterviewQuestion,
    ) -> InterviewChatResponse:
        """深掘りありの面接における応答を生成する

        Args:
            source_code (SourceCode): ソースコード
            question (InterviewQuestion): 質問の情報

        Returns:
            InterviewChatResponse: 面接の応答
        """
        character_prompt = PromptService.get_character_prompt(question.difficulty)
        content_config = self.make_content_config(
            character_prompt=character_prompt,
            response_mime_type="application/json",
            response_schema=InterviewChatResponseSchema,
        )

        contents = self.make_chat_history_contents(question.chat_history)

        deep_question_prompt = PromptService.make_deep_question_prompt(
            question.max_score,
            source_code,
        )
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=deep_question_prompt)],
            )
        )

        response = self.generate_content(
            contents=contents,
            config=content_config,
        )

        if response.text is None:
            raise ValueError("応答の生成に失敗しました")

        try:
            response_dict = json.loads(response.text)
            return InterviewChatResponse.from_dict(response_dict)
        except json.JSONDecodeError:
            raise ValueError("応答をJSONに変換できませんでした")

    def generate_overall_review(
        self,
        difficulty: Difficulty,
        chat_histories: list[ChatHistory],
    ) -> str:
        """総評を生成する

        Args:
            difficulty (Difficulty): 難易度
            chat_histories (list[ChatHistory]): 会話履歴のリスト

        Returns:
            str: 総評
        """
        character_prompt = PromptService.get_character_prompt(difficulty)
        content_config = self.make_content_config(
            character_prompt=character_prompt,
            response_mime_type="text/plain",
        )

        # fmt: off
        overall_review_prompt = PromptService.make_overall_review_prompt(chat_histories)
        contents = [
            types.Content(
                role="user", parts=[types.Part.from_text(text=overall_review_prompt)]
            )
        ]
        # fmt: on

        response = self.generate_content(
            contents=contents,
            config=content_config,
        )

        if response.text is None:
            raise ValueError("総評の生成に失敗しました")

        return response.text
