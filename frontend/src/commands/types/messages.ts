export type Message =
  | { type: "fetchfirstQuestion"; payload: { difficulty: string; total_question: number } }
  | { type: "fetchNextQuestion"; payload: { interview_id: string; question_id: number }}
  | { type: "fetchFeedBack"; payload: { interview_id: string; question_id: number, answer: string }};

