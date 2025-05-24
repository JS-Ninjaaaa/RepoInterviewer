import { useRef, useCallback } from 'react';
import type { chatMessage } from '../../types/chatMessage';

export function useThinkingAnimation(
  setChatHistory: React.Dispatch<React.SetStateAction<chatMessage[]>>
) {
  const intervalRef = useRef<number | null>(null);
  const indexRef = useRef<number | null>(null);

  const startThinking = useCallback(() => {
    // 既存の interval があればクリア
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    // ５つのアニメーション状態
    const states = [
      "考え中",           // 1: 考え中
      "考え中・",         // 2: ドット1
      "考え中・・",       // 3: ドット2
      "考え中・・・",     // 4: ドット3
    ];

    // プレースホルダーを追加し、インデックスを保存
    setChatHistory(prev => {
      const idx = prev.length;
      indexRef.current = idx;
      return [...prev, { type: 'thinking', text: states[0] }];
    });

    // アニメーション用のカウンタ
    let animIndex = 0;

    intervalRef.current = window.setInterval(() => {
      if (indexRef.current === null) return;
      // 次の状態へ
      animIndex = (animIndex + 1) % states.length;
      setChatHistory(curr =>
        curr.map((m, i) =>
          i === indexRef.current
            ? { type: 'thinking', text: states[animIndex] }
            : m
        )
      );
    }, 500);
  }, [setChatHistory]);

  const stopThinking = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const idx = indexRef.current;
    if (idx == null) return;

    // プレースホルダーを消す
    setChatHistory(prev => {
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
    indexRef.current = null;
  }, [setChatHistory]);

  return { startThinking, stopThinking };
}
