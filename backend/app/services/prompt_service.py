import json
from pathlib import Path

from ..schemas.schemas import Difficulty


def format_source_code(source_code: dict[str, str]) -> str:
    formatted_code = ""
    for file_name, code in source_code.items():
        formatted_code += "-" * 10 + f" {file_name} " + "-" * 10 + "\n"
        formatted_code += code + "\n"

    return formatted_code


def get_character_prompt(difficulty: Difficulty) -> str:
    if difficulty == Difficulty.easy:
        file_name = "easy.txt"
    elif difficulty == Difficulty.normal:
        file_name = "normal.txt"
    elif difficulty == Difficulty.hard:
        file_name = "hard.txt"
    elif difficulty == Difficulty.extreme:
        file_name = "extreme.txt"

    parent_dir = Path(__file__).parent
    file_path = parent_dir / "prompts" / "system" / file_name

    with open(file_path, "r", encoding="utf-8") as f:
        character_prompt = f.read()

    return character_prompt


def make_gen_question_prompt(source_code: str, total_question: int) -> str:
    parent_dir = Path(__file__).parent
    file_path = parent_dir / "prompts" / "user" / "gen_question.txt"

    with open(file_path, "r", encoding="utf-8") as f:
        prompt_template = f.read()

    return prompt_template.format(
        source_code=source_code,
        total_question=total_question,
    )


def make_feedback_prompt(max_score: int, source_code: str) -> str:
    parent_dir = Path(__file__).parent
    file_path = parent_dir / "prompts" / "user" / "gen_feedback.txt"

    with open(file_path, "r", encoding="utf-8") as f:
        prompt_template = f.read()

    return prompt_template.format(
        max_score=max_score,
        source_code=source_code,
    )


def make_gen_general_review_prompt(chat_histories: list[dict]) -> str:
    parent_dir = Path(__file__).parent
    file_path = parent_dir / "prompts" / "user" / "gen_general_review.txt"

    with open(file_path, "r", encoding="utf-8") as f:
        prompt_template = f.read()

    return prompt_template.format(chat_histories=json.dumps(chat_histories))


def make_deep_question_prompt(max_score: int, source_code: str) -> str:
    parent_dir = Path(__file__).parent
    file_path = parent_dir / "prompts" / "user" / "gen_deep_question.txt"

    with open(file_path, "r", encoding="utf-8") as f:
        prompt_template = f.read()

    return prompt_template.format(
        max_score=max_score,
        source_code=source_code,
    )
