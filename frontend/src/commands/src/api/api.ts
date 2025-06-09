import { ApiEndPoint } from '../env';
import type { VscodeApiRequestValue } from "@shared/vscode-api-request-value";
import {
  mapFirstQuestion,
  mapNextQuestion,
  mapFeedback,
  mapGeneralFeedback,
} from "../utilities/mappers";

type PayloadOf<T extends VscodeApiRequestValue["type"]> =
  VscodeApiRequestValue extends { type: T; payload: infer P }
  ? P
  : any;

export async function fetchFirstQuestion(
  zipBlob: Blob,
  payload: PayloadOf<"fetchFirstQuestion">
) {
  const formData = new FormData();
  
  formData.append('source_code', zipBlob, 'data.zip');
  formData.append('difficulty', payload.difficulty);
  formData.append('total_question', payload.totalQuestion.toString());

  const res = await fetch(`${ApiEndPoint}/interview`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`サーバーエラー: ${res.status}`);
  }

  const backendResult = await res.json();
  return mapFirstQuestion(backendResult);
}

export async function fetchFeedBack(
  payload: PayloadOf<"fetchFeedback">
) {
  const { interviewId, questionId, answer } = payload;

  // クエリパラメターの設定
  const url = `${ApiEndPoint}/interview/${interviewId}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question_id: questionId,
      message: answer, 
    }),
  });

  if (!res.ok) {
    throw new Error(`サーバーエラー : ${res.status}`);
  }

  const backendResult = await res.json();
  return mapFeedback(backendResult);
}

export async function fetchNextQuestion(
  payload: PayloadOf<"fetchNextQuestion">
) {
  const { interviewId, questionId } = payload;

  const url = `${ApiEndPoint}/interview/${interviewId}?question_id=${questionId}`;

  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`質問が見つかりませんでした: ${res.status}`);
  }

  const backendResult = await res.json();
  return mapNextQuestion(backendResult);
}

export async function fetchGeneralFeedback(payload: PayloadOf<"fetchGeneralFeedback">) {
  const { interviewId } = payload;

  const url = `${ApiEndPoint}/interview/${interviewId}/result`;

  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`サーバーエラー: ${res.status}`);
  }

  const backendResult = await res.json();
  return mapGeneralFeedback(backendResult);
}
