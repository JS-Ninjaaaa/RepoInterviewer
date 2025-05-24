import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";

import StartScreen from "./screens/startScreen/StartScreen";
import AnswerScreen from "./screens/AnswerScreen";
import GeneralFeedbackScreen from "./screens/GeneralFeedbackScreen";
import { LoadingProvider, useLoading } from "./screens/context/LoadingContext";
import { LoadingOverlay } from "./screens/components/LoadingOverlay";

const vscode =
  typeof acquireVsCodeApi === "function"
    ? acquireVsCodeApi()
    : {
        postMessage: () => {},
        getState: () => undefined,
        setState: () => {},
      };

const AppContent: React.FC = () => {
  const { loading, message } = useLoading();

  return (
    <>
      <LoadingOverlay open={loading} message={message} />
      <MemoryRouter initialEntries={["/start"]}>
        <Routes>
          <Route path="/start" element={<StartScreen vscode={vscode} />} />
          <Route path="/answer" element={<AnswerScreen vscode={vscode} />} />
          <Route
            path="/feedback"
            element={<GeneralFeedbackScreen vscode={vscode} />}
          />
        </Routes>
      </MemoryRouter>
    </>
  );
}

const AppRoutes: React.FC = () => (
  <ThemeProvider theme={theme}>
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  </ThemeProvider>
);

export default AppRoutes;
