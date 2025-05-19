export async function fetchfirstQuestion(
  zipBinary: Uint8Array,
  payload: { difficulty: string; puestion_id: number }
): Promise<any> {
  const { difficulty, puestion_id } = payload;

  // クエリ文字列にメタ情報を埋め込む
  const url = `http://localhost:3001/upload?difficulty=${encodeURIComponent(
    difficulty
  )}&puestion_id=${puestion_id}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/zip",
    },
    body: zipBinary, // ← ZIPだけ送る！
  });

  if (!res.ok) {
    throw new Error(`サーバーエラー: ${res.status}`);
  }

  const result = await res.json();
  return result;
}
