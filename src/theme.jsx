import { createTheme } from "@mui/material/styles";
import { Colors } from "../src/config/default";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1380,
      xl: 2200,
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: Colors.DARKBLUE,
      light: Colors.BG_BLACK,
    },
    secondary: {
      main: Colors.DEEPBLUE,
      light: Colors.TOURQUISE,
    },
    Supportive: {
      main: Colors.LIGHTGREY,
      light: Colors.MUSTARD,
    },
  },
  text: {
    fontFamily: "Outfit Variable",
    color: Colors.WHITE,
  },
  typography: {
    h1: {
      // fontFamily: "Outfit Variable",
      fontSize: "1.7rem",
      fontWeight: 300,
      color: Colors.WHITE,
    },
  },

  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "white",
          border: "1px solid black",
          color: "black",
        },
      },
    },
  },
});

export default theme;
