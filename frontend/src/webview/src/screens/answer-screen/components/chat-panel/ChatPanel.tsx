import { Box } from "@mui/material";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";
import { useRef, useEffect } from "react";
import QuestionMessage from "@/screens/answer-screen/components/chat-panel/chats/QuestionMessage";
import AnswerMessage from "@/screens/answer-screen/components/chat-panel/chats/AnswerMessage";
import FeedbackMessage from "@/screens/answer-screen/components/chat-panel/chats/FeedbackMessage";
import ThinkingMessage from "@/screens/answer-screen/components/chat-panel/chats/ThinkingMessage";

const ChatPanel: React.FC = () => {
  const { chatHistory, scrollTop } = useAnswerContext();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollTop) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, scrollTop]);

  return (
    <Box sx={{ height: "100%", overflowY: "auto", p: 4, bgcolor: "black"}}>
      {chatHistory.map((msg, index) => (
        <Box key={index}>
          {index === chatHistory.length - 1 && (
            <Box ref={bottomRef} sx={{ mt: 2 }} />
          )}

          {msg.type === "question" && (
            <QuestionMessage msg={msg} index={index} />
          )}
          {msg.type === "answer" && <AnswerMessage msg={msg} index={index} />}
          {msg.type === "feedback" && (
            <FeedbackMessage msg={msg} index={index} />
          )}
          {msg.type === "thinking" && (
            <ThinkingMessage msg={msg} index={index} />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ChatPanel;
