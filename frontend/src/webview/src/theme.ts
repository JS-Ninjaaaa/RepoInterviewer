import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    gradients: {
      primary: string;
      secondary: {
        main: string, light: string
      };
    };
  }
  interface ThemeOptions {
    gradients?: {
      primary?: string;
      secondary?: {
        main: string, light: string
      };
    }
  }
}

export const baseTheme = createTheme({
  palette: {
    primary: {
      light: "#73b4ff",
      main: "#4d93ff",
      dark: "#4561c8",
      contrastText: "#fff",
    },
    secondary: {
      light: "#fa8e8d",
      main: "#ff6161",
      dark: "#e54041",
      contrastText: "#000",
    },
  },

  gradients: {
    primary: "linear-gradient(90deg, #00c853, #3877ff, #772feb)",
    secondary: {
      main: "linear-gradient(90deg, #00c853, #3877ff)",
      light: "linear-gradient(90deg, #45fa91, #588fff)",
    }
  },
  
});
