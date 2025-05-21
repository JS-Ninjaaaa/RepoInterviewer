import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, IconButton, Button, ThemeProvider } from '@mui/material';
import { characters } from '../data/characters';
import { theme } from '../theme';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import type { apiRequestValue } from '../types/apiRequestValue';

interface StartScreenProps {
  vscode: VSCodeAPI;
}

declare global {
  interface VSCodeAPI {
  postMessage: (msg: apiRequestValue) => void;
  getState: () => unknown;
  setState: (data: unknown) => void;
}
  function acquireVsCodeApi(): VSCodeAPI;
}

const StartScreen: React.FC<StartScreenProps> = ({ vscode }) => {
// const StartScreen = () => {

  const [index, setIndex] = useState(0);
  const currentCharacter = characters[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % characters.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + characters.length) % characters.length);
  };
  const navigate = useNavigate();

  
  const handleStart = () => {
    const message: apiRequestValue = { type: 'fetchFirstQuestion', payload: { difficulty: currentCharacter.level, total_question: currentCharacter.total_question }};
    vscode.postMessage(message);
  };

  const fetchfirstQuestion = (event: MessageEvent) => {
    const { type, payload } = event.data;
    if (type === 'firstQuestion') {
      console.log(type, payload);
      navigate('/answer', {
      state: {
        ...payload,
        currentCharacter: currentCharacter  // currentCharacterは選択中のキャラクター情報
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
          backgroundColor: currentCharacter.color[100],
          height: '100vh',
          minWidth: '320px'
        }}
      >
        <Typography variant='h5' sx={{ fontWeight: 'bold', mt: '20%' }} >
          面接官選択
        </Typography>

        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '90%',
            mb: '100px'
          }}
        >
          <IconButton
            onClick={handlePrev}
            sx={{ mt: '60px', mx: 1, bgcolor: 'white', borderRadius: 5, width: '20px', height: '42px', boxShadow: 1, '&:hover': {
              background: '#e0e0e0'
            }, }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: '18px', fontWeight: 'bold' }} />
          </IconButton>

          <Box
            sx={{
              p: 4,
              borderRadius: 1,
              width: '90%',
              minWidth: '180px',
              maxWidth: '320px',
              maxHeight: '320px',
              backgroundColor: 'white',
              boxShadow: 3,
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              mt: '60px',
            }}
          >
            <Box sx={{ alignItems: 'center', display: 'inline-flex' }}>
              <Avatar
                src={currentCharacter.image}
                alt={currentCharacter.name}
                sx={{ width: 84, height: 84, mr: 3 }}
              />
              <Box sx={{ ml: 4 }}> 
                <Typography variant='subtitle1' sx={{ fontSize: 32, mb: 0 }}>
                  {currentCharacter.name}
                </Typography>
                <Typography variant='body2' sx={{ color: currentCharacter.color[900], fontWeight: 'bold' }}>
                  {currentCharacter.level}
                </Typography>
              </Box>
            </Box>
            
            <Typography variant='body2' sx={{ backgroundColor: currentCharacter.color[200], my: 2, fontWeight: 700 }}>
              {currentCharacter.title}
            </Typography>

            {currentCharacter.quotes.map((q, i) => (
            <Typography key={i} variant='caption' display='block' sx={{ fontSize: '14px' }}>
              「{q}」
            </Typography>
          ))}
          </Box>

          <IconButton
            onClick={handleNext}
            sx={{ mt: '60px', mx: 1, bgcolor: 'white', borderRadius: 5, width: '20px', height: '42px', boxShadow: 1, '&:hover': {
              background: '#e0e0e0'
            }, }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: '18px', fontWeight: 'bold' }} />
          </IconButton>
        </Box>
        
        <Button 
          onClick={handleStart} 
          variant='contained' 
          sx={{ mb: '80px', backgroundColor: currentCharacter.color[700], color: 'white', width: '30%', minWidth: '160px', height: 48, fontSize:18  }}
        >
          面接開始
        </Button> 
      </Box>
    </ThemeProvider>
  );
};

export default StartScreen;
