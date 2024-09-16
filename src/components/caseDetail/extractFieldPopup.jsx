import React, { useEffect } from "react";
import { useState } from "react";
import {
  ExtractedCaseFields,
  UpdateMultipleCreditors,
} from "../../services/services";
import { useToast } from "../../toast/toastContext";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { Colors } from "../../config/default";
import EditDebtorDetails from "./../editDebtorDetails";
import EditCreditorDetail from "../editCreditorDetail";
import CreditorFields from "../caseCreationFields/creditorFields";
import { isEmailValid, phoneNumberFormat, sanitizeText } from "../../common";
import TextButton from "../button";
import { Close } from "@mui/icons-material";
import { PhoneValidation } from "../../constants/appConstants";
import { isEmpty } from "lodash";

function ExtractFieldPopup({
  selectedFiles,
  setSelectedFiles,
  caseDataId,
  data,
  GetCaseDetails,
  connectPayment,
  setConnectPayment,
  handleClose,
}) {
  const { PHONE_NO_CHARACTERS, PHONE_NO_ERROR } = PhoneValidation;
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [showComponent, setShowComponent] = useState(true);
  const [caseData, setCaseData] = useState({});
  const [finalCaseData, setFinalCaseData] = useState([]);
  const [aiCreditors, setAiCreditors] = useState([]);
  const [finalResult, setFinalResult] = useState([]);

  const [digitResultList, setDigitResultList] = useState([]);
  const [businessErrors, setBusinessErrors] = useState({});
  const [errors, setErrors] = useState({
    basicPhone: "",
    emailValid: "",
  });
  const [digitsList, setDigitsList] = useState(
    data?.creditors?.map((caseEntry) => [caseEntry?.aggression]) || [0]
  );

  const ExtractFields = async () => {
    setLoading(true);
    const params = {
      documents: selectedFiles,
    };

    const extractRes = await ExtractedCaseFields(caseDataId, params);

    if (extractRes?.status === 200) {
      showToast(extractRes?.data?.message, "success");
      let debtorObject = {};

      const extractedFields = extractRes?.data?.data?.extracted_fields || [];

      extractedFields.forEach((item) => {
        if (isEmpty(item)) return; // Skip empty items

        // Merge business info
        for (let key in item.bussiness_info) {
          if (
            key === "Business EIN Number" &&
            debtorObject?.BusinessInfo?.[key]?.length !== 9
          ) {
            const ein = sanitizeText(item.bussiness_info[key]);
            if (ein.length === 9) {
              debtorObject.BusinessInfo = {
                ...debtorObject.BusinessInfo,
                [key]: ein,
              };
            }
          } else if (
            item.bussiness_info[key] !== null &&
            item.bussiness_info[key] !== ""
          ) {
            debtorObject.BusinessInfo = {
              ...debtorObject.BusinessInfo,
              [key]: item.bussiness_info[key],
            };
          }
        }

        // Merge debtor info
        for (let key in item.debtor_info) {
          if (item.debtor_info[key] !== null && item.debtor_info[key] !== "") {
            debtorObject.DebtorInfo = {
              ...debtorObject.DebtorInfo,
              [key]: item.debtor_info[key],
            };
          }
        }
        setCaseData(debtorObject);
      });

      setAiCreditors(extractRes?.data?.data?.extracted_fields);
    } else {
      showToast(
        extractRes?.response?.data?.message || extractRes?.data?.message,
        "error"
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    ExtractFields();
  }, []);
  useEffect(() => {
    let processedData;

    if (aiCreditors?.length === 0) {
      processedData = [
        {
          creditor: {
            _id: "",
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
          _id: "",
        },
      ];
    } else {
      processedData = aiCreditors?.map((creditor) => ({
        creditor: {
          _id: "",
          aggression: 0,
          accountTitle:
            creditor?.creditor_info?.["creditor's bank acc. title"] || "",
          basicInformation: {
            fullName: creditor?.creditor_info?.["creditor's Name"] || "",
            email: creditor?.creditor_info?.["creditor's Email address"] || "",
            phone: phoneNumberFormat(
              creditor?.creditor_info?.["creditor's Phone Number"]
                ? creditor?.creditor_info?.[
                    "creditor's Phone Number"
                  ]?.startsWith("+1")
                  ? creditor?.creditor_info?.["creditor's Phone Number"]?.slice(
                      2
                    )
                  : creditor?.creditor_info?.["creditor's Phone Number"]
                : ""
            ),
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
          loan_amount: creditor?.contract_details?.loan_amount || 0,
          purchased_percentage:
            creditor?.contract_details?.purchased_percentage || 0,
          repayment_amount: creditor?.contract_details?.repayment_amount || 0,
        },

        paidAmount: 0,
        remaining:
          parseInt(
            creditor?.contract_details?.payable_amount
              .replace("$", "")
              .replace(",", "")
          ) || 0,
        feePayment: "toPay",
        _id: data?._id,
      }));
    }

    setFinalCaseData(processedData);
    setDigitsList(processedData?.map(() => Array(10).fill("")) || []);
  }, [aiCreditors]);

  useEffect(() => {
    let processedData;
    if (data?.creditors?.length > 0) {
      processedData = data?.creditors?.map((creditor) => ({
        creditor: {
          aggression: 0,
          accountTitle: creditor?.creditor?.accountTitle || "",
          basicInformation: {
            fullName: creditor?.creditor?.basicInformation?.fullName || "",
            email: creditor?.creditor?.basicInformation?.email || "",
            phone: phoneNumberFormat(
              creditor?.creditor?.basicInformation?.phone
                ? creditor?.creditor?.basicInformation?.phone.startsWith("+1")
                  ? creditor?.creditor?.basicInformation?.phone.slice(2)
                  : creditor?.creditor?.basicInformation?.phone
                : ""
            ),
          },
          businessInformation: {
            companyName:
              creditor?.creditor?.businessInformation?.companyName || "",
            businessCategory:
              creditor?.creditor?.businessInformation?.businessCategory || "",
          },
          notes: creditor?.creditor?.notes || "",
          lastFundedDate: creditor?.creditor?.lastFundedDate || "",
          historicalRange: creditor?.creditor?.historicalRange || {
            minimum: 0,
            maximum: 0,
          },
          contacts: creditor?.creditor?.contacts || [],
        },
        status: "",
        totalDebt: creditor?.totalDebt || 0,
        lastPaymentDate: "",
        contractDetails: creditor?.ContractDetails,
        paidAmount: 0,
        remaining:
          parseInt(
            creditor?.ContractDetails?.payable_amount
              .replace("$", "")
              .replace(",", "")
          ) || 0,
        feePayment: creditor?.feePayment || "toPay",
      }));
    }

    setFinalResult(processedData);
    setDigitResultList(processedData?.map(() => Array(10).fill("")) || []);
  }, [data?.creditors, data]);

  useEffect(() => {
    const compareData = () => {
      let hasErrors = false;
      const errors = [];

      finalCaseData?.forEach((caseItem, caseIndex) => {
        const resultItem = finalResult?.find(
          (result) =>
            result?.creditor?.businessInformation?.companyName ===
            caseItem?.creditor?.basicInformation?.fullName
        );

        if (resultItem) {
          // Compare aggression
          if (
            caseItem?.creditor?.aggression !== resultItem?.creditor?.aggression
          ) {
            errors.push({ field: "aggression", index: caseIndex });
            hasErrors = true;
          }

          // Compare accountTitle
          if (
            caseItem?.creditor?.accountTitle !==
            resultItem?.creditor?.accountTitle
          ) {
            errors.push({ field: "accountTitle", index: caseIndex });
            hasErrors = true;
          }

          // Compare basicInformation (fullName, email, phone)
          if (
            caseItem?.creditor?.basicInformation?.fullName !==
            resultItem?.creditor?.basicInformation?.fullName
          ) {
            errors.push({ field: "fullName", index: caseIndex });
            hasErrors = true;
          }
          if (
            caseItem?.creditor?.basicInformation?.email !==
            resultItem?.creditor?.basicInformation?.email
          ) {
            errors.push({ field: "email", index: caseIndex });
            hasErrors = true;
          }
          if (
            caseItem?.creditor?.basicInformation?.phone !==
            resultItem?.creditor?.basicInformation?.phone
          ) {
            errors.push({ field: "phone", index: caseIndex });
            hasErrors = true;
          }

          // Compare businessInformation (companyName, businessCategory)
          if (
            caseItem?.creditor?.businessInformation?.companyName !==
            resultItem?.creditor?.businessInformation?.companyName
          ) {
            errors.push({ field: "companyName", index: caseIndex });
            hasErrors = true;
          }
          if (
            caseItem?.creditor?.businessInformation?.businessCategory !==
            resultItem?.creditor?.businessInformation?.businessCategory
          ) {
            errors.push({ field: "businessCategory", index: caseIndex });
            hasErrors = true;
          }

          // Compare notes
          if (caseItem?.creditor?.notes !== resultItem?.creditor?.notes) {
            errors.push({ field: "notes", index: caseIndex });
            hasErrors = true;
          }

          // Compare lastFundedDate
          if (
            caseItem?.creditor?.lastFundedDate !==
            resultItem?.creditor?.lastFundedDate
          ) {
            errors.push({ field: "lastFundedDate", index: caseIndex });
            hasErrors = true;
          }

          // Compare historicalRange (minimum, maximum)
          if (
            caseItem?.creditor?.historicalRange?.minimum !==
            resultItem?.creditor?.historicalRange?.minimum
          ) {
            errors.push({ field: "historicalRange.minimum", index: caseIndex });
            hasErrors = true;
          }
          if (
            caseItem?.creditor?.historicalRange?.maximum !==
            resultItem?.creditor?.historicalRange?.maximum
          ) {
            errors.push({ field: "historicalRange.maximum", index: caseIndex });
            hasErrors = true;
          }

          // Compare contacts (you may need to loop through them depending on structure)
          if (
            JSON.stringify(caseItem?.creditor?.contacts) !==
            JSON.stringify(resultItem?.creditor?.contacts)
          ) {
            errors.push({ field: "contacts", index: caseIndex });
            hasErrors = true;
          }

          // Compare top-level fields (status, totalDebt, etc.)
          if (caseItem?.status !== resultItem?.status) {
            errors.push({ field: "status", index: caseIndex });
            hasErrors = true;
          }
          if (caseItem?.totalDebt !== resultItem?.totalDebt) {
            errors.push({ field: "totalDebt", index: caseIndex });
            hasErrors = true;
          }
          if (caseItem?.lastPaymentDate !== resultItem?.lastPaymentDate) {
            errors.push({ field: "lastPaymentDate", index: caseIndex });
            hasErrors = true;
          }

          // Compare contractDetails (loanAmount, purchasedPercentage, repaymentAmount)
          if (
            caseItem?.contractDetails?.loan_amount !==
            resultItem?.contractDetails?.loan_amount
          ) {
            errors.push({ field: "loan_amount", index: caseIndex });
            hasErrors = true;
          }
          if (
            caseItem?.contractDetails?.purchased_percentage !==
            resultItem?.contractDetails?.purchased_percentage
          ) {
            errors.push({ field: "purchased_percentage", index: caseIndex });
            hasErrors = true;
          }
          if (
            caseItem?.contractDetails?.repayment_amount !==
            resultItem?.contractDetails?.repayment_amount
          ) {
            errors.push({ field: "repayment_amount", index: caseIndex });
            hasErrors = true;
          }

          // Compare remaining amount
          if (caseItem?.remaining !== resultItem?.remaining) {
            errors.push({ field: "remaining", index: caseIndex });
            hasErrors = true;
          }

          // Compare feePayment
          if (caseItem?.feePayment !== resultItem?.feePayment) {
            errors.push({ field: "feePayment", index: caseIndex });
            hasErrors = true;
          }
        } else {
          // No matching record found, log companyName as error
          errors.push({ field: "companyName", index: caseIndex });
          hasErrors = true;
        }
      });

      if (hasErrors) {
        setBusinessErrors(errors);
      }
    };

    compareData();
  }, [finalCaseData, finalResult]);

  useEffect(() => {
    const updateIdsInFinalCaseData = () => {
      let isUpdated = false; // To track if we need to update finalCaseData

      const updatedCaseData = finalCaseData?.map((caseItem) => {
        // Find a match in data?.creditors based on fullName
        const matchingCreditor = data?.creditors?.find(
          (creditor) =>
            creditor?.creditor?.businessInformation?.companyName ===
            caseItem?.creditor?.basicInformation?.fullName
        );

        if (
          matchingCreditor &&
          caseItem?.creditor?._id !== matchingCreditor?._id
        ) {
          // If a match is found and _id is different, update the _id
          isUpdated = true; // Mark that we need to update the state
          return {
            ...caseItem,
            creditor: {
              ...caseItem?.creditor,
              _id: matchingCreditor?._id, // Set the matched creditor's _id
            },
          };
        }

        return caseItem; // Return the original if no match found or _id is already correct
      });

      if (isUpdated) {
        setFinalCaseData(updatedCaseData); // Update finalCaseData only if there are changes
      }
    };

    updateIdsInFinalCaseData();
  }, [finalCaseData, data?.creditors]); // Remove finalCaseData dependency to prevent loop
  // Run effect when finalCaseData or data.creditors changes

  const handleDigitsChange = (caseIndex, newDigits) => {
    const updatedDigitsList = [...digitsList];
    updatedDigitsList[caseIndex] = newDigits;
    setDigitsList(updatedDigitsList);
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

  const showDebtor = () => {
    setShowComponent(true);
  };

  const updateCreditors = async () => {
    setLoading(true);

    finalCaseData?.forEach((item) => {
      if (
        item.creditor.aggression === null ||
        isNaN(item.creditor.aggression)
      ) {
        item.creditor.aggression = 0;
      }
    });
    const params = {
      cases: finalCaseData,
    };
    const multipleCreditorsRes = await UpdateMultipleCreditors(
      data?.debtor?._id,
      params
    );
    if (multipleCreditorsRes?.status === 200) {
      showToast(multipleCreditorsRes?.data?.message, "success");
      handleClose();
    } else {
      showToast(
        multipleCreditorsRes?.response?.data?.message ||
          multipleCreditorsRes?.data?.message,
        "error"
      );
    }
    setLoading(false);
  };
  return (
    <div>
      {loading ? (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
          }}
        >
          <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : (
        <>
          {showComponent ? (
            <EditDebtorDetails
              handleClose={handleClose}
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
              connectPayment={connectPayment}
              setConnectPayment={setConnectPayment}
              data={data}
              showFields={true}
              showComponent={showComponent}
              setShowComponent={setShowComponent}
            />
          ) : (
            <>
              <Box
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontFamily: "Nunito",
                    paddingLeft: "1rem",
                  }}
                >
                  Edit Creditors Details
                </Typography>
                <Close onClick={handleClose} sx={{ marginRight: "1rem" }} />
              </Box>
              {finalCaseData?.map((caseEntry, index) => (
                <>
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontFamily: "Nunito",
                      marginLeft: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    {caseEntry?.creditor?.basicInformation?.fullName}
                  </Typography>
                  <CreditorFields
                    key={index}
                    thisCaseData={caseEntry}
                    handleCaseDataChange={handleCaseDataChange}
                    caseIndex={index}
                    setFinalCaseData={setFinalCaseData}
                    finalCaseData={finalCaseData}
                    debtorCaseData={data?.creditors[index]?.accountTitleMapping}
                    digits={digitsList[index]}
                    setDigits={(newDigits) =>
                      handleDigitsChange(index, newDigits)
                    }
                    businessErrors={businessErrors}
                    errors={errors}
                    setErrors={setErrors}
                    showErrors={true}
                  />
                </>
              ))}
              <Grid
                container
                sx={{
                  justifyContent: "flex-end",
                  position: "sticky",
                  bottom: 0,
                  zIndex: 1,
                }}
              >
                <TextButton
                  buttonText="Save"
                  height="2rem"
                  width="8rem"
                  marginRight="1rem"
                  onClick={updateCreditors}
                  backgroundColor={Colors.SKY_BLUE}
                  hoverColor={Colors.SKY_BLUE}
                  loading={loading}
                />
                <TextButton
                  buttonText="Back"
                  height="2rem"
                  width="8rem"
                  onClick={showDebtor}
                  backgroundColor={Colors.ORANGE_COLOR}
                  hoverColor={Colors.ORANGE_COLOR}
                />
              </Grid>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ExtractFieldPopup;
