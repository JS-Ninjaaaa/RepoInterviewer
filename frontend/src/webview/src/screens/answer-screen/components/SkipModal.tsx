import { Modal, Box, Typography, Button } from "@mui/material";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";

const SkipModal: React.FC = () => {
  const { skipModalOpen, setSkipModalOpen, fetchFeedback } = useAnswerContext();

  const handleClose = () => setSkipModalOpen(false);
  const handleConfirm = () => {
    setSkipModalOpen(false);
    // 0点で次へ進む処理
    fetchFeedback();
  };

  return (
    <Modal
      open={skipModalOpen}
      onClose={handleClose}
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
          p: 4,
          maxWidth: "400px",
          width: "80%",
          textAlign: "center",
        }}
      >
        <Typography id="skip-modal-title" variant="h6" gutterBottom>
          本当にスキップしますか？ この問題は0点になります
        </Typography>
        <Box
          sx={{ display: "flex", justifyContent: "center", gap: "40px", mt: 2 }}
        >
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              minWidth: "80px",
              backgroundColor: (theme) => theme.palette.primary.light,
              color: "white",
            }}
          >
            いいえ
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            sx={{
              minWidth: "80px",
              backgroundColor: (theme) => theme.palette.secondary.light,
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
