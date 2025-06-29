import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { AnswerContextProvider } from "@/screens/answer-screen/context/AnswerContextProvider";
import ChatPanel from "@/screens/answer-screen/components/chat-panel/ChatPanel";
import AnswerInput from "@/screens/answer-screen/components/AnswerInput";
import ActionButtons from "@/screens/answer-screen/components/ActionButtons";
import InterruptModal from "@/screens/answer-screen/components/InterruptModal";
import SkipModal from "@/screens/answer-screen/components/SkipModal";
import type { Character } from "@/types/character";

interface LocationState {
  currentCharacter: Character;
  interviewId: string;
  question: string;
}

interface AnswerScreenProps {
  vscode: VSCodeAPI;
}

const AnswerScreen: React.FC<AnswerScreenProps> = ({ vscode }) => {
  const location = useLocation();
  const { currentCharacter, interviewId, question } =
    location.state as LocationState;

  return (
    <AnswerContextProvider
      vscode={vscode}
      interviewId={interviewId}
      currentCharacter={currentCharacter}
      firstlQuestion={question}
    >
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "grid",
          gridTemplateRows: "auto minmax(0,1fr) auto",
          position: "absolute",
          left: 0,
        }}
      >
        <Box>
          <ActionButtons />
        </Box>
        <Box>
          <ChatPanel />
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <AnswerInput />
        </Box>
      </Box>
      <InterruptModal />
      <SkipModal />
    </AnswerContextProvider>
  );
};

export default AnswerScreen;
