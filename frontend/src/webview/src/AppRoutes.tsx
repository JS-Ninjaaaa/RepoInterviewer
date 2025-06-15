import { useState, useEffect } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme";
import { createCharacters } from "@/data/characters";
import type { Character } from "@/types/character";
import { ImageUri } from "@shared/uri";

import StartScreen from "@/screens/start-screen/StartScreen";
import AnswerScreen from "@/screens/answer-screen/AnswerScreen";
import GeneralFeedbackScreen from "@/screens/general-feedback-screen/GeneralFeedbackScreen";
import { LoadingProvider, useLoading } from "@/screens/context/LoadingContext";
import { LoadingOverlay } from "@/screens/components/LoadingOverlay";

declare global {
  interface Window {
    imageUris?: ImageUri;
  }
}

const vscode =
  typeof acquireVsCodeApi === "function"
    ? acquireVsCodeApi()
    : {
        postMessage: () => {},
        getState: () => undefined,
        setState: () => {},
      };

interface AppContentProps {
  characters: Character[];
}

const AppContent: React.FC<AppContentProps> = ({ characters }) => {
  const { loading, message } = useLoading();

  return (
    <>
      <LoadingOverlay open={loading} message={message} />
      <MemoryRouter initialEntries={["/start"]}>
        <Routes>
          <Route
            path="/start"
            element={<StartScreen vscode={vscode} characters={characters} />}
          />
          <Route path="/answer" element={<AnswerScreen vscode={vscode} />} />
          <Route
            path="/feedback"
            element={<GeneralFeedbackScreen vscode={vscode} />}
          />
        </Routes>
      </MemoryRouter>
    </>
  );
};

const AppRoutes: React.FC = () => {
  const [characters, setCharacters] = useState<Character[] | null>(null);

  useEffect(() => {
    const data = window.imageUris;
    if (!data) {
      return;
    }

    setCharacters(createCharacters(data));
  }, []);

  if (characters === null) {
    return <div>読み込み中…</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <LoadingProvider>
        <AppContent characters={characters} />
      </LoadingProvider>
    </ThemeProvider>
  );
};

export default AppRoutes;
