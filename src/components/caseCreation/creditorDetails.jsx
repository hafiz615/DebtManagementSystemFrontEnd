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
  securityKey,
  setSecurityKey,
  fundedDate,
  setFundedDate,
  historicRange,
  setHistoricRange,
  searchText,
  setSearchText,
  SearchFields,
  loading,
  creditorFieldsError,
  setCreditorFieldsError,
  creditorContactError,
  setCreditorContactError,
  creditorContactEmailError,
  setCreditorContactEmailError,
  handleSelect,
  filteredArray,
  setFilteredArray,
}) {
  const handleSearchChange = (value) => {
    setSearchText(value);
    SearchFields(value);
  };

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
          onChange={handleSearchChange}
          placeholder="Search by Email and Phone..."
          filteredArray={filteredArray}
          handleSelect={handleSelect}
          setFilteredArray={setFilteredArray}
          setSearchText={setSearchText}
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
            securityKey={securityKey}
            setSecurityKey={setSecurityKey}
            fundedDate={fundedDate}
            setFundedDate={setFundedDate}
            historicRange={historicRange}
            setHistoricRange={setHistoricRange}
            setCreditorBasicsInfo={setCreditorBasicsInfo}
            creditorBusinessDetails={creditorBusinessDetails}
            setCreditorBusinessDetails={setCreditorBusinessDetails}
            creditorContactDetails={creditorContactDetails}
            setCreditorContactDetails={setCreditorContactDetails}
            creditorFieldsError={creditorFieldsError}
            setCreditorFieldsError={setCreditorFieldsError}
            creditorContactError={creditorContactError}
            setCreditorContactError={setCreditorContactError}
            creditorContactEmailError={creditorContactEmailError}
            setCreditorContactEmailError={setCreditorContactEmailError}
          />
        </Grid>
      )}
    </>
  );
}
