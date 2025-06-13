import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import XIcon from "@mui/icons-material/X";
import { theme } from "@/theme";
import { Character } from "@/types/character";

interface FooterProps {
  vscode: VSCodeAPI;
  currentCharacter: Character;
}

const Footer = ({ vscode, currentCharacter }: FooterProps) => {
  const navigate = useNavigate();

  const moveFirstScreen = () => {
    navigate("/start");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          gap: "5%",
          justifyContent: "center",
          alignItems: "center",
          mb: "30px",
        }}
      >
        <Box
          component="a"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `${currentCharacter.name}から技術面接フィードバックをもらった！`
          )}&hashtags=RepoInterviewer`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block" }}
        >
          <XIcon
            sx={{
              bgcolor: "black",
              color: "white",
              p: 1,
              borderRadius: 1,
              fontSize: "18px",
            }}
          />
        </Box>
        <Typography>SNSで結果をシェアしよう !</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: "30%",
          justifyContent: "center",
          alignItems: "baseline",
          mb: "68px",
        }}
      >
        <Button
          onClick={() => vscode.postMessage({ type: "closeWebview" })}
          variant="contained"
          sx={{
            backgroundColor: theme.palette.secondary.light,
            color: "white",
            minWidth: "120px",
            height: "36px",
            width: "80%",
            fontSize: 16,
          }}
        >
          終了
        </Button>
        <Button
          onClick={moveFirstScreen}
          variant="contained"
          sx={{
            backgroundColor: currentCharacter.color[400],
            color: "white",
            minWidth: "120px",
            height: "36px",
            fontSize: 16,
          }}
        >
          リトライ
        </Button>
      </Box>
    </>
  );
};

export default Footer;
