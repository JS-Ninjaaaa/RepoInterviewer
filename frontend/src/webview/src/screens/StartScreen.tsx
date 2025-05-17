import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { characters } from '../data/characters';

// interface StartScreenProps {
//   vscode: VSCodeAPI;
// }

// declare global {
//   interface VSCodeAPI {
//   postMessage: (msg: { type: string; payload?: unknown }) => void;
//   getState: () => unknown;
//   setState: (data: unknown) => void;
// }
//   function acquireVsCodeApi(): VSCodeAPI;
// }


// const StartScreen: React.FC<StartScreenProps> = () => {
const StartScreen = () => {

  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.type === "init") {
        setImageSrc(message.imageUri);
      }
    });
  }, []);

  const [index, setIndex] = useState(0);
  const current = characters[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % characters.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + characters.length) % characters.length);
  };

  // const handleClick = () => {
  //   vscode.postMessage({ type: 'hello', payload: 'こんにちは！' });
  // };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4,
      }}
    >
      <Typography variant="h5" fontWeight="bold" marginTop={8} marginBottom={8} gutterBottom>
        キャラ選択
      </Typography>

      <Box display="flex" alignItems="center" justifyContent="center">
        <IconButton onClick={handlePrev}>
          <ArrowBackIcon />
        </IconButton>

        <Box
          border={1}
          borderRadius={2}
          p={2}
          minWidth={100}
          textAlign="center"
        >
          <Avatar
            src={imageSrc}
            alt={current.name}
            sx={{ width: 60, height: 60, margin: '0 auto', mb: 1 }}
          />
          <Typography variant="subtitle1" fontWeight="bold">
            {current.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            {current.level}
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
    </Box>
  );
};

export default StartScreen;
