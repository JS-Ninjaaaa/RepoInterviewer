import os

from app.domain.entities.interview_question import InterviewQuestion
from app.domain.repositories.interview_repository import InterviewRepository
from google.cloud import firestore


class FirestoreInterviewRepository(InterviewRepository):
    def __init__(self) -> None:
        """コンストラクタ"""
        self.db = firestore.Client(project=os.getenv("GCP_PROJECT_ID"))
        self.interviews_collection = self.db.collection("interviews")

    def create_interview(self, questions: list[InterviewQuestion]) -> None:
        """面接を作成する

        Args:
            questions (list[InterviewQuestion]): 質問のリスト
        """
        # Firestoreのバッチ書き込みを使用して効率的にデータを保存
        batch = self.db.batch()

        for question in questions:
            # 面接IDをドキュメントIDとして使用
            # 質問をサブコレクションとして保存
            interview_doc = self.interviews_collection.document(question.interview_id)
            question_doc = interview_doc.collection("questions").document(
                question.question_id
            )

            # 質問データを辞書形式で保存
            question_data = question.to_dict()
            batch.set(question_doc, question_data)

        # バッチ書き込みを実行
        batch.commit()

    def get_question(
        self,
        interview_id: str,
        question_id: str,
    ) -> InterviewQuestion | None:
        """質問を取得する

        Args:
            interview_id (str): 面接ID
            question_id (str): 質問ID

        Returns:
            InterviewQuestion | None: 質問
        """
        try:
            # 特定の質問ドキュメントを取得
            question_doc = (
                self.interviews_collection.document(interview_id)
                .collection("questions")
                .document(question_id)
                .get()
            )

            if not question_doc.exists:
                return None

            # ドキュメントデータを辞書形式で取得
            question_data = question_doc.to_dict()
            if question_data is None:
                return None

            return InterviewQuestion.from_dict(question_data)

        except Exception:
            return None

    def update_question(
        self,
        interview_id: str,
        question_id: str,
        question: InterviewQuestion,
    ) -> InterviewQuestion:
        """質問の情報を更新する

        Args:
            interview_id (str): 面接ID
            question_id (str): 質問ID
            question (InterviewQuestion): 更新後の質問

        Returns:
            InterviewQuestion: 更新後の質問
        """
        # 質問ドキュメントを更新
        question_doc = (
            self.interviews_collection.document(interview_id)
            .collection("questions")
            .document(question_id)
        )

        # 質問データを辞書形式で更新
        question_data = question.to_dict()
        question_doc.set(question_data)

        return question

    def get_all_questions(
        self,
        interview_id: str,
    ) -> list[InterviewQuestion]:
        """面接の質問をすべて取得する

        Args:
            interview_id (str): 面接ID

        Returns:
            list[InterviewQuestion]: 面接の質問のリスト
        """
        try:
            # 面接の全質問ドキュメントを取得
            questions_docs = (
                self.interviews_collection.document(interview_id)
                .collection("questions")
                .stream()
            )

            questions = []
            for doc in questions_docs:
                question_data = doc.to_dict()
                if question_data is not None:
                    questions.append(InterviewQuestion.from_dict(question_data))

            return questions

        except Exception:
            return []
