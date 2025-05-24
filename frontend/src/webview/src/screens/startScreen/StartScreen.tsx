import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, ThemeProvider } from "@mui/material";
import { characters } from "../../data/characters";
import { theme } from "../../theme";

import type { apiRequestValue } from "../../types/apiRequestValue";
import CharacterSelectCards from "./components/CharacterSelectCards";

interface StartScreenProps {
  vscode: VSCodeAPI;
}

declare global {
  interface VSCodeAPI {
    postMessage: (msg: apiRequestValue) => void;
    getState: () => unknown;
    setState: (data: unknown) => void;
  }
  function acquireVsCodeApi(): VSCodeAPI;
}

const StartScreen: React.FC<StartScreenProps> = ({ vscode }) => {
  const [characterIndex, setCharacterIndex] = useState(0);
  const currentCharacter = characters[characterIndex];

  const navigate = useNavigate();

  const handleStartInterview = () => {
    const msg: apiRequestValue = {
      type: 'fetchFirstQuestion',
      payload: {
        difficulty: currentCharacter.level,
        total_question: currentCharacter.totalQuestion
      }
    };
    vscode.postMessage(msg);
  };

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (type === 'firstQuestion') {
        navigate('/answer', {
          state: {
            interview_id: payload.interview_id,
            question: payload.question,
            currentCharacter  // ← ここには必ず最新の currentCharacter が入る
          }
        });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [currentCharacter, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: currentCharacter.color[100],
          height: "100vh",
          minWidth: "320px",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mt: "20%" }}>
          面接官選択
        </Typography>

        <CharacterSelectCards
          selectingCharacter={{ characterIndex, setCharacterIndex }}
        />

        <Button
          onClick={handleStartInterview}
          variant="contained"
          sx={{
            mb: "80px",
            backgroundColor: currentCharacter.color[700],
            color: "white",
            width: "30%",
            minWidth: "160px",
            height: 48,
            fontSize: 18,
          }}
        >
          面接開始
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default StartScreen;
