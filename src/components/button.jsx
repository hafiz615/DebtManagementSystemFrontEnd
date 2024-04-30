import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { Colors } from "../config/default";
function TextButton({
  buttonText,
  onClick,
  disabled,
  loading,
  marginTop,
  height,
  startIcon,
  marginBottom,
}) {
  return (
    <Button
      variant="contained"
      startIcon={startIcon}
      sx={{
        fontFamily: "Nunito",
        fontWeight: "500",
        height: { height },
        marginTop: { marginTop },
        marginBottom: {
          marginBottom,
        },
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
