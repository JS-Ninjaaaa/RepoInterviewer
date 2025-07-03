import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, IconButton, useTheme } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useLoading } from "@/screens/context/LoadingContext";
import type { Character } from "@/types/character";
import type { VscodeApiRequestValue } from "@shared/vscode-api-request-value";

import CharacterSelectCards from "./components/CharacterSelectCards";
import CommonThemeButton from "../components/CommonThemeButton";

interface Props {
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

const CharacterSelectScreen: React.FC<Props> = ({ vscode, characters }) => {
  const location = useLocation();
  const { selectedFiles = [] } =
    (location.state as { selectedFiles?: string[] }) || {};

  const [characterIndex, setCharacterIndex] = useState(0);
  const currentCharacter = characters[characterIndex];
  const theme = useTheme();
  const textColor = theme.palette.text.primary;
  const bgUrl =
    theme.palette.mode === "dark"
      ? currentCharacter.darkBackground
      : currentCharacter.lightBackground;

  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const handlePrev = () =>
    setCharacterIndex((i) => (i - 1 + characters.length) % characters.length);
  const handleNext = () =>
    setCharacterIndex((i) => (i + 1) % characters.length);

  const handleStartInterview = () => {
    showLoading("質問を生成中…");
    console.log(selectedFiles);
    console.log("These are selected files", selectedFiles);
    const msg: VscodeApiRequestValue = {
      type: "fetchFirstQuestion",
      payload: {
        difficulty: currentCharacter.level,
        totalQuestion: currentCharacter.totalQuestion,
        selectedFiles,
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
    <>
      <Box
        sx={{
          backgroundImage: `url(${bgUrl})`,
          position: "absolute",
          left: 0,
          width: "100%",
          height: "100vh",
          objectFit: "cover",
          zIndex: -1,
        }}
      />

      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: textColor,
        }}
      >
        <Box sx={{ display: "flex" }}>
          <IconButton onClick={handlePrev} sx={{ color: "#00c853" }}>
            <ArrowLeftIcon sx={{ ml: -2, mr: -2, fontSize: 64 }} />
          </IconButton>

          <CharacterSelectCards currentCharacter={currentCharacter} />

          <IconButton onClick={handleNext} sx={{ color: "#3877ff" }}>
            <ArrowRightIcon sx={{ ml: -2, mr: -2, fontSize: 64 }} />
          </IconButton>
        </Box>

        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <CommonThemeButton onClick={handleStartInterview}>
            START INTERVIEW
          </CommonThemeButton>
        </Box>
      </Box>
    </>
  );
};

export default CharacterSelectScreen;
