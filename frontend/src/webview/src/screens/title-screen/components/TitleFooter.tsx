import { Button, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StartButton = styled(Button)({
  background: "linear-gradient(90deg, #00c853, #4f84f7)",
  color: "#fff",
  textTransform: "none",
  padding: "12px 48px",
  borderRadius: 24,
  fontWeight: "bold",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
  "&:hover": {
    background: "linear-gradient(90deg, #00e676, #588fff)",
  },
});

const TitleFooter = () => {
  const navigate = useNavigate();
  return (
    <>
      <StartButton
        size="large"
        onClick={() => navigate("/start")}
        sx={{ mb: 2 }}
        disableElevation
      >
        ▶ START APP
      </StartButton>

      <Typography variant="caption" color="grey.600">
        💡 Make sure your repository is open in VSCode
      </Typography>
    </>
  );
};

export default TitleFooter;
