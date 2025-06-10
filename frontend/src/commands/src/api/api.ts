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

  const backendApiResponse = await fetch(`${ApiEndPoint}/interview`, {
    method: "POST",
    body: formData,
  });

  if (!backendApiResponse.ok) {
    throw new Error(`サーバーエラー: ${backendApiResponse.status}`);
  }

  const FirstQuestion = await backendApiResponse.json();
  return mapFirstQuestion(FirstQuestion);
}

export async function fetchFeedBack(
  payload: PayloadOf<"fetchFeedback">
) {
  const { interviewId, questionId, answer } = payload;

  // クエリパラメターの設定
  const url = `${ApiEndPoint}/interview/${interviewId}`;

  const backendApiResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question_id: questionId,
      message: answer, 
    }),
  });

  if (!backendApiResponse.ok) {
    throw new Error(`サーバーエラー : ${backendApiResponse.status}`);
  }

  const Feedback = await backendApiResponse.json();
  return mapFeedback(Feedback);
}

export async function fetchNextQuestion(
  payload: PayloadOf<"fetchNextQuestion">
) {
  const { interviewId, questionId } = payload;

  const url = `${ApiEndPoint}/interview/${interviewId}?question_id=${questionId}`;

  const backendApiResponse = await fetch(url, {
    method: "GET",
  });

  if (!backendApiResponse.ok) {
    throw new Error(`質問が見つかりませんでした: ${backendApiResponse.status}`);
  }

  const NextQuestion = await backendApiResponse.json();
  return mapNextQuestion(NextQuestion);
}

export async function fetchGeneralFeedback(payload: PayloadOf<"fetchGeneralFeedback">) {
  const { interviewId } = payload;

  const url = `${ApiEndPoint}/interview/${interviewId}/result`;

  const backendApiResponse = await fetch(url, {
    method: "GET",
  });

  if (!backendApiResponse.ok) {
    throw new Error(`サーバーエラー: ${backendApiResponse.status}`);
  }

  const GeneralFeedback = await backendApiResponse.json();
  return mapGeneralFeedback(GeneralFeedback);
}
