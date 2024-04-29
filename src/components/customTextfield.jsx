import * as React from "react";
import { Typography, Box } from "@mui/material";
import { Colors } from "../config/default";

export default function CustomTextField({ label, placeHolderValue }) {
  return (
    <Box>
      <Typography
        sx={{
          fontWeight: "500",
          fontFamily: "Nunito",
          marginLeft: "1rem",
          color: Colors.DARK_GRAY,
        }}
      >
        {label}
      </Typography>
      <input
        type="text"
        placeholder={placeHolderValue}
        style={{
          backgroundColor: Colors.BG_LIGHT_GRAY,
          height: "2.5rem",
          color: Colors.DIM_LIGHT_GRAY,
          paddingLeft: "1rem",
          border: "none",
          outline: "none",
          borderRadius: "5px",
        }}
      />
    </Box>
  );
}
