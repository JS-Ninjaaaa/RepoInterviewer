import { Box, Button } from "@mui/material";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";

const ActionButtons: React.FC = () => {
  const { buttonDisplay, setInterruptModalOpen, handleNextClick } =
    useAnswerContext();

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
          backgroundColor: (theme) => theme.palette.secondary.light,
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
        onClick={handleNextClick}
        variant="contained"
        sx={{
          backgroundColor:
            buttonDisplay === "次へ"
              ? (theme) => theme.palette.primary.light
              : (theme) => theme.palette.secondary.light,
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
