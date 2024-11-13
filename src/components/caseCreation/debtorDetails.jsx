import React from "react";
import { useState, useEffect } from "react";

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
  filteredArray,
  handleSelect,
  setFilteredArray,
  connectPayment,
  setConnectPayment,
  walletId,
  hideComponents,
  setProfitMargin,
  profitMargin,
}) {
  const handleSearchChange = (value) => {
    setSearchText(value);
    SearchFields(value);
  };

  return (
    <>
      {!hideComponents && (
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
          <SearchBar
            searchText={searchText}
            placeholder="Search by Email,Phone and SSN..."
            onChange={handleSearchChange}
            filteredArray={filteredArray}
            handleSelect={handleSelect}
            setFilteredArray={setFilteredArray}
            setSearchText={setSearchText}
          />
        </Grid>
      )}

      {loading ? (
        <Grid
          container
          item
          xs={12}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            height: "55vh",
          }}
        >
          <CircularProgress size={140} sx={{ color: Colors.SKY_BLUE }} />
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
            connectPayment={connectPayment}
            setConnectPayment={setConnectPayment}
            setProfitMargin={setProfitMargin}
            profitMargin={profitMargin}
            walletId={walletId}
          />
        </Grid>
      )}
    </>
  );
}
export default DebtorDetails;
