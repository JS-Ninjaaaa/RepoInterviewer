import { ApiEndPoint } from '../env';
import type { VscodeApiRequestValue } from "@shared/vscode-api-request-value";

type PayloadOf<T extends VscodeApiRequestValue["type"]> =
  VscodeApiRequestValue extends { type: T; payload: infer P }
  ? P
  : any;

export async function fetchFirstQuestion(
  zipBlob: Blob,
  payload: PayloadOf<"fetchFirstQuestion">
) {
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
  payload: PayloadOf<"fetchFeedback">
) {
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
  payload: PayloadOf<"fetchNextQuestion">
) {
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

export async function fetchGeneralFeedback(payload: PayloadOf<"fetchGeneralFeedback">) {
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
