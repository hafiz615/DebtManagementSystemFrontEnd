import React from "react";
import Button from "@mui/material/Button";
function TextButton({ buttonText, onClick, disabled }) {
  return (
    <Button
      variant="contained"
      sx={{
        mt: "2em",
        height: "3rem",
        borderRadius: "10px",
        color: "white",
        textTransform: "none",
        backgroundColor: "#323232",
        "&:hover": {
          background: "#323232",
          border: "none",
        },
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
    </Button>
  );
}

export default TextButton;
