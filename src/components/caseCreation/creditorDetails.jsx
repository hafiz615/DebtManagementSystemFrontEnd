import React, { useState, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import SearchBar from "../searchBar";
import CreditorFields from "../caseCreationFields/creditorFields";
import { Colors } from "../../config/default";
import { phoneNumberFormat } from "../../common";
import { Add, Delete, ExpandMore } from "@mui/icons-material";
import { FONT_SIZE_XL } from "../../constants/appConstants";

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
  const [digitsList, setDigitsList] = useState(
    finalCaseData?.map((caseEntry) => [caseEntry?.creditor?.aggression]) || [0]
  );

  const handleSearchChange = (value, index) => {
    setSearchText(value);
    SearchFields(value, index);
  };

  const handleCaseDataChange = (index, fieldPath, value) => {
    const newState = [...finalCaseData];

    const updateField = (obj, path, val) => {
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
    };

    if (index >= 0 && index < newState.length) {
      updateField(newState[index], fieldPath, value);
    }

    setFinalCaseData(newState);
  };

  const handleRemoveCase = (index, e) => {
    e.stopPropagation();
    const newState = finalCaseData.filter((_, i) => i !== index);
    const newDigitsList = digitsList.filter((_, i) => i !== index);
    setFinalCaseData(newState);
    setDigitsList(newDigitsList);
  };

  const addNewCreditor = () => {
    const newCreditorData = {
      creditor: {
        aggression: 0,
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
      contractDetails: {
        loanAmount: 0,
        purchasedPercentage: 0,
        repaymentAmount: 0,
      },
      status: "",
      totalDebt: 0,
      lastPaymentDate: "",
      paidAmount: 0,
      remaining: 0,
      feePayment: "toPay",
    };

    setFinalCaseData([...finalCaseData, newCreditorData]);
    setDigitsList([...digitsList, [0]]);
  };

  const handleDigitsChange = (caseIndex, newDigits) => {
    const updatedDigitsList = [...digitsList];
    updatedDigitsList[caseIndex] = newDigits;
    setDigitsList(updatedDigitsList);
  };

  useEffect(() => {
    let processedData;

    if (creditors.length === 0) {
      processedData = [
        {
          creditor: {
            aggression: 0,
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
          status: "",
          totalDebt: 0,
          lastPaymentDate: "",
          contractDetails: {
            loanAmount: 0,
            purchasedPercentage: 0,
            repaymentAmount: 0,
          },
          paidAmount: 0,
          remaining: 0,
          feePayment: "toPay",
        },
      ];
    } else {
      processedData = creditors.map((creditor) => ({
        creditor: {
          aggression: 0,
          accountTitle: creditor?.AccountTitle || "",
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
        contractDetails: creditor?.ContractDetails,
        paidAmount: 0,
        remaining:
          parseInt(
            creditor?.ContractDetails?.payable_amount
              .replace("$", "")
              .replace(",", "")
          ) || 0,
        feePayment: "toPay",
      }));
    }

    setFinalCaseData(processedData);
    setDigitsList(processedData?.map(() => Array(10).fill("")) || []);
  }, [creditors]);

  return (
    <>
      <Grid container sx={{ justifyContent: "flex-end" }}>
        <IconButton onClick={addNewCreditor}>
          <Add sx={{ color: Colors.SKY_BLUE }} />
        </IconButton>
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
        finalCaseData?.map((caseEntry, index) => (
          <Accordion
            key={index}
            sx={{
              boxShadow: "none",
              marginBottom: "10px",
              borderRadius: "1rem !important",
              backgroundColor: Colors.WHITE,
            }}
            defaultExpanded
          >
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: Colors.WHITE }} />}
              aria-controls="panel1-content"
              id={`panel${index}-header`}
              sx={{
                height: "20px",
                backgroundColor: Colors.SKY_BLUE,
                borderRadius: "1rem",
              }}
            >
              <Grid
                container
                xs={12}
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography
                  sx={{
                    fontSize: FONT_SIZE_XL,
                    fontFamily: "Nunito",
                    fontWeight: "700",
                    color: Colors.WHITE,
                  }}
                >
                  {caseEntry.creditor.businessInformation.companyName || ""}
                </Typography>

                <IconButton
                  onClick={(e) => handleRemoveCase(index, e)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Grid>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: Colors.WHITE,
                boxShadow: " 0 2px 5px -3px rgba(0, 0, 0, 0.5)",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
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
                  <Grid item xs={12} lg={4}>
                    <SearchBar
                      searchText={searchText}
                      onChange={handleSearchChange}
                      placeholder="Search by Email and Phone..."
                      filteredArray={filteredArray}
                      handleSelect={handleSelect}
                      setFilteredArray={setFilteredArray}
                      setSearchText={setSearchText}
                      backgroundColor={Colors.BG_LIGHT_GRAY}
                      idx={index}
                    />
                  </Grid>

                  <CreditorFields
                    thisCaseData={caseEntry}
                    handleCaseDataChange={handleCaseDataChange}
                    caseIndex={index}
                    setFinalCaseData={setFinalCaseData}
                    finalCaseData={finalCaseData}
                    debtorCaseData={debtorCaseData}
                    digits={digitsList[index]}
                    setDigits={(newDigits) =>
                      handleDigitsChange(index, newDigits)
                    }
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </>
  );
}
