// src/types/chatMessage.ts

export type chatMessage =
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
      // 単一スコア or 深掘りごとのスコア配列
      score: number | number[]
    }
