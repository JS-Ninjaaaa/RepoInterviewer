import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  ThemeProvider,
  Avatar,
  Modal,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { theme } from "../theme";
import type { apiRequestValue } from "../types/apiRequestValue";
import type { FeedBackResponse } from '../types/apiResponseValue';
import type { chatMessage } from '../types/chatMessage';

interface AnswerScreenProps {
  vscode: VSCodeAPI;
}

const AnswerScreen: React.FC<AnswerScreenProps> = ({ vscode }) => {
  const location = useLocation();
  const currentCharacter = location.state.currentCharacter;
  const interviewId = location.state.interview_id;

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [chatHistory, setChatHistory] = useState<chatMessage[]> ([
    { type: 'question', text: location.state.question },
  ]); // 初期値は一問目
  const [chatInput, setChatInput] = useState<string>('');
  const [questionId, setQuestionId] = useState<number>(1);
  const [buttonDisplay, setButtonDisplay] = useState<string>("スキップ");
  const [displayEnterBox, setDisplayEnterBox] = useState<boolean>(true);
  const [scrollTop, setScrollTop] = useState<boolean>(true);

  const [interruptModalOpen, setInterruptModalOpen] = useState(false);
  const [skipModalOpen, setSkipModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleInterrruptInterview = () => {
    navigate('/start');
  };

  const handleQuestionSkip = () => {
    setSkipModalOpen(false);
    fetchFeedback(); // 0点を返される
  };

   // フィードバッグか，深堀かを判断する
  const judgeContinueSameQuestion = (payload: FeedBackResponse) => {
    const lastScore = payload.score;

    if (payload.continue_deep_question) { 
      // フィードバックは来ず、次の深掘り質問が返る
      setChatHistory((prev) => [
        ...prev,
        { type: 'question', text: payload.response }
      ]);
      setDisplayEnterBox(true);
    } else {
      // 深掘りフェーズ終了
      const total  = currentCharacter.totalQuestion;
      const lastId = payload.question_id;       

      setButtonDisplay(lastId >= total ? "最終結果へ" : "次へ");
            
      setChatHistory((prev) => [
      ...prev,
        {
          type: 'feedback',
          text: payload.response,
          score: lastScore   
        }
      ])
    }
  }

  const fetchFeedback = () => {
    setChatHistory([...chatHistory, { type: 'answer', text: chatInput }]);
    setDisplayEnterBox(false);
    setScrollTop(false);

    // フィードバッグを要求するAPI
    const message: apiRequestValue = {
      type: "fetchFeedback",
      payload: {
        interview_id: interviewId,
        question_id: questionId,
        answer: chatInput,
      },
    };
    vscode.postMessage(message);

    setChatInput("");
  };

  const fetchNextQuestion = () => {
    // 次の質問を要求するAPI
    const nextId = questionId + 1;
    const message: apiRequestValue = {
      type: "fetchNextQuestion",
      payload: { interview_id: interviewId, question_id: nextId },
    };
    vscode.postMessage(message);
  };

  const moveGeneralFeedbackScreen = (payload: apiRequestValue) => {
    // GeneralFeedbackを受け取る関数
    navigate("/feedback", {
      state: {
        payload,
        currentCharacter: currentCharacter,
      },
    });
  };

  const fetchGeneralFeedback = () => {
    // 総評を要求するAPI
    const message: apiRequestValue = {
      type: "fetchGeneralFeedback",
      payload: { interview_id: interviewId },
    };
    vscode.postMessage(message);
  };

  // extesnion.tsから送られるメッセージにより次の動作にハンドルする
  const hendleExtensionMassage = (event: MessageEvent) => {
    const { type, payload } = event.data;
    if (type === "Feedback") {
      judgeContinueSameQuestion(payload)
    } else if (type === 'nextQuestion') {

      setChatHistory(prev => [
        ...prev,
        { type: 'question', text: payload.question }
      ]);

      setQuestionId(payload.question_id);

      setButtonDisplay("スキップ");

      setDisplayEnterBox(true);
    } else if (type === "GeneralFeedback") {
      moveGeneralFeedbackScreen(payload);
    } else {
    }
  };

  useEffect(() => {
    window.addEventListener("message", hendleExtensionMassage);

    return () => {
      window.removeEventListener("message", hendleExtensionMassage);
    };
  }, []);

  // チャット履歴が更新されたとき、末尾にスクロール
  useEffect(() => {
    // 一問目の時だけスクロールしない
    if (scrollTop) {
      return;
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: currentCharacter?.color[50],
          height: "100vh",
          minWidth: "320px",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            border: 2,
            borderColor: currentCharacter.color[200],
            backgroundColor: "white",
            width: "76%",
            height: "68vh",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            p: 3,
            mt: "80px",
          }}
        >
          {/* チャット履歴 */}
          <Box>
            {chatHistory.map((msg, index) => (
              <Box key={index}>
                {index === chatHistory.length - 1 && <Box ref={bottomRef} sx={{ mt: 2 }} />}

                {msg.type === 'question' && (
                  <Box sx={{ my: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        width: "auto",
                        mt: 1,
                        gap: "5%",
                        justifyContent: "left",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        src={currentCharacter?.image}
                        alt={currentCharacter?.name}
                        sx={{ width: 56, height: 56, m: 2 }}
                      />
                      <Box sx={{
                        backgroundColor: currentCharacter?.color[400],
                        textAlign: 'right',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        minWidth: '120px',
                        width: '24%',
                        height: '36px'
                      }}>
                        <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
                          {`${questionId} of ${currentCharacter?.totalQuestion}`}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: 16, bgcolor: currentCharacter.color[50], p: 2, borderRadius: 2 }}>
                        {msg.text}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {msg.type === 'answer' && (
                  <Box sx={{ my: 2, width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                      <Avatar
                        alt={currentCharacter?.name}
                        sx={{ width: 56, height: 56, m: 2 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', width: '100%' }}>
                      <Box sx={{ bgcolor: currentCharacter.color[50], p: 2, borderRadius: 2, width: '100%' }}>
                        <Typography sx={{ fontSize: 16 }}>
                          {msg.text}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {msg.type === 'feedback' && (
                  <Box sx={{ my: 2 }}>
                    <Avatar
                      src={currentCharacter?.image}
                      alt={currentCharacter?.name}
                      sx={{ width: 56, height: 56, m: 2 }}
                    />
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      bgcolor: currentCharacter.color[50],
                      p: 2,
                      borderRadius: 2
                    }}>
                      <Typography sx={{
                        display: 'flex',
                        alignItems: 'baseline',
                        flexDirection: 'row',
                        fontSize: '36px',
                        color: currentCharacter.color[400]
                      }}>
                        {msg.score}
                        <Typography sx={{ fontSize: '24px' }}>点</Typography>
                      </Typography>
                      <Typography sx={{ fontSize: '16px' }}>
                        {msg.text}
                      </Typography>
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
                component="textarea"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                sx={{
                  height: "100%",
                  minHeight: "80px",
                  border: "1px solid",
                  maxLength: 300,
                  borderColor: currentCharacter.color[200],
                  borderRadius: 2,
                  fontSize: 20,
                  mb: 2,
                  mt: 4,
                  p: 2,
                  "&:focus": {
                    borderColor: currentCharacter.color[200],
                    outline: "none",
                  },
                }}
              />
              <Box sx={{ textAlign: "right" }}>
                <Button onClick={fetchFeedback}>
                  <SendIcon
                    sx={{
                      cursor: "pointer",
                      borderRadius: 2,
                      bgcolor: currentCharacter?.color[200],
                      color: "white",
                      py: 1,
                      px: 2,
                      fontSize: "28px",
                      boxShadow: 3,
                    }}
                  />
                </Button>
              </Box>
            </>
          ) : null}
        </Box>

        <Box
          sx={{
            display: "flex",
            width: "auto",
            mt: 1,
            gap: "20%",
            justifyContent: "center",
            mb: "68px",
          }}
        >
          <Button
            onClick={() => setInterruptModalOpen(true)}
            variant="contained"
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: "white",
              minWidth: "120px",
              width: "42%",
              height: 42,
              fontSize: 18,
            }}
          >
            中断
          </Button>
          <Modal
            open={interruptModalOpen}
            onClick={handleQuestionSkip}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "white",
                  borderRadius: 2,
                  minWidth: "200px",
                  width: "55%",
                  maxWidth: "400px",
                  textAlign: "center",
                  p: 6,
                }}
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  本当に中断しますか？
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    width: "auto",
                    mt: "7%",
                    gap: "10%",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    onClick={() => setInterruptModalOpen(false)}
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.primary.light,
                      color: "white",
                      minWidth: "80px",
                      height: 42,
                      fontSize: 16,
                    }}
                  >
                    いいえ
                  </Button>
                  <Button
                    onClick={handleInterrruptInterview}
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.secondary.light,
                      color: "white",
                      minWidth: "80px",
                      height: 42,
                      fontSize: 16,
                    }}
                  >
                    中断
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>
          <Button
            onClick={() => {
              if (buttonDisplay === "次へ") {
                fetchNextQuestion();
              } else if (buttonDisplay === "最終結果へ") {
                fetchGeneralFeedback();
              } else {
                setSkipModalOpen(true);
              }
            }}
            variant="contained"
            sx={{
              backgroundColor:
                buttonDisplay === "次へ"
                  ? theme.palette.primary.light
                  : theme.palette.secondary.light,
              color: "white",
              minWidth: "150px",
              width: "42%",
              height: 42,
              fontSize: 18,
            }}
          >
            {buttonDisplay}
          </Button>
          <Modal
            open={skipModalOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "white",
                  borderRadius: 2,
                  minWidth: "200px",
                  width: "55%",
                  maxWidth: "400px",
                  textAlign: "center",
                  p: 6,
                }}
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  本当にスキップしますか？ この問題は0点になります
                  <Box
                    sx={{
                      display: "flex",
                      width: "auto",
                      mt: "7%",
                      gap: "10%",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      onClick={() => setSkipModalOpen(false)}
                      variant="contained"
                      sx={{
                        backgroundColor: theme.palette.primary.light,
                        color: "white",
                        minWidth: "100px",
                        height: 42,
                        fontSize: 16,
                      }}
                    >
                      いいえ
                    </Button>
                    <Button
                      onClick={handleQuestionSkip}
                      variant="contained"
                      sx={{
                        backgroundColor: theme.palette.secondary.light,
                        color: "white",
                        minWidth: "100px",
                        height: 42,
                        fontSize: 16,
                      }}
                    >
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
