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
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: currentCharacter?.color[50],
          height: "100vh",
          minWidth: "320px",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            border: 2,
            borderColor: currentCharacter.color[200],
            backgroundColor: "white",
            width: "76%",
            height: "68vh",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            p: 3,
            mt: "80px",
          }}
        >
          <ChatPanel />
          <AnswerInput />
        </Box>

        <ActionButtons />
        <InterruptModal />
        <SkipModal />
      </Box>
    </AnswerContextProvider>
  );
};

export default AnswerScreen;
