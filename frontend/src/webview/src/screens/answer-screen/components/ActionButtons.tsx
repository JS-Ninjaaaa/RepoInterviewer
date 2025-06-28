import { Box, IconButton, useTheme } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
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
        bgcolor: "#1c2a42",
        boxShadow: 1,
      }}
    >
      <IconButton 
        onClick={() => setInterruptModalOpen(true)} 
        sx={{
          position: "absolute",
          top: "50%",     
          transform: "translateY(-50%)",
          left: "16px",
          color: "#00c853",
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
            color: "#3877ff",
            top: "50%",     
            transform: "translateY(-50%)",
          }}
        >
          <SkipNextIcon sx={{ fontSize:50 }} />
        </IconButton>
      )}
    </Box>
  );
};

export default ActionButtons;
