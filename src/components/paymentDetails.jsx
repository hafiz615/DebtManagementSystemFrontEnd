import React from "react";

import { Grid } from "@mui/material";

import BasicCard from "./card";

function PaymentDetails() {
  return (
    <Grid
      container
      item
      xs={12}
      sx={{
        display: "flex",
        alignItems: "center",
        marginTop: "1rem",
      }}
    >
      <Grid item xs={12} sx={{ marginBottom: "0.5rem" }}>
        <BasicCard cardHeading="Debt Details" toShowDebtDetails={true} />
      </Grid>
      <Grid item xs={12}>
        <BasicCard
          cardHeading="Settlement Plan Automation"
          toShowSettlementPlan={true}
        />
      </Grid>
    </Grid>
  );
}

export default PaymentDetails;
