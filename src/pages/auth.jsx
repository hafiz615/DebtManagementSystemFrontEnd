import React from "react";
import { Grid } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../config/default";
import Login from "../components/login";
import Laptop from "../../src/assets/Laptop.png";

function Auth() {
  const largeScreen = useMediaQuery("(min-width:320px) and (max-width:760px)");
  return (
    <Grid
      container
      sx={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Login />
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          backgroundColor: Colors.NAVY_BLUE,
          height: "100vh",
          display: largeScreen ? "none" : "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={Laptop}
          alt="laptopImage"
          style={{
            width: "70%",
            height: "70%",
            objectFit: "contain",
          }}
        />
      </Grid>
    </Grid>
  );
}

export default Auth;
