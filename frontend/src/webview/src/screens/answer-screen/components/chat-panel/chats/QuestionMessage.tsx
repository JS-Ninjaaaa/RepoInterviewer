import { Box, Avatar, Typography } from "@mui/material";
import type { ChatMessage } from "@/types/chat-message";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";
import CommonThemeBox from "@/screens/components/CommonThemeBox";
import CommonThemeButton from "@/screens/components/CommonThemeButton";

type QuestionChatMessage = Extract<ChatMessage, { type: "question" }>;

interface Props {
  msg: QuestionChatMessage;
  index: number;
}

const QuestionMessage: React.FC<Props> = ({ msg }) => {
  const { currentCharacter } = useAnswerContext();
  return (
    <Box sx={{ my: 2 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 1 }}>
        <Avatar
          src={currentCharacter.image}
          alt={currentCharacter.name}
          sx={{
            width: 56,
            height: 56,
            m: 2,
            border: 1.2,
            borderColor: (theme) => theme.palette.primary.light,
          }}
        />
        <CommonThemeButton sx={{ p: "4px" }}>
          Q.{msg.questionId}
        </CommonThemeButton>
      </Box>

      <CommonThemeBox sx={{ ml: 0 }}>
        <Typography>{msg.text}</Typography>
      </CommonThemeBox>
    </Box>
  );
};

export default QuestionMessage;
