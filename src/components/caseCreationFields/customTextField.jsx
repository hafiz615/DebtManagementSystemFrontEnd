import React from "react";
import { Grid } from "@mui/material";

export default function CustomTextField({ placeHolderValue, Width }) {
  return (
    <>
      <Grid container item xs={12}>
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
            width: Width,
          }}
        />
      </Grid>
    </>
  );
}
