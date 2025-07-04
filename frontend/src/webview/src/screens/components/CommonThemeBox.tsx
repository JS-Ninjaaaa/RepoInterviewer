import React from "react";
import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";

const CommonThemeBox: React.FC<BoxProps> = ({ sx, ...props }) => {
  return (
    <Box
      {...props}
      sx={{
        position: "relative",
        borderRadius: 2,
        p: 2,
        bgcolor: (theme) => theme.palette.background.default,
        overflow: "hidden",
        width: "80%",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          padding: "1px",
          borderRadius: 2,
          background: (theme) => theme.gradients.secondary.main,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, \
            linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        },
        ...sx,
      }}
    >
      {props.children}
    </Box>
  );
};

export default CommonThemeBox;
