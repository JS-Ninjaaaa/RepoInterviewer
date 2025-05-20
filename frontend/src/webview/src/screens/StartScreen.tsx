import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, IconButton, Button, ThemeProvider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { characters } from '../data/characters';
import { theme } from '../theme';

import type { Message } from '../types/messages';

interface StartScreenProps {
  vscode: VSCodeAPI;
}

declare global {
  interface VSCodeAPI {
  postMessage: (msg: Message) => void;
  getState: () => unknown;
  setState: (data: unknown) => void;
}
  function acquireVsCodeApi(): VSCodeAPI;
}

const StartScreen: React.FC<StartScreenProps> = ({ vscode }) => {
// const StartScreen = () => {

  const [index, setIndex] = useState(0);
  const charadata = characters[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % characters.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + characters.length) % characters.length);
  };
  const navigate = useNavigate();

  
  const handleStart = () => {
    const message: Message = { type: 'fetchfirstQuestion', payload: { difficulty: charadata.level, total_question: charadata.total_question }};
    vscode.postMessage(message);
  };

  const fetchfirstQuestion = (event: MessageEvent) => {
    const { type, payload } = event.data;
    if (type === 'firstQuestion') {
      console.log(type, payload);
      navigate('/answer', {
      state: {
        ...payload,
        charadata: charadata  // charadataは選択中のキャラクター情報
      }
      });
    } else {
      console.log(type, payload);
    }
  };

  window.addEventListener('message', fetchfirstQuestion);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
          backgroundColor: charadata.color[100],
          minHeight: '100vh',
          minWidth: '320px'
        }}
      >
        <Typography variant='h5' sx={{ fontWeight: 'bold', mt: '10%', marginBottom: 8}} >
          面接官選択
        </Typography>

        <Box 
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: '10%',
            width: '100%',
          }}
        >
          <IconButton onClick={handlePrev}>
            <ArrowBackIcon />
          </IconButton>

          <Box
            sx={{
              p: 4,
              borderRadius: 1,
              width: '100%',
              minWidth: '220px',
              maxWidth: '320px',
              height: 160,
              backgroundColor: 'white',
              boxShadow: 3,
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <Box sx={{ alignItems: 'center', display: 'inline-flex', mb: 2 }}>
              <Avatar
                src={charadata.image}
                alt={charadata.name}
                sx={{ width: 84, height: 84, mr: 3 }}
              />
              <Box sx={{ ml: 4 }}> 
                <Typography variant='subtitle1' sx={{ fontSize: 32, mb: 0 }}>
                  {charadata.name}
                </Typography>
                <Typography variant='body2' sx={{ color: charadata.color[900], fontWeight: 'bold' }}>
                  {charadata.level}
                </Typography>
              </Box>
            </Box>
            
            <Typography variant='body2' sx={{ backgroundColor: charadata.color[200], mb: 1, fontWeight: 700 }}>
              {charadata.title}
            </Typography>

            {charadata.quotes.map((q, i) => (
            <Typography key={i} variant='caption' display='block'>
              「{q}」
            </Typography>
          ))}
          </Box>

          <IconButton onClick={handleNext}>
            <ArrowForwardIcon />
          </IconButton>
        </Box>
        
        <Button 
          onClick={handleStart} 
          variant='contained' 
          sx={{ backgroundColor: charadata.color[700], color: 'white', mt: 12, width: '30%', minWidth: '160px', height: 48, fontSize:18  }}
        >
          面接開始
        </Button> 
      </Box>
    </ThemeProvider>
  );
};

export default StartScreen;
