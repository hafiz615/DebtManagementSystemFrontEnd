import React from "react";

import { Grid } from "@mui/material";

import SearchBar from "../searchBar";
import DebtorFields from "../caseCreationFields/debtorFields";

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
  debtorSearchText,
  setDebtorSearchText,
  SearchDebtorFields,
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
          debtorSearchText={debtorSearchText}
          setDebtorSearchText={setDebtorSearchText}
          SearchDebtorFields={SearchDebtorFields}
        />
      </Grid>
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
        />
      </Grid>
    </>
  );
}
export default DebtorDetails;
