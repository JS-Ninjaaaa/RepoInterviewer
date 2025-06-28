import React from "react";
import { Button, useTheme } from "@mui/material";
import type { ButtonProps } from "@mui/material";

const CommonThemeButton: React.FC<ButtonProps> = (props) => {
  const theme = useTheme();

  return (
    <Button
      {...props}
      sx={{
        background: theme.gradients.secondary.main,
        color: "#fff",
        textTransform: "none",
        borderRadius: "8px",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0px 6px 16px rgba(255, 255, 255, 0.24)"
            : "0px 6px 16px rgba(0, 0, 0, 0.15)",
        "&:hover": {
          background: theme.gradients.secondary.light,
        },
        ...((props.sx as object) || {}),
      }}
    >
      {props.children}
    </Button>
  );
};

export default CommonThemeButton;
