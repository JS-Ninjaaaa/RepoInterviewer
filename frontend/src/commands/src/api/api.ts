import { ApiEndPoint } from '../env';
import {
  BackendFirstQuestionResponse,
  BackendNextQuestionResponse,
  BackendFeedBackResponse,
  BackendGeneralFeedbackResponse,
} from "@shared/backend-api-response-value";

export async function fetchFirstQuestion(
  zipBlob: Blob,
  payload: { difficulty: string; total_question: number }
): Promise<BackendFirstQuestionResponse> {
  const formData = new FormData();

  // ZIPファイルを Blob に変換して送信
  formData.append('source_code', zipBlob, 'data.zip');
  formData.append('difficulty', payload.difficulty);
  formData.append('total_question', payload.total_question.toString());

  const res = await fetch(`${ApiEndPoint}/interview`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`サーバーエラー: ${res.status}`);
  }

  const result = await res.json();
  return result;
}

export async function fetchFeedBack(
  payload: { interview_id: string; question_id: number; answer: string; }
): Promise<BackendFeedBackResponse> {
  const { interview_id, question_id, answer } = payload;

  // クエリパラメターの設定
  const url = `${ApiEndPoint}/interview/${interview_id}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question_id,
      message: answer, 
    }),
  });

  if (!res.ok) {
    throw new Error(`サーバーエラー : ${res.status}`);
  }

  const result = await res.json();
  return result;
}

export async function fetchNextQuestion(
  payload: { interview_id: string; question_id: number }
): Promise<BackendNextQuestionResponse> {
  const { interview_id, question_id } = payload;

  const url = `${ApiEndPoint}/interview/${interview_id}?question_id=${question_id}`;

  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`質問が見つかりませんでした: ${res.status}`);
  }

  const result = await res.json();
  return result;
}

export async function fetchGeneralFeedback(payload: {
  interview_id: string;
}): Promise<BackendGeneralFeedbackResponse> {
  const { interview_id } = payload;

  const url = `${ApiEndPoint}/interview/${interview_id}/result`;

  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`サーバーエラー: ${res.status}`);
  }

  const result = await res.json();
  return result;
}
