import json
from pathlib import Path

from app.domain.entities.chat_history import ChatHistory
from app.domain.entities.difficulty import Difficulty
from app.domain.entities.source_code import SourceCode


class PromptService:
    """プロンプトを取得するクラス

    Attributes:
        prompt_dir_path (Path): プロンプトのディレクトリパス
        system_prompt_dir_path (Path): システムプロンプトのディレクトリパス
        user_prompt_dir_path (Path): ユーザープロンプトのディレクトリパス
    """

    prompt_dir_path = Path(__file__).parent / "prompts"

    system_prompt_dir_path = prompt_dir_path / "system"
    user_prompt_dir_path = prompt_dir_path / "user"

    @classmethod
    def get_character_prompt(cls, difficulty: Difficulty) -> str:
        """キャラクターのプロンプトを取得する

        Args:
            difficulty (Difficulty): 難易度

        Returns:
            str: キャラクターのプロンプト
        """
        if difficulty == Difficulty.easy:
            file_name = "easy.txt"
        elif difficulty == Difficulty.normal:
            file_name = "normal.txt"
        elif difficulty == Difficulty.hard:
            file_name = "hard.txt"
        elif difficulty == Difficulty.extreme:
            file_name = "extreme.txt"

        file_path = cls.system_prompt_dir_path / file_name

        with open(file_path, "r", encoding="utf-8") as f:
            character_prompt = f.read()

        return character_prompt

    @classmethod
    def make_questions_prompt(
        cls,
        total_question: int,
        source_code: SourceCode,
    ) -> str:
        """質問を生成するプロンプトを取得する

        Args:
            total_question (int): _description_
            source_code (SourceCode): _description_

        Returns:
            str: _description_
        """
        file_path = cls.user_prompt_dir_path / "questions.txt"

        with open(file_path, "r", encoding="utf-8") as f:
            prompt_template = f.read()

        return prompt_template.format(
            total_question=total_question,
            source_code=source_code.format(),
        )

    @classmethod
    def make_feedback_prompt(cls, max_score: int, source_code: SourceCode) -> str:
        """フィードバックを生成するプロンプトを取得する

        Args:
            max_score (int): 最大スコア
            source_code (SourceCode): ソースコード

        Returns:
            str: フィードバックを生成するプロンプト
        """
        file_path = cls.user_prompt_dir_path / "feedback.txt"

        with open(file_path, "r", encoding="utf-8") as f:
            prompt_template = f.read()

        return prompt_template.format(
            max_score=max_score,
            source_code=source_code.format(),
        )

    @classmethod
    def make_deep_question_prompt(cls, max_score: int, source_code: SourceCode) -> str:
        """深掘りの質問を生成するプロンプトを取得する

        Args:
            max_score (int): 最大スコア
            source_code (SourceCode): ソースコード

        Returns:
            str: 深掘りの質問を生成するプロンプト
        """
        file_path = cls.user_prompt_dir_path / "deep_question.txt"

        with open(file_path, "r", encoding="utf-8") as f:
            prompt_template = f.read()

        return prompt_template.format(
            max_score=max_score,
            source_code=source_code.format(),
        )

    @classmethod
    def make_general_review_prompt(cls, chat_histories: list[ChatHistory]) -> str:
        """総評を生成するプロンプトを取得する

        Args:
            chat_history (ChatHistory): チャット履歴

        Returns:
            str: 総評を生成するプロンプト
        """
        file_path = cls.user_prompt_dir_path / "general_review.txt"

        with open(file_path, "r", encoding="utf-8") as f:
            prompt_template = f.read()

        return prompt_template.format(
            chat_histories=json.dumps(
                [chat_history.to_dict() for chat_history in chat_histories]
            ),
        )
