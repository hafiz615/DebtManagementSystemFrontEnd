import React from "react";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

import TextButton from "./button";
import CustomTextField from "./customTextfield";

function ModelInfo({ show }) {
  return (
    <Grid item xs={12} sx={{ paddingX: "1rem" }}>
      <Typography
        sx={{
          fontWeight: "600",
          fontFamily: "Nunito",
        }}
      >
        {show ? "Edit User" : "Add User"}
      </Typography>

      <Grid
        container
        item
        xs={12}
        sx={{
          justifyContent: {
            xs: "space-evenly",
            sm: "space-between",
          },
          marginTop: "2rem",
        }}
      >
        <CustomTextField label="User Name" placeHolderValue="Name" />
        <CustomTextField label="Gender" placeHolderValue="Gender" />
        <CustomTextField label="Email" placeHolderValue="Email" />
        <CustomTextField label="Phone #" placeHolderValue="Phone" />
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{
          justifyContent: {
            xs: "space-evenly",
            sm: "space-between",
          },
          marginTop: "1rem",
        }}
      >
        <CustomTextField label="DOB" placeHolderValue="DOB" />
        <CustomTextField label="SSID" placeHolderValue="SSID" />
        <CustomTextField label="Role" placeHolderValue="Role" />
        <CustomTextField label="Address" placeHolderValue="Address" />
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "2rem",
        }}
      >
        <TextButton
          buttonText={show ? "EDIT" : "ADD"}
          height="2rem"
          marginBottom="2rem"
          onClick={() => {
            alert("User Information Saved");
          }}
        />
      </Grid>
    </Grid>
  );
}

export default ModelInfo;
