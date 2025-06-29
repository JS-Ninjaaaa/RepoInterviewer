import { Box, IconButton, useTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ReplayIcon from "@mui/icons-material/Replay";
import XIcon from "@mui/icons-material/X";
import { useNavigate } from "react-router-dom";

interface Props {
  vscode: VSCodeAPI;
}

const Footer = ({ vscode }: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const moveFirstScreen = () => navigate("/start");
  const closeWebview = () => vscode.postMessage({ type: "closeWebview" });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        px: 3,
      }}
    >
      {/* Home → スタート画面 */}
      <IconButton onClick={moveFirstScreen}>
        <HomeIcon sx={{ fontSize: 32, color: theme.palette.secondary.light }} />
      </IconButton>

      {/* X (share) */}
      <IconButton
        component="a"
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          "RepoInterviewer で技術面接に挑戦した！"
        )}&hashtags=RepoInterviewer`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          bgcolor: "#000",
          "&:hover": { bgcolor: "#000" },
          borderRadius: 1,
          p: 1.2,
        }}
      >
        <XIcon sx={{ fontSize: 20, color: "#fff" }} />
      </IconButton>

      {/* Retry → Webview 終了（例として）*/}
      <IconButton onClick={closeWebview}>
        <ReplayIcon
          sx={{ fontSize: 32, color: theme.palette.secondary.main }}
        />
      </IconButton>
    </Box>
  );
};

export default Footer;
