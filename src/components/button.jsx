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
  marginRight,
  paddingLeft,
  paddingRight,
  backgroundColor,
  hoverColor,
  width,
}) {
  return (
    <Button
      variant="contained"
      startIcon={startIcon}
      sx={{
        width: width,
        fontFamily: "Nunito",
        fontWeight: "500",
        height: { height },
        marginTop: { marginTop },
        marginBottom: {
          marginBottom,
        },
        marginRight: { marginRight },
        paddingLeft: { paddingLeft },
        paddingRight: { paddingRight },
        borderRadius: "10px",
        color: Colors.WHITE,
        backgroundColor: backgroundColor,
        textTransform: "none",
        "&:hover": {
          background: hoverColor || Colors.SKY_BLUE,
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
