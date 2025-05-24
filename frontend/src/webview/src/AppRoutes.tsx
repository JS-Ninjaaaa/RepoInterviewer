import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";

import StartScreen from "./screens/startScreen/StartScreen";
import AnswerScreen from "./screens/AnswerScreen";
import GeneralFeedbackScreen from "./screens/GeneralFeedbackScreen";

const vscode =
  typeof acquireVsCodeApi === "function"
    ? acquireVsCodeApi()
    : {
        postMessage: () => {},
        getState: () => undefined,
        setState: () => {},
      };

function AppRoutes() {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default AppRoutes;
