import { useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Footer from "@/screens/general-feedback-screen/components/Footer";
import ScoreDisplay from "@/screens/general-feedback-screen/components/ScoreDisplay";
import FeedbackBox from "./components/Feedbackbox";

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
        backgroundColor: (theme) => theme.palette.background.default,
        minHeight: "100vh",
        pt: 12,
        pb: 2,
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: "bold", color: "#fff" }}>
        RESULT
      </Typography>

      <ScoreDisplay currentCharacter={currentCharacter} scores={scores} />

      <FeedbackBox generalReview={generalReview} />

      <Footer vscode={vscode} />
    </Box>
  );
};

export default GeneralFeedbackScreen;
