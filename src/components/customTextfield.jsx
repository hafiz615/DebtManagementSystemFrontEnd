import * as React from "react";
import { Typography, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../config/default";

export default function CustomTextField({ label, placeHolderValue, width }) {
  const smallScreen = useMediaQuery("(min-width:300px) and (max-width:760px)");

  const largeScreen = useMediaQuery(
    "(min-width:1600px) and (max-width:3000px)"
  );

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
          width: width
            ? width
            : smallScreen
            ? "22rem "
            : largeScreen
            ? "20rem"
            : "",
          marginBottom: smallScreen ? "0.5rem" : "0.7rem",
        }}
      />
    </Box>
  );
}
