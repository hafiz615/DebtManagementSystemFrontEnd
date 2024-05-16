import React from "react";

import { Grid } from "@mui/material";

import SearchBar from "../searchBar";
import CreditorFields from "../caseCreationFields/creditorFields";
import { Colors } from "../../config/default";
import CircularProgress from "@mui/material/CircularProgress";

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
  searchText,
  setSearchText,
  SearchFields,
  loading,
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
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          SearchFields={SearchFields}
        />
      </Grid>
      {loading ? (
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "46vh",
          }}
        >
          <CircularProgress size={100} sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : (
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
      )}
    </>
  );
}
