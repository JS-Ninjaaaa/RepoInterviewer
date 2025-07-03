import { API_ENDPOINT, API_TOKEN } from "../env";
import type { VscodeApiRequestValue } from "@shared/vscode-api-request-value";
import {
  mapFirstQuestion,
  mapNextQuestion,
  mapFeedback,
  mapGeneralFeedback,
} from "../utilities/mappers";

type PayloadOf<T extends VscodeApiRequestValue["type"]> =
  VscodeApiRequestValue extends { type: T; payload: infer P } ? P : any;

export async function fetchFirstQuestion(
  zipBlob: Blob,
  payload: PayloadOf<"fetchFirstQuestion">
) {
  const formData = new FormData();

  formData.append("source_code", zipBlob, "data.zip");
  formData.append("difficulty", payload.difficulty);
  formData.append("total_question", payload.totalQuestion.toString());

  const response = await fetch(`${API_ENDPOINT}/interview`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`サーバーエラー: ${response.status}`);
  }

  const firstQuestion = await response.json();
  return mapFirstQuestion(firstQuestion);
}

export async function fetchFeedBack(payload: PayloadOf<"fetchFeedback">) {
  const { interviewId, questionId, answer } = payload;

  const url = `${API_ENDPOINT}/interview/${interviewId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      question_id: questionId.toString(),
      message: answer,
    }),
  });

  if (!response.ok) {
    throw new Error(`サーバーエラー : ${response.status}`);
  }

  const feedback = await response.json();
  return mapFeedback(feedback);
}

export async function fetchNextQuestion(
  payload: PayloadOf<"fetchNextQuestion">
) {
  const { interviewId, questionId } = payload;

  const url = `${API_ENDPOINT}/interview/${interviewId}?question_id=${questionId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`質問が見つかりませんでした: ${response.status}`);
  }

  const nextQuestion = await response.json();
  return mapNextQuestion(nextQuestion);
}

export async function fetchGeneralFeedback(
  payload: PayloadOf<"fetchGeneralFeedback">
) {
  const { interviewId } = payload;

  const url = `${API_ENDPOINT}/interview/${interviewId}/result`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`サーバーエラー: ${response.status}`);
  }

  const generalFeedback = await response.json();
  return mapGeneralFeedback(generalFeedback);
}
