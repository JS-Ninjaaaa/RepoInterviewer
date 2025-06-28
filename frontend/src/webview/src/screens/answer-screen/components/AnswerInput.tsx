import { Box, Button, InputBase, useTheme } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import NextIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ResultIcon from "@mui/icons-material/DoneAll";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";
import type { BottomButtonState } from "@/types/action-button";

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
  const theme = useTheme();
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
          bgcolor: "#1c2a42",
          boxShadow: 1,
          p: 2,
          gap: 2,
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
              border: `1px solid ${theme.palette.grey[400]}`,
              borderRadius: "8px",
              fontSize: 16,
              px: 2,
              py: "4px",
            }}
          />
        ) : (
          <Box sx={{ flex: 1 }} />
        )}
        
        <Button
          type="submit"
          onClick={handleButtonClick}
          endIcon={<IconComponent sx={{ marginRight: "4px" }} />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontSize: 16,
            color: "white",
            px: "12px",
            background: "linear-gradient(135deg, #00C853 0%, #3877FF 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #00B14A 0%, #336EE6 100%)",
            },
          }}
        >
          {iconLabel}
        </Button>
      </Box>
    </>
  );
};

export default AnswerInput;
