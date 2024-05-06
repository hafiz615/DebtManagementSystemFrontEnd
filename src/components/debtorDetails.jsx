import React from "react";

import { Grid } from "@mui/material";

import SearchBar from "./searchBar";
import BasicCard from "./card";

function DebtorDetails() {
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
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <Grid item xs={12} xl={5.9}>
          <BasicCard cardHeading="Business Information" toShowBusiness={true} />
        </Grid>
        <Grid item xs={12} xl={5.9}>
          <BasicCard cardHeading="Debtor Details" toShowDebtor={true} />
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{ marginTop: "1rem" }}>
        <BasicCard cardHeading="Contact Details" toShowContactDetails={true} />
      </Grid>
    </>
  );
}
export default DebtorDetails;
