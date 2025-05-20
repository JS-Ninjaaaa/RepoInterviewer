import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, ThemeProvider, Avatar, Modal, Paper } from '@mui/material';
import XIcon from '@mui/icons-material/X';
import { theme } from '../theme';
import { characters } from '../data/characters';


interface GeneralFeedBackScreenProps {
  vscode: VSCodeAPI;
}
const charadata = characters[0];
const score = 88;
const FinelFeedBackScreen: React.FC<GeneralFeedBackScreenProps> = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: charadata?.color[50],
        minHeight: '100vh',
        minWidth: '320px'
      }}
      >
        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', mt: '20%' }} >
          最終結果
        </Typography>
      
      <Box sx={{ 
        display: 'flex',
        alignItems: 'baseline',
        color: charadata.color[700],
        p: 0
        }}>
          <Typography variant='h5' sx={{ fontSize: 76, lineHeight: 1 }}>{score}</Typography>
          <Typography sx={{ fontSize: '32px' }}>点</Typography>
      </Box>
      <Box>
        <Typography sx={{ color: charadata.color[700] }}>16 / 20 / 12 / 11 / 18</Typography>
      </Box>
      <Box sx={{ 
        display: 'flex',
        gap: '5%',
        width: '100%',
        justifyContent: 'center', }}
      >
        <img src={charadata.wholeImage} height='220px' />
        <Box 
        sx={{
            bgcolor: 'white',
            minHeight: '24vh',
            height: '220px',
            minWidth: '180px',
            width: '60%',
            border: '1px solid',
            borderColor: charadata.color[200],
            borderRadius: 2,
            fontSize: 20,
            '&:focus': {
            borderColor: charadata.color[200],
            outline: 'none',     
            }
        }}
        />
      </Box>
      <Box sx={{
        display: 'flex',
        width: '100%',
        gap: '5%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <XIcon sx={{ bgcolor: 'black', color: 'white', p: 1,   borderRadius: 1, fontSize: '18px' }} />
        <Typography>SNSでシェアしよう ! </Typography>
      </Box>
      
      <Box sx={{
        display: 'flex',
        gap: '20%',
        justifyContent: 'center',
        alignItems: 'baseline',
        my: '10%',
      }}>
        <Button variant='contained' sx={{ backgroundColor: charadata.color[400], color: 'white', minWidth: '100px', height: '36px',width: '80%', fontSize:14 }}>
          終了
        </Button>
        <Button variant='contained' sx={{ backgroundColor: theme.palette.primary.light, color: 'white', minWidth: '100px', height: '36px', fontSize:14  }}>
          リトライ
        </Button>
      </Box>
    </Box>
  );
};

export default FinelFeedBackScreen