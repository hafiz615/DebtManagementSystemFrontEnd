import React from "react";

import { Grid, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../config/default";
import { DebtorDetailsPage } from "../constants/appConstants";
import HorizontalNonLinearStepper from "./stepper";
import SearchBar from "./searchBar";
import BasicCard from "./card";

function DebtorDetails() {
  const { AUTHORITY_TEXT, AUTHORITY_VALUE, DEBTOR_HEADING } = DebtorDetailsPage;
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
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
          {AUTHORITY_TEXT} <span>{AUTHORITY_VALUE}</span>
        </Typography>
      </Grid>
      <Grid
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
          {DEBTOR_HEADING}
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: smallScreen ? "flex-start" : "center",
          alignItems: "center",
          marginTop: "0.5rem",
        }}
      >
        <HorizontalNonLinearStepper />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <SearchBar />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <Grid item xs={12} lg={5.9}>
          <BasicCard cardHeading="Business Information" toShowBusiness={true} />
        </Grid>
        <Grid item xs={12} lg={5.9}>
          <BasicCard cardHeading="Debtor Details" toShowDebtor={true} />
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <Grid item xs={12}>
          <BasicCard
            cardHeading="Contact Details"
            toShowContactDetails={true}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
export default DebtorDetails;
