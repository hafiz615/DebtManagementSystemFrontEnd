import React from "react";
import { Grid } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../config/default";
import AppLogo from "../../src/assets/FC White.png";
import VerifyProfile from "../components/verifyProfile";

function VerifyProfilePage() {
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
        <VerifyProfile />
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          background: Colors.GRADIENT,
          height: "100vh",
          display: largeScreen ? "none" : "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={AppLogo}
          alt="laptopImage"
          style={{
            width: "50%",
            height: "50%",
            objectFit: "contain",
          }}
        />
      </Grid>
    </Grid>
  );
}

export default VerifyProfilePage;
