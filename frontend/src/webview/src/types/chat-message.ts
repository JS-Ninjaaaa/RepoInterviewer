export type ChatMessage =
  | {
      type: "question";
      text: string;
      questionId: number;
    }
  | {
      type: "answer";
      text: string;
    }
  | {
      type: "feedback";
      text: string;
      score: number | number[];
    }
  | {
      type: "thinking";
      dots: number;
    };
