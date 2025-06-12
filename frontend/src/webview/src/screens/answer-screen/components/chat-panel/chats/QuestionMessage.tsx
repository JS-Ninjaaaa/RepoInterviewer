import { Box, Avatar, Typography } from "@mui/material";
import type { ChatMessage } from "@/types/chat-message";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";

type QuestionChatMessage = Extract<ChatMessage, { type: "question" }>;

interface Props {
  msg: QuestionChatMessage;
  index: number;
}

const QuestionMessage: React.FC<Props> = ({ msg }) => {
  const { currentCharacter } = useAnswerContext();
  return (
    <Box sx={{ my: 2 }}>
      <Box sx={{ display: "flex", gap: "5%", alignItems: "center", mt: 1 }}>
        <Avatar
          src={currentCharacter.image}
          alt={currentCharacter.name}
          sx={{ width: 56, height: 56, m: 2 }}
        />
        <Box
          sx={{
            backgroundColor: currentCharacter.color[400],
            color: "white",
            p: 1,
            borderRadius: 1,
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
            {msg.questionId} of {currentCharacter.totalQuestion}
          </Typography>
        </Box>
      </Box>
      {/* 質問テキスト */}
      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <Typography
          sx={{ p: 2, bgcolor: currentCharacter.color[50], borderRadius: 2 }}
        >
          {msg.text}
        </Typography>
      </Box>
    </Box>
  );
};

export default QuestionMessage;
