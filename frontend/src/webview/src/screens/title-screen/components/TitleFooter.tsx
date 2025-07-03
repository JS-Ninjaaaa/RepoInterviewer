import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CommonThemeButton from "@/screens/components/CommonThemeButton";

const TitleFooter = () => {
  const navigate = useNavigate();
  return (
    <>
      <CommonThemeButton
        size="large"
        onClick={() => navigate("/select")}
        sx={{
          mb: 2,
          padding: "12px 48px",
          fontWeight: "bold",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0px 6px 16px rgba(255, 255, 255, 0.24)"
              : "0px 6px 16px rgba(0, 0, 0, 0.15)",
        }}
        disableElevation
      >
        ▶ START APP
      </CommonThemeButton>

      <Typography
        sx={{
          color: (theme) => theme.palette.primary.light,
          fontSize: "16px",
        }}
      >
        💡 Make sure your repository is open in VSCode
      </Typography>
    </>
  );
};

export default TitleFooter;
