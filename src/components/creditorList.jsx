import React from "react";
import { Grid, Typography } from "@mui/material";
import { Colors } from "../config/default";

export default function CreditorList() {
  return (
    <Grid
      container
      xs={12}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Nunito",
          color: Colors.SKY_BLUE,
          fontWeight: "600",
          fontSize: "3rem",
        }}
      >
        Coming Soon
      </Typography>
    </Grid>
  );
}
