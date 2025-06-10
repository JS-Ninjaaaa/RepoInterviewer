import { useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Footer from "@/screens/general-feedback-screen/components/Footer";
import ScoreDisplay from "@/screens/general-feedback-screen/components/ScoreDisplay";

interface GeneralFeedbackScreenProps {
  vscode: VSCodeAPI;
}

const GeneralFeedbackScreen = ({ vscode }: GeneralFeedbackScreenProps) => {
  const location = useLocation();

  const { currentCharacter, payload } = location.state;
  const { generalReview, scores } = payload;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: currentCharacter?.color[50],
        minHeight: "100vh",
        minWidth: "320px",
      }}
    >
      <ScoreDisplay currentCharacter={currentCharacter} scores={scores} />

      <Box
        sx={{
          display: "flex",
          gap: "5%",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <img src={currentCharacter.wholeImage} height="260px" />
        <Box
          sx={{
            bgcolor: "white",
            minHeight: "220px",
            minWidth: "180px",
            width: "60%",
            border: "1px solid",
            borderColor: currentCharacter.color[300],
            borderRadius: 2,
            fontSize: 20,
            p: 2,
            mb: "30px",
          }}
        >
          <Typography
            sx={{
              whiteSpace: "pre-wrap",
            }}
          >
            {generalReview}
          </Typography>
        </Box>
      </Box>

      <Footer vscode={vscode} currentCharacter={currentCharacter} />
    </Box>
  );
};

export default GeneralFeedbackScreen;
