export type apiRequestValue =
  | { type: 'fetchFirstQuestion'; payload: { difficulty: string; total_question: number } }
  | { type: 'fetchNextQuestion'; payload: { interview_id: string; question_id: number }}
  | { type: 'fetchFeedBack'; payload: { interview_id: string; question_id: number, answer: string }}
  | { type: 'fetchGeneralFeedback'; payload: { interview_id: string; }}
  | { type: 'closeWebview'; };

