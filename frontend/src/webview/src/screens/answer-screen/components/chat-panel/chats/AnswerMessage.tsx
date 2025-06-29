import { Typography } from "@mui/material";
import type { ChatMessage } from "@/types/chat-message";
import CommonThemeBox from "@/screens/components/CommonThemeBox";

type AnswerChatMessage = Extract<ChatMessage, { type: "answer" }>;

interface Props {
  msg: AnswerChatMessage;
  index: number;
}

const AnswerMessage: React.FC<Props> = ({ msg }) => {
  return (
    <CommonThemeBox sx={{ my: 4, ml: "auto" }}>
      <Typography sx={{ fontSize: 16 }}>{msg.text}</Typography>
    </CommonThemeBox>
  );
};

export default AnswerMessage;
