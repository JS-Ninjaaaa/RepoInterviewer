import { Box, Typography, Avatar } from "@mui/material";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";
import { useRef, useEffect } from "react";

const ChatPanel: React.FC = () => {
  const { chatHistory, currentCharacter, questionId, scrollTop } =
    useAnswerContext();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollTop) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, scrollTop]);

  return (
    <Box>
      {chatHistory.map((msg, index) => (
        <Box key={index}>
          {index === chatHistory.length - 1 && (
            <Box
              ref={bottomRef}
              sx={{
                mt: 2,
              }}
            />
          )}

          {msg.type === "question" && (
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
                  src={currentCharacter.image}
                  alt={currentCharacter.name}
                  sx={{
                    width: 56,
                    height: 56,
                    m: 2,
                  }}
                />
                <Box
                  sx={{
                    backgroundColor: currentCharacter.color[400],
                    textAlign: "right",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    minWidth: "120px",
                    width: "24%",
                    height: "36px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    {`${questionId} of ${currentCharacter.totalQuestion}`}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    fontSize: 16,
                    bgcolor: currentCharacter.color[50],
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            </Box>
          )}

          {msg.type === "answer" && (
            <Box sx={{ my: 2, width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Avatar
                  alt={currentCharacter.name}
                  sx={{
                    width: 56,
                    height: 56,
                    m: 2,
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", width: "100%" }}>
                <Box
                  sx={{
                    bgcolor: currentCharacter.color[50],
                    p: 2,
                    borderRadius: 2,
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontSize: 16 }}>{msg.text}</Typography>
                </Box>
              </Box>
            </Box>
          )}

          {msg.type === "feedback" && (
            <Box sx={{ my: 2 }}>
              <Avatar
                src={currentCharacter.image}
                alt={currentCharacter.name}
                sx={{ width: 56, height: 56, m: 2 }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  bgcolor: currentCharacter.color[50],
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    flexDirection: "row",
                    fontSize: "36px",
                    color: currentCharacter.color[600],
                  }}
                >
                  {msg.score}
                  <Typography sx={{ fontSize: "24px" }}>点</Typography>
                </Typography>
                <Typography sx={{ fontSize: "16px", whiteSpace: "pre-wrap" }}>
                  {msg.text}
                </Typography>
              </Box>
            </Box>
          )}

          {msg.type === "thinking" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
              }}
            >
              <Avatar
                src={currentCharacter.image}
                alt={currentCharacter.name}
                sx={{ width: 56, height: 56, m: 2 }}
              />
              <Typography
                sx={{
                  width: "120px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "left",
                  borderRadius: 2,
                  bgcolor: currentCharacter.color[50],
                  p: 2,
                  fontSize: 16,
                  color: currentCharacter.color[700],
                }}
              >
                {msg.text}
              </Typography>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ChatPanel;
