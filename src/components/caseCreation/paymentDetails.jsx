import React from "react";

import { Grid } from "@mui/material";

import PaymentFields from "../caseCreationFields/paymentFields";
import { Colors } from "../../config/default";
import PaymentSettlement from "../caseCreationFields/paymentSettlement";

function PaymentDetails({
  totalReceivable,
  setTotalReceivable,
  paidAmount,
  setPaidAmount,
  remainingAmount,
  setRemainingAmount,
  lastPaymentDate,
  setLastPaymentDate,
  selectedValue,
  setSelectedValue,
  newDataList,
  setNewDataList,
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
          marginBottom: "0.5rem",
          borderRadius: "10px",
          backgroundColor: Colors.WHITE,
          padding: "1rem",
        }}
      >
        <PaymentFields
          totalReceivable={totalReceivable}
          setTotalReceivable={setTotalReceivable}
          paidAmount={paidAmount}
          setPaidAmount={setPaidAmount}
          remainingAmount={remainingAmount}
          setRemainingAmount={setRemainingAmount}
          lastPaymentDate={lastPaymentDate}
          setLastPaymentDate={setLastPaymentDate}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: "0.5rem",
          borderRadius: "10px",
          backgroundColor: Colors.WHITE,
          padding: "1rem",
        }}
      >
        <PaymentSettlement
          newDataList={newDataList}
          setNewDataList={setNewDataList}
        />
      </Grid>
    </Grid>
  );
}

export default PaymentDetails;
