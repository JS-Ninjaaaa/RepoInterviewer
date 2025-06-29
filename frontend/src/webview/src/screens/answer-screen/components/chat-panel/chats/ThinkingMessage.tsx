import { Box, Avatar, Typography, useTheme } from "@mui/material";
import type { ChatMessage } from "@/types/chat-message";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";
import CommonThemeBox from "@/screens/components/CommonThemeBox";

type ThinkingChatMessage = Extract<ChatMessage, { type: "thinking" }>;

interface Props {
  msg: ThinkingChatMessage;
  index: number;
}

const ThinkingMessage: React.FC<Props> = ({ msg }) => {
  const theme = useTheme();
  const dotColors = [
    theme.palette.secondary.light,
    theme.palette.secondary.main,
    theme.palette.secondary.dark,
  ];
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
        sx={{
          width: 56,
          height: 56,
          m: 2,
          border: 2,
          borderColor: (theme) => theme.palette.primary.light,
        }}
      />
      <CommonThemeBox
        sx={{
          display: "flex",
          alignItems: "center",
          ml: 0,
          width: "50%",
          gap: 2,
        }}
      >
        <Typography sx={{ fontSize: 16 }}>考え中</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {dotColors.map((color, i) => (
            <Box
              key={i}
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor:
                  i < msg.dots ? color : theme.palette.background.default,
              }}
            />
          ))}
        </Box>
      </CommonThemeBox>
    </Box>
  );
};

export default ThinkingMessage;
