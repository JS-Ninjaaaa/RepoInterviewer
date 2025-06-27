import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CommonButton from "@/screens/components/button";

const TitleFooter = () => {
  const navigate = useNavigate();
  return (
    <>
      <CommonButton
        size="large"
        onClick={() => navigate("/start")}
        sx={{ mb: 2 }}
        disableElevation
      >
        ▶ START APP
      </CommonButton>

      <Typography variant="caption" color="grey.600">
        💡 Make sure your repository is open in VSCode
      </Typography>
    </>
  );
};

export default TitleFooter;
