import React from "react";
import { Grid } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../config/default";
import Login from "../components/login";
import Laptop from "../../src/assets/Laptop.png";

function Auth() {
  const smallScreen = useMediaQuery("(min-width:250px) and (max-width:900px)");
  return (
    <Grid
      container
      sx={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: smallScreen ? Colors.NAVY_BLUE : "",
      }}
    >
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: smallScreen ? "column" : "unset",
        }}
      >
        <Login />
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          background: Colors.GRADIENT,
          height: "100vh",
          display: { xs: "none", md: "flex" },
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
