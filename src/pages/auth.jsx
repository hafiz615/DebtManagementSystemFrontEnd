import React, { useState } from "react";
import { Grid } from "@mui/material";
import Laptop from "../../src/assets/Laptop.png";

import Login from "../components/login";
import SignUp from "../components/signUp";

import useMediaQuery from "@mui/material/useMediaQuery";
function Auth() {
  const [authForm, setAuthForm] = useState(true);
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
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {authForm ? (
          <Login setAuthForm={setAuthForm} />
        ) : (
          <SignUp setAuthForm={setAuthForm} />
        )}
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          backgroundColor: "#888888",
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
