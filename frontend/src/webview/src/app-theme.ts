import { createTheme } from "@mui/material";
import type { PaletteMode } from "@mui/material";

import "@mui/material/styles";
declare module "@mui/material/styles" {
  interface Palette {
    shadowColor: string;
  }
  interface PaletteOptions {
    shadowColor?: string;
  }
  interface Theme {
    gradients: {
      primary: string;
      secondary: {
        main: string;
        light: string;
      };
    };
  }
  interface ThemeOptions {
    gradients?: {
      primary?: string;
      secondary?: {
        main?: string;
        light?: string;
      };
    };
  }
}

export const baseTheme = createTheme({
  palette: {
    primary: {
      light: "#939393",
      main: "#1c2a42",
      dark: "#162032",
      contrastText: "#b8b8b8",
    },
    secondary: {
      light: "#00c853",
      main: "#3877ff",
      dark: "#772feb",
      contrastText: "#939393",
    },
    shadowColor: "rgba(0, 0, 0, 0.15)",
  },
  gradients: {
    primary: "linear-gradient(90deg, #00c853, #3877ff, #772feb)",
    secondary: {
      main: "linear-gradient(90deg, #00c853, #3877ff)",
      light: "linear-gradient(90deg, #45fa91, #588fff)",
    },
  },
});

export const createAppTheme = (mode: PaletteMode) =>
  createTheme({
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      mode,
      background: {
        default: mode === "dark" ? "#0f1121" : "#ffffff",
        paper: mode === "dark" ? "#1c2a42" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : "#000000",
        secondary: mode === "dark" ? "#000000" : "#ffffff",
        disabled: mode === "dark" ? "#ffffff" : "#7c7c7c",
      },
      shadowColor:
        mode === "dark"
          ? "rgba(255, 255, 255, 0.24)"
          : baseTheme.palette.shadowColor,
    },
    gradients: baseTheme.gradients,
  });
