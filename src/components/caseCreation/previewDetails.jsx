import React from "react";
import { Grid } from "@mui/material";

import BasicCard from "../caseCreationFields/previewFields";

export default function PreviewDetails({
  debtorOwnDetails,
  creditorBasicsInfo,
  newDataList,
  status,
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
          cardHeading="Debtor Details"
          previewDebtorDetails={true}
          debtorOwnDetails={debtorOwnDetails}
          creditorBasicsInfo={creditorBasicsInfo}
          newDataList={newDataList}
          status={status}
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
        />
      </Grid>
    </Grid>
  );
}
