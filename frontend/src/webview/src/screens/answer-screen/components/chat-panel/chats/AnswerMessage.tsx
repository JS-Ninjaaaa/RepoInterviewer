import { Box, Avatar, Typography } from "@mui/material";
import type { ChatMessage } from "@/types/chat-message";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";

type AnswerChatMessage = Extract<ChatMessage, { type: "answer" }>;

interface Props {
  msg: AnswerChatMessage;
  index: number;
}

const AnswerMessage: React.FC<Props> = ({ msg }) => {
  const { currentCharacter } = useAnswerContext();
  return (
    <Box sx={{ my: 2, width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <Avatar
          alt={currentCharacter.name}
          sx={{ width: 56, height: 56, m: 2 }}
        />
      </Box>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Box
          sx={{
            bgcolor: currentCharacter.color[50],
            p: 2,
            borderRadius: 2,
            width: "100%",
          }}
        >
          <Typography sx={{ fontSize: 16 }}>{msg.text}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AnswerMessage;
