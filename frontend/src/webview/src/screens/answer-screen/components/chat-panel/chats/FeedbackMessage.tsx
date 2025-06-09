import { Box, Avatar, Typography } from "@mui/material";
import type { ChatMessage } from "@/types/chat-message";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";

type FeedbackChat = Extract<ChatMessage, { type: "feedback" }>;

interface Props {
  msg: FeedbackChat;
  index: number;
}

const FeedbackMessage: React.FC<Props> = ({ msg }) => {
  const { currentCharacter } = useAnswerContext();
  return (
    <Box sx={{ my: 2 }}>
      <Avatar
        src={currentCharacter.image}
        alt={currentCharacter.name}
        sx={{ width: 56, height: 56, m: 2 }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: currentCharacter.color[50],
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography
          sx={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 36,
            color: currentCharacter.color[600],
          }}
        >
          {msg.score}
          <Typography sx={{ fontSize: 24 }}>点</Typography>
        </Typography>
        <Typography sx={{ fontSize: 16, whiteSpace: "pre-wrap" }}>
          {msg.text}
        </Typography>
      </Box>
    </Box>
  );
};

export default FeedbackMessage;
