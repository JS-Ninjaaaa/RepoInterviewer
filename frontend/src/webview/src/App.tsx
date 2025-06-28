import { useState, useEffect, useMemo } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { baseTheme } from "@/theme";
import { createCharacters } from "@/data/create-characters";
import type { Character } from "@/types/character";
import { ImageUri } from "@shared/uri";
import TitleScreen from "@/screens/title-screen/TitleScreen";
import CharacterSelectScreen from "@/screens/character-select-screen/CharacterSelectScreen";
import AnswerScreen from "@/screens/answer-screen/AnswerScreen";
import GeneralFeedbackScreen from "@/screens/general-feedback-screen/GeneralFeedbackScreen";
import { LoadingProvider, useLoading } from "@/screens/context/LoadingContext";
import { LoadingOverlay } from "@/screens/components/LoadingOverlay";
import ModeToggleButton from "@/components/ModeToggleButton";

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
      <ModeToggleButton />
      <MemoryRouter initialEntries={["/title"]}>
        <Routes>
          <Route path="/title" element={<TitleScreen />} />
          <Route
            path="/start"
            element={
              <CharacterSelectScreen vscode={vscode} characters={characters} />
            }
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

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[] | null>(null);
  const [mode, setMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const data = window.imageUris;
    if (!data) {
      return;
    }

    setCharacters(createCharacters(data));
  }, []);

  useEffect(() => {
    const toLight = () => setMode("light");
    const toDark = () => setMode("dark");
    window.addEventListener("set-light-mode", toLight);
    window.addEventListener("set-dark-mode", toDark);
    return () => {
      window.removeEventListener("set-light-mode", toLight);
      window.removeEventListener("set-dark-mode", toDark);
    };
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          mode: mode,
          background: {
            default: mode === "dark" ? "#0f1121" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#ffffff" : "#000000",
            secondary: mode === "dark" ? "#000000" : "#ffffff",
          },
        },
      }),
    [mode]
  );

  if (characters === null) {
    return <div>読み込み中…</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingProvider>
        <AppContent characters={characters} />
      </LoadingProvider>
    </ThemeProvider>
  );
};

export default App;
