import { Box, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useAnswerContext } from "@/screens/answerScreen/context/useAnswerCOntext";

const AnswerInput: React.FC = () => {
  const {
    chatInput,
    setChatInput,
    fetchFeedback,
    displayEnterBox,
    currentCharacter,
  } = useAnswerContext();

  if (!displayEnterBox) return null;

  return (
    <>
      <Box
        component="textarea"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        sx={{
          height: "100%",
          minHeight: "80px",
          border: "1px solid",
          borderColor: currentCharacter.color[200],
          borderRadius: 2,
          fontSize: 20,
          mb: 2,
          mt: 4,
          p: 2,
          "&:focus": {
            outline: "none"
          }
        }}
      />
      <Box sx={{ textAlign: "right" }}>
        <Button onClick={fetchFeedback}>
          <SendIcon
            sx={{
              cursor: "pointer",
              borderRadius: 2,
              bgcolor: currentCharacter.color[400],
              color: "white",
              py: 1,
              px: 2,
              fontSize: "28px",
              boxShadow: 3
            }}
          />
        </Button>
      </Box>
    </>
  );
};

export default AnswerInput;