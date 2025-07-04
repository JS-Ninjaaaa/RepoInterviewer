import "@mui/material/styles";
declare module "@mui/material/styles" {
  interface Palette {
    shadowColor: string;
  }
  interface PaletteOptions {
    shadowColor?: string;
    background?: Partial<TypeBackground>;
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
  interface TypeBackground {
    nav: string;
    reverse: string;
  }
}
