import React from "react";
import { Grid } from "@mui/material";

import BasicCard from "../caseCreationFields/previewFields";

export default function PreviewDetails({
  debtorOwnDetails,
  creditorBasicsInfo,
  newDataList,
  status,
  fundedDate,
  CreditorNotes,
  creditorBusinessDetails,
  totalReceivable,
  paidAmount,
  feePayment,
  remainingAmount,
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
      <Grid item xs={12} sx={{ marginBottom: "0.5rem" }}>
        <BasicCard
          cardHeading="Client Details"
          previewDebtorDetails={true}
          debtorOwnDetails={debtorOwnDetails}
          creditorBasicsInfo={creditorBasicsInfo}
          newDataList={newDataList}
          status={status}
          fundedDate={fundedDate}
          CreditorNotes={CreditorNotes}
          creditorBusinessDetails={creditorBusinessDetails}
          totalReceivable={totalReceivable}
          paidAmount={paidAmount}
          feePayment={feePayment}
          remainingAmount={remainingAmount}
        />
      </Grid>
      <Grid item xs={12}>
        <BasicCard
          cardHeading="Creditor Details"
          previewCreditorDetails={true}
          debtorOwnDetails={debtorOwnDetails}
          creditorBasicsInfo={creditorBasicsInfo}
          newDataList={newDataList}
          status={status}
          fundedDate={fundedDate}
          CreditorNotes={CreditorNotes}
          creditorBusinessDetails={creditorBusinessDetails}
          totalReceivable={totalReceivable}
          paidAmount={paidAmount}
          feePayment={feePayment}
          remainingAmount={remainingAmount}
        />
      </Grid>
      <Grid item xs={12} sx={{ marginTop: "0.5rem" }}>
        <BasicCard
          cardHeading="Payment Plan Automation"
          previewSettlementPlan={true}
          debtorOwnDetails={debtorOwnDetails}
          creditorBasicsInfo={creditorBasicsInfo}
          newDataList={newDataList}
          status={status}
          fundedDate={fundedDate}
          CreditorNotes={CreditorNotes}
          creditorBusinessDetails={creditorBusinessDetails}
          totalReceivable={totalReceivable}
          paidAmount={paidAmount}
          feePayment={feePayment}
          remainingAmount={remainingAmount}
        />
      </Grid>
    </Grid>
  );
}
