import { Box, Avatar, Typography, useTheme } from "@mui/material";
import type { ChatMessage } from "@/types/chat-message";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";
import CommonThemeBox from "@/screens/components/CommonThemeBox";

type FeedbackChat = Extract<ChatMessage, { type: "feedback" }>;

interface Props {
  msg: FeedbackChat;
  index: number;
}

const FeedbackMessage: React.FC<Props> = ({ msg }) => {
  const theme = useTheme();
  const { currentCharacter } = useAnswerContext();
  const score = Array.isArray(msg.score) ? msg.score[0] : msg.score;
  const maxPerQuestion = 100 / currentCharacter.totalQuestion;
  const percent = Math.min(100, Math.max(0, (score / maxPerQuestion) * 100));

  let textStyle: React.CSSProperties = {};
  if (percent <= 20) {
    textStyle.color = "#ff5252";
  } else if (percent <= 40) {
    textStyle.color = "#ffed00";
  } else if (percent <= 60) {
    textStyle.color = theme.palette.secondary.light;
  } else if (percent <= 80) {
    textStyle.color = theme.palette.secondary.main;
  } else {
    textStyle = {
      background: theme.gradients.primary,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    };
  }

  return (
    <Box sx={{ my: 2 }}>
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
              background:
                "linear-gradient(90deg, " +
                "#ff5252 0%, " +
                "#ffed00 25%, " +
                "#00c853 50%, " +
                "#3877ff 75%, " +
                "#772feb 100%" +
                ")",
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
              ...textStyle,
            }}
          >
            {score}
            <Typography
              sx={{
                fontSize: 24,
                ml: 1,
                color: textStyle.color || "inherit",
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
