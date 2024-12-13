import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { Colors } from "../config/default";
import { FONT_SIZE_LARGE, FONT_SIZE_SMALL } from "../constants/appConstants";
function TextButton({
  fontColor,
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
  loginFont,
  boxShadow,
  marginLeft,
}) {
  return (
    <Button
      variant="contained"
      startIcon={startIcon}
      sx={{
        width: width,
        fontFamily: "Nunito",
        fontWeight: loginFont || "500",
        height: { height },
        boxShadow: boxShadow,
        marginTop: { marginTop },
        marginBottom: {
          marginBottom,
        },
        marginRight: { marginRight },
        marginLeft: { marginLeft },
        paddingLeft: { paddingLeft },
        paddingRight: { paddingRight },
        fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
        borderRadius: "10px",
        color: fontColor ? fontColor : Colors.WHITE,
        backgroundColor: backgroundColor,
        textTransform: "none",
        "&:hover": {
          background: hoverColor || Colors.SKY_BLUE,
          boxShadow: boxShadow,
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
