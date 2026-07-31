import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#1565C0",      // IMD-inspired blue
    },

    secondary: {
      main: "#2E7D32",      // Green
    },

    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF",
    },

    success: {
      main: "#2E7D32",
    },

    warning: {
      main: "#ED6C02",
    },

    error: {
      main: "#D32F2F",
    }
  },

  typography: {

    fontFamily: [
      "Roboto",
      "Arial",
      "sans-serif"
    ].join(","),

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },

    body1: {
      fontSize: 14,
    }
  },

  shape: {
    borderRadius: 8,
  }
});

export default theme;
