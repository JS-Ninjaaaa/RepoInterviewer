import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CommonThemeButton from "@/screens/components/CommonThemeButton";

const TitleFooter = () => {
  const navigate = useNavigate();
  return (
    <>
      <CommonThemeButton
        size="large"
        onClick={() => navigate("/start")}
        sx={{ mb: 2 }}
        disableElevation
      >
        ▶ START APP
      </CommonThemeButton>

      <Typography variant="caption" color="grey.600">
        💡 Make sure your repository is open in VSCode
      </Typography>
    </>
  );
};

export default TitleFooter;
