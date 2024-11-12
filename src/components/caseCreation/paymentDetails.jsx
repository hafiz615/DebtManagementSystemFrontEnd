import React from "react";

import { Grid } from "@mui/material";

import PaymentSettlement from "../caseCreationFields/paymentSettlement";
import ScrollbarStyles from "../customScroll";

function PaymentDetails({
  remainingAmount,
  newDataList,
  setNewDataList,
  totalAmount,
  isExempt,
  errorMessage,
}) {
  return (
    <Grid
      container
      item
      xs={12}
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #EAEBEB",
        padding: "1rem",
        maxHeight: "30vh",
        overflowY: "auto",
        borderRadius: "10px",
        marginTop: "1rem",
        ...ScrollbarStyles,
      }}
    >
      <PaymentSettlement
        newDataList={newDataList}
        setNewDataList={setNewDataList}
        totalAmount={totalAmount}
        remainingAmount={remainingAmount}
        isExempt={isExempt}
        errorMessage={errorMessage}
      />
    </Grid>
  );
}

export default PaymentDetails;
