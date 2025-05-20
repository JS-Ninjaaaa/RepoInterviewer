import { useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, ThemeProvider, Avatar, Modal } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { theme } from '../theme';
import type { Message } from '../types/messages';

interface AnswerScreenProps {
  vscode: VSCodeAPI;
}

const AnswerScreen: React.FC<AnswerScreenProps>  = ({ vscode }) => {
// const AnswerScreen = () => {
  
  const location = useLocation();
  const charadata = location.state.charadata;
  const interview_id = location.state.interview_id;

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [chatHistory, setChatHistory] = useState<string[]> ([location.state.question]);  // 初期値は一問目
  const [chatInput, setChatInput] = useState<string>('');
  const [questionId, setQuestionId] = useState<number>(1);
  const [buttonDisplay, setButtonDisplay] = useState<string>('スキップ');
  const [displayEnterBox, setDisplayEnterBox] = useState<boolean>(true);
  const [scrollTop, setScrollTop] = useState<boolean>(true);
  // const [score, setScore] = useState<string>();
  
  const [interruptModalOpen, setInterruptModalOpen] = useState(false);
  const [skipModalOpen, setSkipModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleInterrrupt = () => {
    navigate('/');
  };

  const handleSkip = () => {
    setSkipModalOpen(false);
    handleNext();
  };

  const handleSubmit = () => {
    setChatHistory([...chatHistory, chatInput]);
    setDisplayEnterBox(false);
    setScrollTop(false);

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

  const moveGeneralFeedBackScreen = (payload: {'scores': number[], 'GeneralFeedBack_review': string}) => {
    // GeneralFeedBackを受け取る関数
    navigate('/GeneralFeedBack', {
      state: {
        ...payload,
        charadata: charadata  
      }
    })
  }

  const fetchGeneralFeedBack = () => {
    // 総評を要求するAPI
    const message: Message = { type: 'fetchGeneralFeedBack', payload: { interview_id: interview_id }};
    vscode.postMessage(message);
  };

  // APIに対する応答を取得する
  const handleMessage = (event: MessageEvent) => {
    const { type, payload } = event.data;

    if (type === 'FeedBack') {
      if (questionId === (charadata?.total_question)) {
      setButtonDisplay('最終結果へ')
      } else {
        setButtonDisplay('次へ')
      };
      setChatHistory(prev => [...prev, payload.feedback]);
    } else if (type === 'nextQuestion') {
      setChatHistory(prev => [...prev, payload.question]);
      setButtonDisplay('スキップ'); 
      setDisplayEnterBox(true);
    } else if (type === 'fetchGeneralFeedBack') {
      moveGeneralFeedBackScreen(payload)
    }
    else {
      console.log('その他のメッセージ', payload);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // チャット履歴が更新されたとき、末尾にスクロール
  useEffect(() => {
    // 一問目の時だけスクロールしない
     if (scrollTop) {
      return;
    } else {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    };
  }, [chatHistory]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: charadata?.color[50],
          minHeight: '100vh',
          minWidth: '320px',
          justifyContent: 'space-between',
        }}
      >

        <Box
          sx={{
            border: 2,
            borderColor: charadata.color[200],
            backgroundColor: 'white',
            width: '76%',
            height: '68vh',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            p: 3,
            
          }}
        >
          {/* チャット履歴 */}
          <Box>
            {chatHistory.map((text, index) => (
              <Box key={index}>
                {index === chatHistory.length - 1 ? (<Box ref={bottomRef} sx={{ mt: '2px' }} />) : null} 
                {index % 3 === 0 ? (
                  // 質問
                  <Box sx={{ my: '2px' }}>
                    <Box sx={{
                      display: 'flex',
                      width: 'auto',
                      mt: '7%',
                      gap: '5%',
                      justifyContent: 'left',
                      alignItems: 'center',
                    }}>
                      <Avatar
                        src={charadata?.image}
                        alt={charadata?.name}
                        sx={{ width: 56, height: 56, m: 2 }}
                      />
                      <Box sx={{ mt: '2px', backgroundColor: charadata?.color[400], textAlign: 'right', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', minWidth: '120px', width: '24%', height: '36px' }}>
                        <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}> {Math.floor(index / 3) + 1} of {charadata?.total_question}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: 16, bgcolor: charadata.color[50], p: 2, borderRadius: 2  }}>{text}</Typography>
                    </Box>
                  </Box>
                ) : index % 3 === 1 ? (
                  // 奇数：ユーザー側
                  <Box sx={{ my: '2px', width: '100%' }}>
                    {/* アバターを右に寄せる */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                      <Avatar
                        alt={charadata?.name}
                        sx={{ width: 56, height: 56, m: 2 }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', width: '100%' }}>
                      <Box sx={{ bgcolor: charadata.color[50], p: 2, borderRadius: 2, width: '100%' }}>
                        <Typography sx={{ fontSize: 16 }}>
                          {text}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  // フィードバック
                  <Box sx={{ my: '2px' }}>
                    <Avatar
                      src={charadata?.image}
                      alt={charadata?.name}
                      sx={{ width: 56, height: 56, m: 2 }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: 16, bgcolor: charadata.color[50], p: 2, borderRadius: 2  }}>{text}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          {/* 解答欄 */}
          
            {displayEnterBox ? (
              <>
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
                    mt: 4,
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
              </>
            ) : null}
          
        </Box>

        <Box sx={{
          display: 'flex',
          width: 'auto',
          mt: '7%',
          gap: '20%',
          justifyContent: 'center'
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
                </Typography>
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
              </Box>
            </Box>
          </Modal>
          <Button onClick={() => {
            if (buttonDisplay === '次へ') {
                 handleNext();
            } else if (buttonDisplay === '最終結果へ') {
              moveGeneralFeedBackScreen({'scores': [20, 18], 'GeneralFeedBack_review': '最終フィードバッグ'});
              fetchGeneralFeedBack();
            } else {
              setSkipModalOpen(true)
            }
          }}
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
                  justifyContent: 'center',
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