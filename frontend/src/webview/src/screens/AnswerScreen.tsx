import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, ThemeProvider, Avatar, Modal } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { theme } from '../theme';
import type { Message } from '../types/messages';

interface StartScreenProps {
  vscode: VSCodeAPI;
}

const AnswerScreen: React.FC<StartScreenProps>  = ({ vscode }) => {
  
  const location = useLocation();
  const charadata = location.state.charadata;
  const interview_id = location.state.interview_id;

  const [chatHistory, setChatHistory] = useState<string[]> ([location.state.question]);  // 初期値は一問目
  const [chatInput, setChatInput] = useState<string>('');
  const [questionId, setQuestionId] = useState<number>(1);
  const [buttonDisplay, setButtonDisplay] = useState<string>('スキップ');
  const navigate = useNavigate();

  const [interruptModalOpen, setInterruptModalOpen] = useState(false);
  const [skipModalOpen, setSkipModalOpen] = useState(false);

  const handleInterrrupt = () => {
    navigate('/');
  };

  const handleSkip = () => {
    setSkipModalOpen(false);
    handleNext();
  };

  const handleSubmit = () => {
    setChatHistory([...chatHistory, chatInput]);
    
    setButtonDisplay('次へ');

    // フィードバッグを要求するAPI
    const message: Message = { type: 'fetchFeedBack', payload: { interview_id: interview_id, question_id: questionId, answer: chatInput }};
    vscode.postMessage(message);

    setChatInput('');
  };

  const handleNext = () => {
    // 次の質問を要求するAPI
    const nextId = questionId + 1;
    setQuestionId(prev => prev + 1); // カウントを1増やす
    const message: Message = { type: 'fetchNextQuestion', payload: { interview_id: interview_id, question_id: nextId, }};
    vscode.postMessage(message);
  };

  // APIに対する応答を取得する
  
  const handleMessage = (event: MessageEvent) => {
    const { type, payload } = event.data;

    if (type === 'FeedBack') {
      setChatHistory(prev => [...prev, payload.feedback]);
    } else if (type === 'nextQuestion') {
      setChatHistory([payload.question]);
      setButtonDisplay('スキップ'); // ← 状態リセット
    } else {
      console.log('その他のメッセージ', payload);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);



  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: charadata?.color[50],
          minHeight: '100vh',
          minWidth: '320px'
        }}
      >
          <Box sx={{ mt: '6%', backgroundColor: charadata?.color[400], textAlign: 'right', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', minWidth: '120px', width: '30%', height: 42, fontSize:18  }}>
              <Typography sx={{ fontSize: 24, fontWeight: 'bold' }}>{questionId} of {charadata?.total_question}</Typography>
          </Box>

        <Box
          sx={{
            border: 2,
            borderColor: charadata.color[200],
            backgroundColor: 'white',
            width: '76%',
            height: '68vh',
            mt: '5%',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            p: 3,
          }}
        >
          {/* チャット履歴 */}
          <Box>
            {chatHistory.map((text, index) => (
              <Box key={index} sx={{ my: 4 }}>
                {index % 2 === 0 ? (
                  // 偶数：AI側
                  <Box>
                    <Avatar
                      src={charadata?.image}
                      alt={charadata?.name}
                      sx={{ width: 56, height: 56, m: 1 }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: 16, bgcolor: charadata.color[50], p: 2, borderRadius: 2  }}>{text}</Typography>
                    </Box>
                  </Box>
                ) : (
                  // 奇数：ユーザー側
                  <Typography variant='body2' sx={{ my: 4, fontSize: 16 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }}>
                      <Avatar
                      alt={charadata?.name}
                      sx={{ width: 52, height: 52, m: 2 }}
                      /> 
                    </Box>
                    <Box sx={{ bgcolor: charadata.color[50], p: 2, borderRadius: 2 }}>{text}</Box>
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          {/* 解答欄 */}
          <Box 
            component='textarea'
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            sx={{
              minHeight: '24vh',
              border: '1px solid',
              borderColor: charadata.color[200],
              borderRadius: 2,
              fontSize: 20,
              mb: 2,
              p: 2,
              '&:focus': {
                borderColor: charadata.color[200],
                outline: 'none',     
              }
            }}
          />
          <Box sx={{ textAlign: 'right' }}>
            <Button onClick={handleSubmit}>
              <SendIcon sx={{ cursor: 'pointer', borderRadius: 2, bgcolor: charadata?.color[200], color: 'white',  py: 1, px: 2, fontSize: '28px', boxShadow: 3 }} />
            </Button>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          width: 'auto',
          mt: '7%',
          gap: '20%',justifyContent: 'center'
        }}>
          <Button onClick={() => setInterruptModalOpen(true)}  variant='contained' sx={{ backgroundColor: theme.palette.secondary.light, color: 'white', minWidth: '120px', width: '42%', height: 42, fontSize:18  }}>
            中断
          </Button>
          <Modal
            open={interruptModalOpen}
            onClick={handleSkip}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'white',
                borderRadius: 2,
                minWidth: '200px',
                width: '55%',
                maxWidth: '400px',
                textAlign: 'center',
                p: 6 }}
              >
                <Typography id='modal-modal-title' variant='h6' component='h2'>
                  本当に中断しますか？
                <Box sx={{
                  display: 'flex',
                  width: 'auto',
                  mt: '7%',
                  gap: '10%',
                  justifyContent: 'center',
                }}>
                  <Button onClick={() => setInterruptModalOpen(false)} variant='contained' sx={{ backgroundColor: theme.palette.primary.light, color: 'white', minWidth: '80px', height: 42, fontSize:16  }}>
                    いいえ
                  </Button>
                  <Button onClick={handleInterrrupt} variant='contained' sx={{ backgroundColor: theme.palette.secondary.light, color: 'white', minWidth: '80px', height: 42, fontSize:16 }}>
                    中断
                  </Button>
                </Box>
              </Typography>
              </Box>
            </Box>
          </Modal>
          <Button onClick={buttonDisplay === '次へ' ? handleNext : () => setSkipModalOpen(true)}
            variant='contained' sx={{ 
              backgroundColor: buttonDisplay === '次へ'? theme.palette.primary.light : theme.palette.secondary.light, 
              color: 'white', 
              minWidth: '120px', 
              width: '42%', 
              height: 42, 
              fontSize:18  
            }}>
            {buttonDisplay}
          </Button>
          <Modal
            open={skipModalOpen}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'white',
                borderRadius: 2,
                minWidth: '200px',
                width: '55%',
                maxWidth: '400px',
                textAlign: 'center',
                p: 6 }}
              >
                <Typography id='modal-modal-title' variant='h6' component='h2'>
                  本当にスキップしますか？
                  この問題は0点になります
                <Box sx={{
                  display: 'flex',
                  width: 'auto',
                  mt: '7%',
                  gap: '10%',
                  justifyContent: 'center'
                }}>
                  <Button onClick={() => setSkipModalOpen(false)} variant='contained' sx={{ backgroundColor: theme.palette.primary.light, color: 'white', minWidth: '100px',  height: 42, fontSize:16  }}>
                    いいえ
                  </Button>
                  <Button onClick={handleSkip} variant='contained' sx={{ backgroundColor: theme.palette.secondary.light, color: 'white', minWidth: '100px',  height: 42, fontSize:16  }}>
                    スキップ
                  </Button>
                </Box>
              </Typography>
              </Box>
            </Box>
          </Modal>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AnswerScreen;