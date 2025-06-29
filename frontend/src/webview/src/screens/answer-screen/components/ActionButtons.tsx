import { Box, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";

const ActionButtons: React.FC = () => {
  const { topButtonState, setInterruptModalOpen, handleNextClick } =
    useAnswerContext();

  return (
    <Box
      sx={{
        position: "relative",
        height: "90px",
        width: "100%",
        backgroundColor: (theme) => theme.palette.background.paper,
        boxShadow: (theme) =>
          theme.palette.mode === "light"
            ? `0px 2px 4px ${theme.palette.shadowColor}`
            : "none",
      }}
    >
      <IconButton
        onClick={() => setInterruptModalOpen(true)}
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: "16px",
          color: (theme) => theme.palette.secondary.light,
        }}
      >
        <HomeIcon sx={{ fontSize: "42px" }} />
      </IconButton>
      {topButtonState === "skip" && (
        <IconButton
          onClick={handleNextClick}
          sx={{
            position: "absolute",
            right: "16px",
            color: (theme) => theme.palette.secondary.dark,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <SkipNextIcon sx={{ fontSize: 50 }} />
        </IconButton>
      )}
    </Box>
  );
};

export default ActionButtons;
