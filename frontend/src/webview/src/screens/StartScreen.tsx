import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, IconButton, Button, ThemeProvider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { characters } from '../data/characters';
import { theme } from '../theme';

import { message } from '../types/message';

interface StartScreenProps {
  vscode: VSCodeAPI;
}

declare global {
  interface VSCodeAPI {
  postMessage: (msg: message) => void;
  getState: () => unknown;
  setState: (data: unknown) => void;
}
  function acquireVsCodeApi(): VSCodeAPI;
}

const StartScreen: React.FC<StartScreenProps> = ({ vscode }) => {
// const StartScreen = () => {

  const [characterIndex, setcharacterIndex] = useState(0);
  const current = characters[characterIndex];

  const handleNext = () => {
    setcharacterIndex((prev) => (prev + 1) % characters.length);
  };

  const handlePrev = () => {
    setcharacterIndex((prev) => (prev - 1 + characters.length) % characters.length);
  };
  const navigate = useNavigate();

  const fetchfirstQuestion = () => {
    const message: message = { type: 'fetchfirstQuestion', payload: { difficulty: "hard", question_id: 5 }}
    vscode.postMessage(message)
    }

  window.addEventListener("message", (event) => {
    const { type, payload } = event.data;
    if (type === "firstQuestion") {
      navigate('/answer', { state: payload }); // ← ページ遷移！
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
          backgroundColor: current.color[100],
          minHeight: '100vh',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", marginTop: 16, marginBottom: 8}} gutterBottom>
          面接官選択
        </Typography>

        <Box 
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: "10%",
          }}
        >
          <IconButton onClick={handlePrev}>
            <ArrowBackIcon />
          </IconButton>

          <Box
            sx={{
              p: 4,
              borderRadius: 1,
              width: 280,
              height: 180,
              backgroundColor: 'white',
              boxShadow: 3,
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <Box sx={{ alignItems: 'center', display: 'inline-flex', mb: 2 }}>
              <Avatar
                src={current.image}
                alt={current.name}
                sx={{ width: 84, height: 84, mr: 3 }}
              />
              <Box sx={{ ml: 4 }}> 
                <Typography variant="subtitle1" sx={{ fontSize: 32, mb: 0 }}>
                  {current.name}
                </Typography>
                <Typography variant="body2" sx={{ color: current.color[900], fontWeight: "bold" }}>
                  {current.level}
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ backgroundColor: current.color[200], mb: 1, fontWeight: 700 }}>
              {current.title}
            </Typography>

            {current.quotes.map((q, i) => (
            <Typography key={i} variant="caption" display="block">
              「{q}」
            </Typography>
          ))}
          </Box>

          <IconButton onClick={handleNext}>
            <ArrowForwardIcon />
          </IconButton>
        </Box>
        <Button 
          onClick={fetchfirstQuestion} 
          variant='contained' 
          sx={{ backgroundColor: current.color[700], color: "white", mt: 12, width: "30%", height: 48, fontSize:18  }}
        >
          面接開始
        </Button> 
      </Box>
    </ThemeProvider>
  );
};

export default StartScreen;
