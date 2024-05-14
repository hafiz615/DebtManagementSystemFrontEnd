import React from "react";

import { Grid } from "@mui/material";

import SearchBar from "../searchBar";
import CreditorFields from "../caseCreationFields/creditorFields";

export default function CreditorDetails({
  creditorBasicsInfo,
  setCreditorBasicsInfo,
  creditorBusinessDetails,
  setCreditorBusinessDetails,
  creditorContactDetails,
  setCreditorContactDetails,
  CreditorNotes,
  setCreditorNotes,
  fundedDate,
  setFundedDate,
  historicRange,
  setHistoricRange,
}) {
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
        <CreditorFields
          creditorBasicsInfo={creditorBasicsInfo}
          CreditorNotes={CreditorNotes}
          setCreditorNotes={setCreditorNotes}
          fundedDate={fundedDate}
          setFundedDate={setFundedDate}
          historicRange={historicRange}
          setHistoricRange={setHistoricRange}
          setCreditorBasicsInfo={setCreditorBasicsInfo}
          creditorBusinessDetails={creditorBusinessDetails}
          setCreditorBusinessDetails={setCreditorBusinessDetails}
          creditorContactDetails={creditorContactDetails}
          setCreditorContactDetails={setCreditorContactDetails}
        />
      </Grid>
    </>
  );
}
