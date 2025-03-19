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
import { isEmailValid } from "../../common";
import { PhoneValidation } from "../../constants/appConstants";

export default function CreditorDetails({
  creditors,
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
  errors,
  setErrors,
  hideComponents,
  lawsuitExtractedData,
}) {
  const [digitsList, setDigitsList] = useState(
    finalCaseData?.map((caseEntry) => [caseEntry?.creditor?.aggression]) || [0]
  );
  const [isChecked, setIsChecked] = useState([]);
  const [lawsuitFields, setLawsuitFields] = useState([
    {
      lawsuit: {
        balance: "",
        document_date: "",
      },
      lawfirm: {
        lawfirmCompanyName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        EIN: "",
      },
      attorney: {
        attorney_name: "",
        attorney_telephone: "",
        attorney_address: "",
        attorney_city: "",
        attorney_SSN: "",
        attorney_state: "",
      },
    },
  ]);

  const { PHONE_NO_CHARACTERS, PHONE_NO_ERROR } = PhoneValidation;
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

    if (fieldPath === "creditor.basicInformation.email") {
      if (!isEmailValid(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailValid: "Email must be valid",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailValid: "",
        }));
      }
    }
    if (fieldPath === "creditor.basicInformation.phone") {
      if (value?.length !== PHONE_NO_CHARACTERS) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          basicPhone: PHONE_NO_ERROR,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          basicPhone: "",
        }));
      }
    }
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
      lawsuitExist: false,
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
    if (creditors?.length === 0) {
      processedData = [
        {
          creditor: {
            aggression: 0,
            accountTitle: "",
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
          lawsuitExist: false,
        },
      ];
    } else {
      processedData = creditors?.map((creditor, index) => {
        let mappedEntry = Object.entries(
          debtorCaseData?.creditorNames?.mapped_data || {}
        )?.find(([key, value]) => {
          return value === creditor?.Name;
        });

        let mappedKey = mappedEntry ? mappedEntry[0] : null;

        return {
          creditor: {
            aggression: 0,
            accountTitle: creditor?.AccountTitle || mappedKey || "",
            basicInformation: {
              fullName: creditor?.Name || "",
              email: creditor?.EmailAddress || "",
              phone: phoneNumberFormat(
                creditor?.PhoneNumber
                  ? creditor?.PhoneNumber.startsWith("+1")
                    ? creditor?.PhoneNumber.slice(2)
                    : creditor?.PhoneNumber
                  : ""
              ),
            },
            businessInformation: {
              companyName: creditor?.Name || "",
              businessCategory: creditor?.businessCategory || "",
            },
            notes: "",
            lastFundedDate: creditor?.ContractDetails?.signing_date || "",
            historicalRange: {
              minimum: 0,
              maximum: 0,
            },
            contacts: [],
          },
          status: "",
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
          lawsuitExist: isChecked[index] || false,
          ...lawsuitFields[index],
        };
      });
    }
    setFinalCaseData(processedData);
    setDigitsList(processedData?.map(() => Array(10).fill("")) || []);
  }, [creditors]);

  return (
    <>
      {!hideComponents && (
        <Grid container sx={{ justifyContent: "flex-end" }}>
          <IconButton onClick={addNewCreditor}>
            <Add sx={{ color: Colors.SKY_BLUE }} />
          </IconButton>
        </Grid>
      )}
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
                  {caseEntry?.creditor?.businessInformation?.companyName || ""}
                </Typography>
                {!hideComponents && (
                  <IconButton
                    onClick={(e) => handleRemoveCase(index, e)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                )}
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
                  {!hideComponents && (
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
                  )}

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
                    errors={errors}
                    setErrors={setErrors}
                    lawsuitFields={lawsuitFields}
                    setLawsuitFields={setLawsuitFields}
                    isChecked={isChecked}
                    setIsChecked={setIsChecked}
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
