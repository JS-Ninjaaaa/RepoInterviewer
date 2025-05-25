from pathlib import Path
from uuid import uuid4

# 開発モードで fake_repoを使う（Redis）
from ..repositories.production.redis_repo import (
    create_interview_cache,
    get_chat_history,
    get_interview_data,
    update_chat_history,
    update_interview_result,
)
from ..repositories.production.source_repo import get_source_code
from ..schemas.schemas import (
    Difficulty,
    InterviewInterviewIdPostRequest,
    InterviewPostRequest,
)
from ..services.llm_service import (
    generate_feedback,
    generate_general_review,
    generate_question,
)
from ..services.prompt_service import format_source_code
from ..utils.zip_handler import extract_zip


# POST /interview
def set_up_interview(
    request_body: InterviewPostRequest,
) -> tuple[str, str]:
    # 面接IDの生成
    interview_id = str(uuid4())

    # zipファイルを解凍して中身を保存する
    zip_bytes = request_body.source_code
    session_dir = Path("tmp") / interview_id
    saved_files = extract_zip(zip_bytes, session_dir)
    # 難易度によって返すフラグを変える
    if (
        request_body.difficulty == Difficulty.hard
        or request_body.difficulty == Difficulty.extreme
    ):
        continue_question = True  # 深掘りモードON
    else:
        continue_question = False
    # 質問文を生成する
    formatted_code = format_source_code(saved_files)
    questions = generate_question(
        formatted_code,
        request_body.difficulty,
        request_body.total_question,
    )

    if questions is None:
        return interview_id, ""

    # 面接の情報をredisに保存する
    create_interview_cache(
        interview_id=interview_id,
        difficulty=request_body.difficulty,
        total_question=request_body.total_question,
        questions=questions,
        deep_question_mode=continue_question,
    )

    # 面接IDと最初の質問文を返す
    return interview_id, questions[0], continue_question


# POST /interview/{interview_id}
def get_response(
    interview_id: str,
    request_body: InterviewInterviewIdPostRequest,
) -> tuple[int, str]:  # 点数, コメント
    interview_data = get_interview_data(interview_id)
    if interview_data is None:
        raise ValueError("面接データが見つかりません")

    difficulty = Difficulty(interview_data["difficulty"])

    match difficulty:
        case Difficulty.easy | Difficulty.normal:
            return get_feedback(interview_id, request_body)
        case Difficulty.hard | Difficulty.extreme:
            raise NotImplementedError()


# 初級〜中級のFBを取得する
def get_feedback(
    interview_id: str,
    request_body: InterviewInterviewIdPostRequest,
) -> tuple[int, str]:  # 点数, コメント
    # redisから会話履歴を取得する
    question_id = request_body.question_id
    chat_history = get_chat_history(interview_id, question_id)

    if chat_history is None:
        return 0, ""

    # 会話履歴にユーザーのメッセージを追加する
    chat_history.append(
        {
            "role": "user",
            "content": request_body.message,
        }
    )

    # 採点対象のレポジトリ内容を整理する
    session_dir = Path("tmp") / interview_id
    saved_files = get_source_code(session_dir)
    formatted_code = format_source_code(saved_files)

    # LLMにプロンプトを送ってFBを生成する（**テストでも本番でも動く**）
    feedback = generate_feedback(interview_id, formatted_code, chat_history)
    if feedback is None:
        return 0, ""

    score = feedback["score"]
    comment = feedback["comment"]

    # 会話履歴にLLMのメッセージを追加する
    chat_history.append(
        {
            "role": "model",
            "content": comment,
        }
    )

    # redisに会話履歴を保存する
    update_chat_history(
        interview_id=interview_id,
        question_id=question_id,
        chat_history=chat_history,
    )

    # redisに評価結果を追加する
    update_interview_result(
        interview_id=interview_id,
        question_id=question_id,
        score=score,
        comment=comment,
    )

    # 点数とコメントを返す
    return score, comment


# 上級〜激詰の応答を取得する
def get_chat_response():
    pass


# GET /interview/{interview_id}
def get_question(interview_id: str, question_id: int) -> tuple[int, str]:
    # [question_id]の問題に関するやり取りを取得
    history = get_chat_history(interview_id, question_id)
    if history is None:
        return 0, ""

    # 最初のmodel発言（つまり質問）を取得
    question = None
    for item in history:
        if item.get("role") == "model":
            question = item["content"]
            break

    # 問題文を取得できないため
    if question is None:
        return 0, ""

    # 質問文を返す
    return question_id, question


# GET /interview/{interview_id}/result
def get_interview_result(interview_id: str) -> tuple[list[int], str]:
    # redisから各質問のスコアと会話履歴を取得する
    interview_data = get_interview_data(interview_id)
    if interview_data is None:
        return [], ""

    interview_results = interview_data.get("results", [])

    scores = []
    # ダミー除外
    for result in interview_results[1:]:
        if "score" in result:
            scores.append(result["score"])

    chat_histories = []
    total_question = interview_data["total_question"]
    for question_id in range(1, total_question + 1):
        chat_history = get_chat_history(interview_id, question_id)
        if chat_history is None:
            continue

        chat_histories.append(chat_history)

    difficulty = Difficulty(interview_data["difficulty"])

    # 収集したコメントを用いて総評を生成
    general_review = generate_general_review(
        difficulty=difficulty,
        chat_histories=chat_histories,
    )

    if general_review is None:
        return [], ""

    # 各質問のスコアと総評を返す
    return scores, general_review
