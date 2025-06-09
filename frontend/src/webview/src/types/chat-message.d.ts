export type ChatMessage =
  | {
      type: 'question'
      text: string
    }
  | {
      type: 'answer'
      text: string
    }
  | {
      type: 'feedback'
      text: string
      score: number | number[]
    }
  | { 
      type: 'thinking'; 
      text: string 
    };
