import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Footer from "@/screens/general-feedback-screen/components/Footer";
import FeedbackBox from "@/screens/general-feedback-screen/components/FeedbackBox";
import ScoreAndCharacter from "./components/ScoreAndCharacter";

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
        pb: 3,
      }}
    >
      <ScoreAndCharacter currentCharacter={currentCharacter} scores={scores} />

      <FeedbackBox generalReview={generalReview} />

      <Footer vscode={vscode} />
    </Box>
  );
};

export default GeneralFeedbackScreen;
