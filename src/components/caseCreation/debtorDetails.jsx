import React from "react";

import { Grid } from "@mui/material";

import SearchBar from "../searchBar";
import DebtorFields from "../caseCreationFields/debtorFields";
import { Colors } from "../../config/default";
import CircularProgress from "@mui/material/CircularProgress";

function DebtorDetails({
  debtorOwnDetails,
  setDebtorOwnDetails,
  debtorBusinessDetails,
  setDebtorBusinessDetails,
  debtorContactDetails,
  setDebtorContactDetails,
  selectedValue,
  setSelectedValue,
  checked,
  setChecked,
  searchText,
  setSearchText,
  SearchFields,
  loading,
  errors,
  setErrors,
  setContactErrors,
  contactError,
  emailContactError,
  setEmailContactError,
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
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <DebtorFields
            debtorOwnDetails={debtorOwnDetails}
            setDebtorOwnDetails={setDebtorOwnDetails}
            debtorBusinessDetails={debtorBusinessDetails}
            setDebtorBusinessDetails={setDebtorBusinessDetails}
            debtorContactDetails={debtorContactDetails}
            setDebtorContactDetails={setDebtorContactDetails}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            checked={checked}
            setChecked={setChecked}
            errors={errors}
            setErrors={setErrors}
            setContactErrors={setContactErrors}
            contactError={contactError}
            emailContactError={emailContactError}
            setEmailContactError={setEmailContactError}
          />
        </Grid>
      )}
    </>
  );
}
export default DebtorDetails;
