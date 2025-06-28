import { Box, IconButton, useTheme } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ModeToggleButton = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "fixed",
        top: 22,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      <IconButton
        size="large"
        onClick={() =>
          theme.palette.mode === "dark"
            ? (window.dispatchEvent(
                new CustomEvent("set-light-mode")
              ) as unknown)
            : (window.dispatchEvent(
                new CustomEvent("set-dark-mode")
              ) as unknown)
        }
        sx={{
          color:
            theme.palette.mode === "dark" ? "#fff" : theme.palette.text.primary,
        }}
      >
        {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Box>
  );
};

export default ModeToggleButton;
