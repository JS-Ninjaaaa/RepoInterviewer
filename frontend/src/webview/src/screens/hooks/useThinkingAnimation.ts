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

    // プレースホルダーを追加し、インデックスを ref に保存
    setChatHistory(prev => {
      const idx = prev.length;
      indexRef.current = idx;
      return [...prev, { type: 'thinking', text: '考え中.' }];
    });

    // 1〜4 のドットをループ
    let dotCount = 1;
    intervalRef.current = window.setInterval(() => {
      dotCount = (dotCount % 3) + 1;
      setChatHistory(curr =>
        curr.map((m, i) =>
          i === indexRef.current
            ? { type: 'thinking', text: `考え中${'・'.repeat(dotCount)}` }
            : m
        )
      );
    }, 500);
  }, [setChatHistory]);

  const stopThinking = useCallback(() => {
    // interval をクリア
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
