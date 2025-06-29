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
  interface TypeBackground {
    nav: string;
  }
  interface PaletteOptions {
    background?: Partial<TypeBackground>;
  }
}