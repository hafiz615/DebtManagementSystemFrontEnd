import React from "react";
import { useSelector } from "react-redux";

import { Grid, Typography, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { UserListPage } from "../constants/appConstants";
import { Colors } from "../config/default";
import { BorderAll } from "@mui/icons-material";

export default function ClientListDetails() {
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;
  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        paddingLeft: "2rem",
        paddingRight: "2rem",
      }}
    >
      <Grid
        container
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: smallScreen ? "flex-start" : "flex-end",
          marginTop: "1.5rem",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "500",
            color: Colors.DARK_GRAY,
          }}
        >
          {AUTHORITY_TEXT} <span>{role}</span>
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{
          marginTop: "1.5rem",
        }}
      >
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "2rem",
            fontFamily: "Nunito",
            color: Colors.BLACK,
          }}
        >
          Client Name
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{
          marginTop: "1.5rem",
        }}
      >
        <Grid container item xs={12} lg={7}>
          <Grid item xs={12} lg={6} sx={{ border: "1px solid red" }}>
            <Typography>
              SSN <span></span>
            </Typography>
            <Typography>SSN</Typography>
            <Typography>SSN</Typography>
            <Typography>SSN</Typography>
          </Grid>
          <Grid item xs={12} lg={6} sx={{ border: "1px solid red" }}>
            <Typography>SSN</Typography>
            <Typography>SSN</Typography>
            <Typography>SSN</Typography>
          </Grid>
        </Grid>

        <Grid container item xs={12} lg={5}>
          <Grid item xs={12} lg={6} sx={{ border: "1px solid red" }}>
            <Typography>SSN</Typography>
            <Typography>SSN</Typography>
          </Grid>
          <Grid item xs={12} lg={6} sx={{ border: "1px solid red" }}>
            <Typography>SSN</Typography>
            <Typography>SSN</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
