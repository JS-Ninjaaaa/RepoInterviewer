import json

import requests

BASE_URL = "http://127.0.0.1:8000"


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

            response = requests.post(url, files=files, json=request_body)
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
            "question_id": self.current_question_id,
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
        params = {"question_id": self.current_question_id}
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


def show_menu() -> None:
    session = InterviewSession()

    while True:
        print("\nRepoInterviewer API Test CLI")
        print("--------------------------------")
        print("1. POST /interview")
        print("2. POST /interview/:interview_id")
        print("3. GET /interview/:interview_id")
        print("4. GET /interview/:interview_id/result")
        print("5. Next Question")
        print("6. Exit")

        choice = input("\nSelect a test to run (1-6): ")

        if choice == "1":
            if not session.set_up_interview():
                print("Failed to start interview")

        elif choice == "2":
            message = input("Enter your answer: ")
            session.post_answer(message)

        elif choice == "3":
            session.get_current_question()

        elif choice == "4":
            session.get_interview_result()

        elif choice == "5":
            session.get_next_question()

        elif choice == "6":
            break

        else:
            print("Invalid option")


if __name__ == "__main__":
    show_menu()
