import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';

import StartScreen from './screens/StartScreen';
import AnswerScreen from './screens/AnswerScreen';

const vscode = typeof acquireVsCodeApi === 'function'
  ? acquireVsCodeApi()
  : {
      postMessage: () => {},
      getState: () => undefined,
      setState: () => {},
    };

function AppRoutes() {

  return (
    <ThemeProvider theme={theme}>
        <MemoryRouter>
          <Routes>
            <Route path='/' element={<StartScreen vscode={vscode}/>} />
            <Route path='/answer' element={<AnswerScreen vscode={vscode}/>} />
          </Routes>
        </MemoryRouter>
    </ThemeProvider>
  );
}

export default AppRoutes;
