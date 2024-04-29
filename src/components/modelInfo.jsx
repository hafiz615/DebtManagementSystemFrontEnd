import React from "react";
import { Grid } from "@mui/material";

import Typography from "@mui/material/Typography";

import TextButton from "./button";
import CustomTextField from "./customTextfield";

function ModelInfo({ isEdit, show }) {
  return (
    <>
      <Typography
        sx={{
          fontWeight: "600",
          fontFamily: "Nunito",
          marginLeft: "1.5rem",
        }}
      >
        {show ? "Edit User" : "Add User"}
      </Typography>

      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "2rem",
        }}
      >
        <CustomTextField label="User Name" placeHolderValue="Name" />
        <CustomTextField label="Gender" placeHolderValue="Gender" />
        <CustomTextField label="Email" placeHolderValue="Email" />
        <CustomTextField label="Phone #" placeHolderValue="Phone" />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
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
          marginRight="1rem"
          marginBottom="2rem"
          paddingLeft="2rem"
          paddingRight="2rem"
          onClick={() => {
            alert("User Information Saved");
          }}
        />
      </Grid>
    </>
  );
}

export default ModelInfo;
