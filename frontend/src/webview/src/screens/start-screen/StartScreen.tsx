import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { Character } from "@/types/character";
import { useLoading } from "@/screens/context/LoadingContext";

import type { VscodeApiRequestValue } from "@shared/vscode-api-request-value";
import CharacterSelectCards from "@/screens/start-screen/components/CharacterSelectCards";
import Header from "@/screens/start-screen/components/Header";

interface StartScreenProps {
  vscode: VSCodeAPI;
  characters: Character[];
}

declare global {
  interface VSCodeAPI {
    postMessage: (msg: VscodeApiRequestValue) => void;
    getState: () => unknown;
    setState: (data: unknown) => void;
  }
  function acquireVsCodeApi(): VSCodeAPI;
}

const StartScreen = ({ vscode, characters }: StartScreenProps) => {
  const { showLoading, hideLoading } = useLoading();
  const [characterIndex, setCharacterIndex] = useState(0);
  const currentCharacter = characters[characterIndex];

  const navigate = useNavigate();

  const handleStartInterview = () => {
    showLoading("質問を生成中・・・");
    const msg: VscodeApiRequestValue = {
      type: "fetchFirstQuestion",
      payload: {
        difficulty: currentCharacter.level,
        totalQuestion: currentCharacter.totalQuestion,
      },
    };
    vscode.postMessage(msg);
  };

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (type === "firstQuestion") {
        hideLoading();
        navigate("/answer", {
          state: {
            interviewId: payload.interviewId,
            question: payload.question,
            currentCharacter,
          },
        });
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [currentCharacter, navigate, hideLoading]);

  return (
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
      <Header currentCharacter={currentCharacter} />

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mt: "20%",
        }}
      >
        面接官選択
      </Typography>

      <CharacterSelectCards
        characters={characters}
        selectingCharacter={{
          characterIndex,
          setCharacterIndex,
        }}
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
  );
};

export default StartScreen;
