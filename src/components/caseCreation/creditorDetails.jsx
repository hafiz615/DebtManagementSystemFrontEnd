import React from "react";
import { Grid, CircularProgress } from "@mui/material";
import SearchBar from "../searchBar";
import CreditorFields from "../caseCreationFields/creditorFields";
import { Colors } from "../../config/default";
import { phoneNumberFormat } from "../../common";
import CloseIcon from "@mui/icons-material/Close";

const contactFields = {
  name: "",
  title: "",
  phone: "",
  email: "",
  relationWithDebtor: "",
  country: "",
  state: "",
  city: "",
  zipCode: "",
};
const intervalFields = {
  amount: 0,
  startDate: "",
  timePeriod: "Custom",
  frequency: 0,
};

export default function CreditorDetails({
  creditors,
  setCreditors,
  debtorCaseData,
  finalCaseData,
  setFinalCaseData,
  searchText,
  setSearchText,
  SearchFields,
  loading,
  filteredArray,
  setFilteredArray,
  handleSelect,
}) {
  const handleSearchChange = (value) => {
    setSearchText(value);
    SearchFields(value);
  };

  function handleCaseDataChange(index, fieldPath, value) {
    const newState = [...finalCaseData];

    function updateField(obj, path, val) {
      const keys = path.split(".");
      const lastKey = keys.pop();

      let current = obj;
      for (const key of keys) {
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }

      current[lastKey] = val;
    }

    if (index >= 0 && index < newState.length) {
      updateField(newState[index], fieldPath, value);
    }

    setFinalCaseData(newState);
  }

  function handleRemoveCase(index) {
    // Remove creditor from creditors array
    // const newCreditors = creditors.filter((_, i) => i !== index);
    // setCreditors(newCreditors);

    // Remove case from finalCaseData
    const newState = finalCaseData.filter((_, i) => i !== index);
    setFinalCaseData(newState);
  }

  React.useEffect(() => {
    let processedData;

    if (creditors.length === 0) {
      processedData = [
        {
          creditor: {
            accountTitle: "",
            paymentToken: "",
            paymentType: "",
            basicInformation: {
              fullName: "",
              email: "",
              phone: "",
            },
            businessInformation: {
              companyName: "",
              businessCategory: "",
            },
            notes: "",
            lastFundedDate: "",
            historicalRange: {
              minimum: 0,
              maximum: 0,
            },
            contacts: [],
          },
          status: "In progress",
          totalDebt: 0,
          lastPaymentDate: "",
          // principalAmount: 0,
          // purchasedPercentage: 0,
          // repaymentAmount: 0,
          paidAmount: 0,
          remaining: 0,
          feePayment: "toPay",
          // intervals: [],
          // securityKey: ""
        },
      ];
    } else {
      processedData = creditors.map((creditor) => ({
        creditor: {
          accountTitle: "",
          paymentToken: "",
          paymentType: "",
          basicInformation: {
            fullName: creditor?.Name || "",
            email: creditor?.EmailAddress || "",
            phone: phoneNumberFormat(creditor?.PhoneNumber) || "",
          },
          businessInformation: {
            companyName: creditor?.Name || "",
            businessCategory: "",
          },
          notes: "",
          lastFundedDate: creditor?.ContractDetails?.signing_date || "",
          historicalRange: {
            minimum: 0,
            maximum: 0,
          },
          contacts: [],
        },
        status: "In Process",
        totalDebt:
          parseInt(
            creditor?.ContractDetails?.payable_amount
              .replace("$", "")
              .replace(",", "")
          ) || 0,
        lastPaymentDate: "",
        // principalAmount: parseInt(creditor?.ContractDetails?.loan_amount) || 0,
        // purchasedPercentage: creditor?.ContractDetails?.purchased_percentage || 0,
        // repaymentAmount: parseInt(creditor?.ContractDetails?.repayment_amount) || 0,
        paidAmount: 0,
        remaining:
          parseInt(
            creditor?.ContractDetails?.payable_amount
              .replace("$", "")
              .replace(",", "")
          ) || 0,
        feePayment: "toPay",
        // intervals: [],
        // securityKey: ""
      }));
    }

    setFinalCaseData(processedData);
  }, [creditors]);

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
        finalCaseData.map((caseEntry, index) => (
          <Grid
            key={index}
            container
            item
            sx={{
              justifyContent: "space-between",
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
                position: "relative",
              }}
            >
              <CreditorFields
                thisCaseData={caseEntry}
                handleCaseDataChange={handleCaseDataChange}
                caseIndex={index}
                setFinalCaseData={setFinalCaseData}
                finalCaseData={finalCaseData}
                debtorCaseData={debtorCaseData}
                handleRemoveCase={() => handleRemoveCase(index)}
              />
            </Grid>
          </Grid>
        ))
      )}
    </>
  );
}
