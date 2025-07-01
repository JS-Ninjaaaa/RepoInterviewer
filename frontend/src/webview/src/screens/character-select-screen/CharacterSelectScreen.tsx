import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Button, useTheme } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
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
    <>
      <Box
        sx={{
          color: textColor,
          backgroundImage: `url(${bgUrl})`,
          width: "100%",
          maxHeight: "100vh",
          position: "absolute",
          left: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            height: "100vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 8,
            }}
          >
            <IconButton onClick={handlePrev} sx={{ color: "#00c853" }}>
              <ArrowLeftIcon
                sx={{
                  ml: "-16px", // アイコンの左右の余白を引っ込める
                  mr: "-16px",
                  fontSize: "64px",
                }}
              />
            </IconButton>

            <CharacterSelectCards currentCharacter={currentCharacter} />

            <IconButton onClick={handleNext} sx={{ color: "#3877ff" }}>
              <ArrowRightIcon
                sx={{
                  ml: "-16px",
                  mr: "-16px",
                  fontSize: "64px",
                }}
              />
            </IconButton>
          </Box>

          <Button
            variant="outlined"
            sx={{
              width: 160,
              color: "black",
              backgroundColor: "#d9d9d9",
              p: 1,
              my: 4,
            }}
          >
            <TextSnippetIcon />
            SELECT FILES
          </Button>
          <CommonThemeButton
            onClick={handleStartInterview}
            sx={{
              padding: "12px 48px",
              fontWeight: "bold",
              mb: 4,
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0px 6px 16px rgba(255, 255, 255, 0.24)"
                  : "0px 6px 16px rgba(0, 0, 0, 0.15)",
            }}
          >
            START INTERVIEW
          </CommonThemeButton>
        </Box>
      </Box>
    </>
  );
};

export default CharacterSelectScreen;
