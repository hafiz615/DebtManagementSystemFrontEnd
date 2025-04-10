import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Colors } from "../config/default";
import TextButton from "./button";
import { UpdateCaseCreditor } from "../services/services";
import { useToast } from "../toast/toastContext";
import CreditorFields from "./caseCreationFields/creditorFields";
import { phoneNumberFormat, isEmailValid } from "../common";
import { PhoneValidation } from ".././constants/appConstants";

export default function EditCreditorDetail({
  handleClose,
  caseData,
  GetCaseDetails,
  getAllRanges,
  getAttorneyData,
}) {
  const { PHONE_NO_CHARACTERS, PHONE_NO_ERROR } = PhoneValidation;
  const { id } = useParams();
  const { showToast } = useToast();
  const creditors = caseData?.creditor;
  const [finalCaseData, setFinalCaseData] = useState([]);
  const [errors, setErrors] = useState({
    basicPhone: "",
    emailValid: "",
  });

  const [digitsList, setDigitsList] = useState(
    [caseData?.creditor?.aggression] || [0]
  );
  const [loading, setLoading] = useState(false);
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

  const handleDigitsChange = (caseIndex, newDigits) => {
    const updatedDigitsList = [...digitsList];
    updatedDigitsList[caseIndex] = newDigits;
    setDigitsList(updatedDigitsList);
  };
  useEffect(() => {
    const processedData = [
      {
        creditor: {
          _id: creditors?._id,
          aggression: creditors?.aggression || 0,
          accountTitle: creditors?.accountTitle,
          basicInformation: {
            fullName: creditors?.basicInformation?.fullName || "",
            email: creditors?.basicInformation?.email || "",
            phone: phoneNumberFormat(
              creditors?.basicInformation?.phone
                ? creditors?.basicInformation?.phone.startsWith("+1")
                  ? creditors?.basicInformation?.phone.slice(2)
                  : creditors?.basicInformation?.phone
                : ""
            ),
          },
          businessInformation: {
            companyName: creditors?.businessInformation?.companyName || "",
            businessCategory:
              creditors?.businessInformation?.businessCategory || "",
          },
          notes: creditors?.notes,
          lastFundedDate: creditors?.lastFundedDate
            ? new Date(creditors?.lastFundedDate).toISOString().split("T")[0]
            : "",
          historicalRange: {
            minimum: creditors?.historicalRange?.minimum || 0,
            maximum: creditors?.historicalRange?.maximum || 0,
          },
        },
        status: caseData?.status || "",
        totalDebt: caseData?.totalDebt || 0,
        lastPaymentDate: caseData?.lastPaymentDate
          ? new Date(caseData?.lastPaymentDate).toISOString().split("T")[0]
          : "",
        contractDetails: caseData?.contractDetails,
        paidAmount: caseData?.paidAmount || 0,
        remaining: parseInt(caseData?.remaining?.toFixed(2)) || 0,
        feePayment: caseData?.feePayment,
      },
    ];

    setFinalCaseData(processedData);
    setDigitsList([creditors?.aggression?.toString()] || []);
  }, [creditors]);

  const updateCreditorBYId = async () => {
    setLoading(true);

    if (
      finalCaseData[0]?.creditor?.aggression === null ||
      isNaN(finalCaseData[0]?.creditor?.aggression)
    ) {
      finalCaseData[0].creditor.aggression = 0;
    }

    const updateCreditor = await UpdateCaseCreditor(
      caseData?._id,
      finalCaseData[0]
    );

    if (updateCreditor?.status === 200) {
      showToast(updateCreditor?.data?.message, "success");
      handleClose();
      GetCaseDetails(id);
      getAllRanges && getAllRanges([], false);
      getAttorneyData();
    } else {
      showToast(
        updateCreditor?.response?.data?.message ||
          updateCreditor?.data?.message,
        "error"
      );
    }
    setLoading(false);
  };

  return (
    <>
      <Box
        onClick={handleClose}
        sx={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Close />
      </Box>
      {finalCaseData?.map((caseEntry, index) => (
        <CreditorFields
          key={index}
          thisCaseData={caseEntry}
          handleCaseDataChange={handleCaseDataChange}
          caseIndex={index}
          setFinalCaseData={setFinalCaseData}
          finalCaseData={finalCaseData}
          debtorCaseData={creditors?.accountTitleMapping}
          digits={digitsList[index]}
          setDigits={(newDigits) => handleDigitsChange(index, newDigits)}
          errors={errors}
          setErrors={setErrors}
          lawsuitFields={lawsuitFields}
          setLawsuitFields={setLawsuitFields}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
        />
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
          marginBottom=".5rem"
          buttonText="Save"
          height="2rem"
          width="8rem"
          onClick={updateCreditorBYId}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={loading}
        />
      </Grid>
    </>
  );
}
