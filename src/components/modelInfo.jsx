import React from "react";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import TextButton from "./button";
import CustomTextField from "./customTextfield";

function ModelInfo({ show }) {
  const smallScreen = useMediaQuery("(min-width:300px) and (max-width:760px)");
  const tabScreen = useMediaQuery("(min-width:761px)and (max-width:768px)");
  const lapScreen = useMediaQuery("(min-width:769px)and (max-width:1024px)");
  const largeScreen = useMediaQuery(
    "(min-width:1600px) and (max-width:3000px)"
  );
  return (
    <>
      <Typography
        sx={{
          fontWeight: "600",
          fontFamily: "Nunito",
          marginLeft: smallScreen
            ? "2.7rem"
            : tabScreen
            ? "1.4rem"
            : lapScreen
            ? "4rem"
            : "2rem",
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
            md: "space-evenly",
          },
          marginTop: "2rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
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
            md: "space-evenly",
          },
          marginTop: "1rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
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
          marginRight={
            smallScreen
              ? "2.2rem"
              : tabScreen
              ? "1.1rem"
              : lapScreen
              ? "4rem"
              : largeScreen
              ? "2rem"
              : "1.7rem"
          }
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
