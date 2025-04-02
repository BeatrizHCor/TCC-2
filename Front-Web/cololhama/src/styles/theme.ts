import { createTheme, PaletteOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    customColors?: {
      darkGray: string;
      LighterGray: string;
      lightGray: string;
      softPink: string;
    };
  }
  interface PaletteOptions {
    customColors?: {
      darkGray: string;
      LighterGray: string;
      lightGray: string;
      softPink: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#72383d", // Cor personalizada para o botão
    },
    secondary: {
      main: "#322d29",
    },
    background: {
      default: "#ffffff", // Fundo branco global
    },
    info: {
        main: "##83876f", // esverdeado
      },
  
    
      customColors: {
        darkGray: "#424242",
        LighterGray: "#d9d9d9",
        lightGray: "#eff0ed",
        softPink: "#d2a1a2",
      },
    },
  });
  
  export default theme;