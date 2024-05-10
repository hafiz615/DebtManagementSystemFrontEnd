import React from "react";

import { Grid } from "@mui/material";

import SearchBar from "../searchBar";
import DebtorFields from "../caseCreationFields/debtorFields";

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
        <DebtorFields />
      </Grid>
    </>
  );
}
export default DebtorDetails;
