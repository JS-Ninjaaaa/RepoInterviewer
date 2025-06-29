import React from "react";
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

const CommonThemeButton: React.FC<ButtonProps> = ({ sx, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        background: (theme) => theme.gradients.secondary.main,
        color: "#fff",
        textTransform: "none",
        borderRadius: "8px",
        "&:hover": {
          background: (theme) => theme.gradients.secondary.light,
        },
        ...sx,
      }}
    >
      {props.children}
    </Button>
  );
};

export default CommonThemeButton;
