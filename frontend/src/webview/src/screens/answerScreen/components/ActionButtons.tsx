import { Box, Button } from "@mui/material";
import { theme } from "@/theme";
import { useAnswerContext } from "@/screens/answerScreen/context/UseAnswerContext";

const ActionButtons: React.FC = () => {
  const {
    buttonDisplay,
    fetchNextQuestion,
    fetchGeneralFeedback,
    setInterruptModalOpen,
    setSkipModalOpen,
  } = useAnswerContext();

  const handleClick = () => {
    if (buttonDisplay === "次へ") {
      fetchNextQuestion();
    } else if (buttonDisplay === "最終結果へ") {
      fetchGeneralFeedback();
    } else {
      setSkipModalOpen(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "auto",
        mt: 1,
        gap: "20%",
        justifyContent: "center",
        mb: "68px",
      }}
    >
      <Button
        onClick={() => setInterruptModalOpen(true)}
        variant="contained"
        sx={{
          backgroundColor: theme.palette.secondary.light,
          color: "white",
          minWidth: "120px",
          width: "42%",
          height: 42,
          fontSize: 18,
        }}
      >
        中断
      </Button>
      <Button
        onClick={handleClick}
        variant="contained"
        sx={{
          backgroundColor:
            buttonDisplay === "次へ"
              ? theme.palette.primary.light
              : theme.palette.secondary.light,
          color: "white",
          minWidth: "150px",
          width: "42%",
          height: 42,
          fontSize: 18,
        }}
      >
        {buttonDisplay}
      </Button>
    </Box>
  );
};

export default ActionButtons;
