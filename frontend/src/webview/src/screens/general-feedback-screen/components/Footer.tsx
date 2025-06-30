import { Box, IconButton } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ReplayIcon from "@mui/icons-material/Replay";
import XIcon from "@mui/icons-material/X";
import { useNavigate } from "react-router-dom";

interface Props {
  vscode: VSCodeAPI;
}

const Footer = ({ vscode }: Props) => {
  const navigate = useNavigate();

  const moveFirstScreen = () => navigate("/title");
  const closeWebview = () => vscode.postMessage({ type: "closeWebview" });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        px: 3,
      }}
    >
      <IconButton onClick={closeWebview}>
        <ExitToAppIcon
          sx={{
            fontSize: "36px",
            color: (theme) => theme.palette.secondary.light,
          }}
        />
      </IconButton>

      <IconButton
        component="a"
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          "RepoInterviewer で技術面接に挑戦した！"
        )}&hashtags=RepoInterviewer`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          bgcolor: (theme) => theme.palette.secondary.main,
          "&:hover": { bgcolor: (theme) => theme.palette.shadowColor },
          borderRadius: 1,
          p: 1.2,
          width: "36px",
          height: "36px",
        }}
      >
        <XIcon sx={{ fontSize: 20, color: "#fff" }} />
      </IconButton>

      {/* Retry → Webview 終了（例として）*/}
      <IconButton onClick={moveFirstScreen}>
        <ReplayIcon
          sx={{
            fontSize: "36px",
            color: (theme) => theme.palette.secondary.dark,
          }}
        />
      </IconButton>
    </Box>
  );
};

export default Footer;