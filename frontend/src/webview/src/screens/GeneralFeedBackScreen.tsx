import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import XIcon from '@mui/icons-material/X';
import { theme } from '../theme';


interface GeneralFeedbackScreenProps {
  vscode: VSCodeAPI;
}

const FinelFeedBackScreen: React.FC<GeneralFeedbackScreenProps> = ({ vscode }) => {
  const location = useLocation();
  
  const currentCharacter = location.state.currentCharacter;
  const generalFeedback = location.state.payload.gneralFeedback;
  const scores = location.state.payload.scores;

  let totalScore: number = 0;
  for (let i = 0; i < scores.length; i++) {
    totalScore += scores[i];
  };

  const navigate = useNavigate()

  const moveFirstScreen = () => {
    navigate('/')
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: currentCharacter?.color[50],
        minHeight: '100vh',
        minWidth: '320px'
      }}
      >
        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', mt: '16%' }} >
          最終結果
        </Typography>
      
      <Box sx={{ 
        display: 'flex',
        alignItems: 'baseline',
        color: currentCharacter.color[700],
        p: 0
        }}>
          <Typography sx={{ fontSize: 76, lineHeight: 1 }}>{totalScore}</Typography>
          <Typography sx={{ fontSize: '32px' }}>点</Typography>
      </Box>
      <Box>
        <Typography sx={{ color: currentCharacter.color[700] }}>{scores.join(' / ')}</Typography>
      </Box>
      <Box sx={{ 
        display: 'flex',
        gap: '5%',
        width: '100%',
        justifyContent: 'center', }}
      >
        <img src={currentCharacter.wholeImage} height='260px' />
        <Box 
        sx={{
            bgcolor: 'white',
            minHeight: '220px',
            minWidth: '180px',
            width: '60%',
            border: '1px solid',
            borderColor: currentCharacter.color[300],
            borderRadius: 2,
            fontSize: 20,
            p: 2,
            mb: '60px',
        }}
        >
          <Typography sx={{ }}>
            {generalFeedback}
          </Typography>
        </Box>
      </Box>
      <Box sx={{
        display: 'flex',
        width: '100%',
        gap: '5%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <XIcon sx={{ bgcolor: 'black', color: 'white', p: 1,   borderRadius: 1, fontSize: '18px' }} />
        <Typography>SNSで結果をシェアしよう ! </Typography>
      </Box>
      
      <Box sx={{
        display: 'flex',
        gap: '30%',
        justifyContent: 'center',
        alignItems: 'baseline',
        mb: '68px',
      }}>
        <Button onClick={() => vscode.postMessage({ type: 'closeWebview' })} variant='contained' sx={{ backgroundColor: theme.palette.secondary.light, color: 'white', minWidth: '120px', height: '36px',width: '80%', fontSize:16 }}>
          終了
        </Button>
        <Button onClick={moveFirstScreen} variant='contained' sx={{ backgroundColor: currentCharacter.color[400], color: 'white', minWidth: '120px', height: '36px', fontSize: 16 }}>
          リトライ
        </Button>
      </Box>
    </Box>
  );
};

export default FinelFeedBackScreen