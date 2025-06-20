import json
from enum import Enum

import inquirer
import requests

BASE_URL = "http://127.0.0.1:8000"


class Action(Enum):
    SETUP = "setup"
    ANSWER = "answer"
    CURRENT = "current"
    NEXT = "next"
    RESULT = "result"
    EXIT = "exit"


def is_json(text: str) -> bool:
    try:
        json.loads(text)
        return True
    except json.JSONDecodeError:
        return False


def print_result(status_code: int, expected: int, body: str) -> bool:
    passed = False

    if status_code == expected and is_json(body):
        print(f"Status: {status_code} ✅ Passed")
        passed = True
    else:
        print(f"Status: {status_code} ❌ Failed (Expected {expected})")

    print(f"Response: {body}\n")

    return passed


class InterviewSession:
    def __init__(self):
        self.interview_id = ""
        self.current_question_id = 1
        self.total_questions = 2

    def set_up_interview(self) -> bool:
        print("Testing POST /interview")

        url = f"{BASE_URL}/interview"

        with open("example/yumemi/archive.zip", "rb") as f:
            files = {
                "source_code": ("archive.zip", f, "application/zip"),
            }
            request_body = {
                "difficulty": "easy",
                "total_question": self.total_questions,
            }

            response = requests.post(url, files=files, data=request_body)
            passed = print_result(response.status_code, 201, response.text)

            if not passed:
                return False

            response_body = response.json()
            self.interview_id = response_body.get("interview_id")

            return passed

    def post_answer(self, message: str) -> None:
        if not self.interview_id:
            print("Please run POST /interview first to get interview id")
            return

        print("Testing POST /interview/:interview_id")

        url = f"{BASE_URL}/interview/{self.interview_id}"
        headers = {"Content-Type": "application/json"}
        request_body = {
            "question_id": str(self.current_question_id),
            "message": message,
        }

        response = requests.post(url, headers=headers, json=request_body)
        print_result(response.status_code, 200, response.text)

    def get_current_question(self) -> None:
        if not self.interview_id:
            print("Please run POST /interview first to get interview id")
            return

        print(
            f"Testing GET /interview/:interview_id?question_id={self.current_question_id}"
        )

        url = f"{BASE_URL}/interview/{self.interview_id}"
        params = {"question_id": str(self.current_question_id)}
        headers = {"Content-Type": "application/json"}

        response = requests.get(url, params=params, headers=headers)
        print_result(response.status_code, 200, response.text)

    def get_next_question(self) -> None:
        if not self.interview_id:
            print("Please run POST /interview first to get interview id")
            return

        if self.current_question_id >= self.total_questions:
            print("All questions have been completed")
            return

        self.current_question_id += 1
        self.get_current_question()

    def get_interview_result(self) -> None:
        if not self.interview_id:
            print("Please run POST /interview first to get interview id")
            return

        print("Testing GET /interview/:interview_id/result")

        url = f"{BASE_URL}/interview/{self.interview_id}/result"
        headers = {"Content-Type": "application/json"}

        response = requests.get(url, headers=headers)
        print_result(response.status_code, 200, response.text)


def handle_action(action: Action, session: InterviewSession) -> bool:
    """アクションを処理し、終了するかどうかを返す"""
    if action == Action.SETUP:
        if not session.set_up_interview():
            print("面接の開始に失敗しました")
        return False

    elif action == Action.ANSWER:
        if not session.interview_id:
            print("先に面接を開始してください (POST /interview)")
            return False

        answer_questions = [inquirer.Text("message", message="回答を入力してください")]
        answer_answers = inquirer.prompt(answer_questions)
        if answer_answers:
            session.post_answer(answer_answers["message"])
        return False

    elif action == Action.CURRENT:
        session.get_current_question()
        return False

    elif action == Action.NEXT:
        session.get_next_question()
        return False

    elif action == Action.RESULT:
        session.get_interview_result()
        return False

    elif action == Action.EXIT:
        return True


def show_menu() -> None:
    session = InterviewSession()

    while True:
        questions = [
            inquirer.List(
                "action",
                message="RepoInterviewer API Test CLI",
                choices=[
                    ("POST /interview", Action.SETUP.value),
                    ("POST /interview/:interview_id", Action.ANSWER.value),
                    ("GET /interview/:interview_id (current)", Action.CURRENT.value),
                    ("GET /interview/:interview_id (next)", Action.NEXT.value),
                    ("GET /interview/:interview_id/result", Action.RESULT.value),
                    ("Exit", Action.EXIT.value),
                ],
            )
        ]

        answers = inquirer.prompt(questions)

        if not answers:
            break

        action = Action(answers["action"])
        should_exit = handle_action(action, session)

        if should_exit:
            break


if __name__ == "__main__":
    show_menu()
