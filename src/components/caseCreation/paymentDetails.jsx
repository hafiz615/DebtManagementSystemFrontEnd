import React from "react";

import { Grid } from "@mui/material";

import { Colors } from "../../config/default";
import PaymentSettlement from "../caseCreationFields/paymentSettlement";

function PaymentDetails({
  remainingAmount,
  newDataList,
  setNewDataList,
  totalAmount,
  isExempt,
}) {
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
      <Grid
        item
        xs={12}
        sx={{
          borderRadius: "10px",
          backgroundColor: Colors.WHITE,
          padding: "1rem",
        }}
      >
        <PaymentSettlement
          newDataList={newDataList}
          setNewDataList={setNewDataList}
          totalAmount={totalAmount}
          remainingAmount={remainingAmount}
          isExempt={isExempt}
        />
      </Grid>
    </Grid>
  );
}

export default PaymentDetails;
