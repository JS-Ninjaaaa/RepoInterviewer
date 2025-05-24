import { apiEndPoint } from '../env';
import {
  FirstQuestionResponse,
  NextQuestionResponse,
  FeedBackResponse,
  GeneralFeedbackResponse,
} from "../types/apiResponseValue";

export async function fetchFirstQuestion(
  zipBlob: Blob,
  payload: { difficulty: string; total_question: number }
): Promise<FirstQuestionResponse> {
  const formData = new FormData();

  // ZIPファイルを Blob に変換して送信
  formData.append('source_code', zipBlob, 'data.zip');
  formData.append('difficulty', payload.difficulty);
  formData.append('total_question', payload.total_question.toString());

  const res = await fetch(`${apiEndPoint}/interview`, {
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
): Promise<FeedBackResponse> {
  const { interview_id, question_id, answer } = payload;

  // クエリパラメターの設定
  const url = `${apiEndPoint}/interview/${interview_id}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question_id,
      message: answer, // 仕様に合わせてキー名は `message`
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
): Promise<NextQuestionResponse> {
  const { interview_id, question_id } = payload;

  const url = `${apiEndPoint}/interview/${interview_id}?question_id=${question_id}`;

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
}): Promise<GeneralFeedbackResponse> {
  const { interview_id } = payload;

  const url = `${apiEndPoint}/interview/${interview_id}/result`;

  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`サーバーエラー: ${res.status}`);
  }

  const result = await res.json();
  return result;
}
