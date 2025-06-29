import { Modal, Box, Typography, Button } from "@mui/material";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";

const SkipModal: React.FC = () => {
  const { skipModalOpen, handleSkipModalClose, handleSkipConfirm } =
    useAnswerContext();

  return (
    <Modal
      open={skipModalOpen}
      onClose={handleSkipModalClose}
      aria-labelledby="skip-modal-title"
      aria-describedby="skip-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: 2,
          p: 6,
          maxWidth: "400px",
          width: "80%",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            color: "black",
            mb: 4,
          }}
        >
          本当にスキップしますか？ この問題は0点になります
        </Typography>
        <Box
          sx={{ display: "flex", justifyContent: "center", gap: "40px", mt: 2 }}
        >
          <Button
            variant="contained"
            onClick={handleSkipModalClose}
            sx={{
              minWidth: "80px",
              backgroundColor: (theme) => theme.palette.primary.contrastText,
              color: "white",
            }}
          >
            いいえ
          </Button>
          <Button
            variant="contained"
            onClick={handleSkipConfirm}
            sx={{
              minWidth: "80px",
              backgroundColor: (theme) => theme.palette.secondary.main,
              color: "white",
            }}
          >
            スキップ
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SkipModal;
