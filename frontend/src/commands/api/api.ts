const ENDPOINT = "http://localhost:3001";

export async function fetchfirstQuestion(
  zipBinary: Uint8Array,
  payload: { difficulty: string; total_question: number }
): Promise<any> {

  const formData = new FormData();
  
  // ZIPファイルを Blob に変換して送信
  const zipBlob = new Blob([zipBinary], { type: "application/zip" });
  formData.append("source_code", zipBlob, "data.zip");

  formData.append("difficulty", payload.difficulty);
  formData.append("total_question", payload.total_question.toString());

  const res = await fetch(`${ENDPOINT}/interview`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData
  });

  if (!res.ok) {
    throw new Error(`サーバーエラー: ${res.status}`);
  }

  const result = await res.json();
  return result;
}

export async function fetchNextQuestion(payload: { interview_id: string; question_id: number }) {
  const { interview_id, question_id } = payload;

  // クエリパラメターの設定
  const url = `${ENDPOINT}/interview/${interview_id}?question_id=${question_id}`;

  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`サーバーエラー: ${res.status}`);
  }

  const result = await res.json();
  return result;
}

export async function fetchFeedBack(payload: { interview_id: string; question_id: number; answer: string; }) {
  const { interview_id, question_id } = payload;

  // クエリパラメターの設定
  const url = `${ENDPOINT}/feedback/${interview_id}?question_id=${question_id}`;

  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`サーバーエラー: ${res.status}`);
  }

  const result = await res.json();
  return result;
}


