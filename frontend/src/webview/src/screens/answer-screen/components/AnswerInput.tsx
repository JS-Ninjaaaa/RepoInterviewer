import { Box, InputBase } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import NextIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ResultIcon from "@mui/icons-material/DoneAll";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";
import type { BottomButtonState } from "@/types/action-button";
import CommonThemeButton from "@/screens/components/CommonThemeButton";

const labelMap: Record<BottomButtonState, string> = {
  send: "send",
  next: "next",
  result: "result",
};

const iconMap: Record<BottomButtonState, React.ElementType> = {
  send: SendIcon,
  next: NextIcon,
  result: ResultIcon,
};

const AnswerInput: React.FC = () => {
  const {
    chatInput,
    setChatInput,
    fetchFeedback,
    fetchNextQuestion,
    fetchGeneralFeedback,
    displayEnterBox,
    bottomButtonState,
  } = useAnswerContext();

  const IconComponent = iconMap[bottomButtonState];
  const iconLabel = labelMap[bottomButtonState];

  const handleButtonClick = () => {
    switch (bottomButtonState) {
      case "send":
        fetchFeedback();
        break;
      case "next":
        fetchNextQuestion();
        break;
      case "result":
        fetchGeneralFeedback();
        break;
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "90px",
          width: "100%",
          justifyContent: "space-between",
          backgroundColor: (theme) => theme.palette.background.paper,
          p: 4,
          gap: 2,
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? `0px -4px 8px ${theme.palette.shadowColor}`
              : "none",
        }}
      >
        {displayEnterBox ? (
          <InputBase
            placeholder="Type your answer…"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === "Enter") {
                handleButtonClick();
              }
            }}
            fullWidth
            sx={{
              flex: 1,
              border: 1,
              borderColor: (theme) => theme.palette.text.disabled,
              color: (theme) => theme.palette.text.disabled,
              borderRadius: "8px",
              fontSize: 16,
              px: 2,
              py: "4px",
              "& input::placeholder": {
                color: (theme) => theme.palette.text.disabled,
                opacity: 1,
              },
            }}
          />
        ) : (
          <Box sx={{ flex: 1 }} />
        )}

        <CommonThemeButton
          type="submit"
          onClick={handleButtonClick}
          endIcon={<IconComponent sx={{ marginRight: "4px" }} />}
          sx={{
            fontSize: 16,
            color: "white",
            px: "12px",
          }}
        >
          {iconLabel}
        </CommonThemeButton>
      </Box>
    </>
  );
};

export default AnswerInput;
