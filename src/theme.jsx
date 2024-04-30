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
      main: Colors.SKYBLUE,
      light: Colors.SKYBLUE,
    },
    secondary: {
      main: Colors.SKYBLUE,
      light: Colors.SKYBLUE,
    },
    Supportive: {
      main: Colors.SKYBLUE,
      light: Colors.SKYBLUE,
    },
  },
  text: {
    fontFamily: "Nunito",
    color: Colors.SKYBLUE,
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
