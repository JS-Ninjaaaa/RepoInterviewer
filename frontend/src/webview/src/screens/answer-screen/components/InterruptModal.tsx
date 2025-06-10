import { Modal, Box, Typography, Button } from "@mui/material";
import { useAnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";
const InterruptModal: React.FC = () => {
  const {
    interruptModalOpen,
    handleInterruptConfirm,
    handleInterruptModalClose,
  } = useAnswerContext();

  return (
    <Modal
      open={interruptModalOpen}
      onClose={handleInterruptModalClose}
      aria-labelledby="interrupt-modal-title"
      aria-describedby="interrupt-modal-description"
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
        <Typography id="interrupt-modal-title" variant="h6" gutterBottom>
          本当に中断しますか？
        </Typography>
        <Box
          sx={{ display: "flex", justifyContent: "center", gap: "20px", mt: 2 }}
        >
          <Button
            variant="contained"
            onClick={handleInterruptModalClose}
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
            onClick={handleInterruptConfirm}
            sx={{
              minWidth: "80px",
              backgroundColor: (theme) => theme.palette.secondary.light,
              color: "white",
            }}
          >
            中断
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default InterruptModal;
