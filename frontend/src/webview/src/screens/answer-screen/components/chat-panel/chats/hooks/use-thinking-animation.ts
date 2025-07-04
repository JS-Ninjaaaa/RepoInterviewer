import { useRef, useCallback } from "react";
import type { ChatMessage } from "@/types/chat-message";

export function useThinkingAnimation(
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) {
  const intervalRef = useRef<number | null>(null);
  const indexRef = useRef<number | null>(null);

  const startThinking = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    const states = [0, 1, 2, 3];

    setChatHistory((prev) => {
      const idx = prev.length;
      indexRef.current = idx;
      return [...prev, { type: "thinking", dots: states[0] }];
    });

    let animationIndex = 0;

    intervalRef.current = window.setInterval(() => {
      if (indexRef.current === null) return;
      animationIndex = (animationIndex + 1) % states.length;

      setChatHistory((current) =>
        current.map((m, i) =>
          i === indexRef.current
            ? { type: "thinking", dots: states[animationIndex] }
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
    if (idx === null) {
      return;
    }

    // プレースホルダーを消す
    setChatHistory((prev) => {
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
    indexRef.current = null;
  }, [setChatHistory]);

  return { startThinking, stopThinking };
}
