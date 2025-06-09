import { Box, Avatar, Typography } from "@mui/material";
import type { ChatMessage } from "@/types/chat-message";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";

type ThinkingChatMessage = Extract<ChatMessage, { type: "thinking" }>;

interface Props {
  msg: ThinkingChatMessage;
  index: number;
}

const ThinkingMessage: React.FC<Props> = ({ msg }) => {
  const { currentCharacter } = useAnswerContext();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        my: 2,
      }}
    >
      <Avatar
        src={currentCharacter.image}
        alt={currentCharacter.name}
        sx={{ width: 56, height: 56, m: 2 }}
      />
      <Typography
        sx={{
          width: 120,
          px: 2,
          py: 1,
          borderRadius: 2,
          bgcolor: currentCharacter.color[50],
          fontSize: 16,
          color: currentCharacter.color[700],
        }}
      >
        {msg.text}
      </Typography>
    </Box>
  );
};

export default ThinkingMessage;
