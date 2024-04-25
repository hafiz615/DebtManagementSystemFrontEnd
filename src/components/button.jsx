import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { Colors } from "../config/default";
function TextButton({ buttonText, onClick, disabled, loading }) {
  return (
    <Button
      variant="contained"
      sx={{
        fontFamily: "Nunito",
        fontWeight: "500",
        mt: "2em",
        height: "3rem",
        borderRadius: "10px",
        color: Colors.WHITE,
        backgroundColor: Colors.SKY_BLUE,
        textTransform: "none",
        "&:hover": {
          background: Colors.SKY_BLUE,
          border: "none",
        },
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? (
        <CircularProgress size={24} sx={{ color: Colors.WHITE }} />
      ) : (
        buttonText
      )}
    </Button>
  );
}

export default TextButton;
