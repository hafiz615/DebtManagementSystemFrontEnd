import React from "react";

import { Grid } from "@mui/material";

import SearchBar from "./searchBar";
import BasicCard from "./card";

export default function CreditorDetails() {
  return (
    <>
      <Grid
        container
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
        container
        item
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <Grid item xs={12} lg={5.9}>
          <BasicCard
            cardHeading="Business Information"
            toShowCreditorBusiness={true}
          />
        </Grid>
        <Grid item xs={12} lg={5.9}>
          <BasicCard
            cardHeading="Funded"
            toShowCreditorFunded={true}
            height="325px"
          />
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
    </>
  );
}
