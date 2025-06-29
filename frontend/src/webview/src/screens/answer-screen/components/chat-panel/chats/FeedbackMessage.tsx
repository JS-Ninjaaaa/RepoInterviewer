import { Box, Avatar, Typography } from "@mui/material";
import type { ChatMessage } from "@/types/chat-message";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";
import CommonThemeBox from "@/screens/components/CommonThemeBox";

type FeedbackChat = Extract<ChatMessage, { type: "feedback" }>;

interface Props {
  msg: FeedbackChat;
  index: number;
}

const FeedbackMessage: React.FC<Props> = ({ msg }) => {
  const { currentCharacter } = useAnswerContext();
  const score = Array.isArray(msg.score) ? msg.score[0] : msg.score;
  const maxPerQuestion = 100 / currentCharacter.totalQuestion;
  const percent = Math.min(100, Math.max(0, (score / maxPerQuestion) * 100));

  const textColors = [
    "#00C853",
    "#0CB679",
    "#19A49F",
    "#2592C6",
    "#3280EC",
    "#3F6FFD",
    "#4D5FF8",
    "#5B4FF4",
    "#693FEF",
    "#772FEB",
  ];

  const idx = Math.min(9, Math.floor(percent / 10));

  return (
    <Box sx={{ my: 2 }}>
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
      <CommonThemeBox
        sx={{
          ml: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <Box
            sx={{
              position: "relative",
              flex: "none",
              width: "60%",
              height: 4,
              borderRadius: 4,
              background: (theme) => theme.gradients.primary,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${percent}%`,
                right: 0,
                bgcolor: (theme) => theme.palette.grey[300],
              }}
            />
          </Box>

          <Typography
            sx={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 36,
              color: textColors[idx],
            }}
          >
            {score}
            <Typography
              sx={{
                fontSize: 24,
                ml: 1,
                color: "inherit",
              }}
            >
              点
            </Typography>
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 16, whiteSpace: "pre-wrap" }}>
          {msg.text}
        </Typography>
      </CommonThemeBox>
    </Box>
  );
};

export default FeedbackMessage;
