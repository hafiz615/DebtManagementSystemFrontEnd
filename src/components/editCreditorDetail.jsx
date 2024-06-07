import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Colors } from "../config/default";
import PaymentsTextFields from "./caseTextField";
import TextButton from "./button";
import { UpdateCreditor } from "../services/services";
import { useToast } from "../toast/toastContext";
import MuiPhoneTextField from "./muiPhoneText";
import { PhoneValidation } from "../constants/appConstants";
import { formatPhoneNumber } from "../common";

export default function EditCreditorDetail({
  handleClose,
  caseData,
  GetCaseDetails,
}) {
  const { id } = useParams();
  const { PHONE_NO_CHARACTERS, PHONE_NO_ERROR } = PhoneValidation;
  const { showToast } = useToast();
  const creditorBasicInfo = caseData?.creditor?.basicInformation;
  const creditorBusinessInfo = caseData?.creditor?.businessInformation;
  const [creditorBasicsInfo, setCreditorBasicsInfo] = useState({
    CreditorBasicFullName: creditorBasicInfo?.fullName || "",
    CreditorBasicEmailAddress: creditorBasicInfo?.email || "",
    CreditorBasicPhoneNumber: creditorBasicInfo?.phone || "",
  });
  const [creditorBusinessDetails, setCreditorBusinessDetails] = useState({
    businessCompanyName: creditorBusinessInfo?.companyName || "",
    businessCategory: creditorBusinessInfo?.businessCategory || "",
  });
  const [loading, setLoading] = useState(false);

  const [creditorFieldsError, setCreditorFieldsError] = useState({
    emailValidError: "",
    creditorPhoneError: "",
  });
  const isEmailValid = (email) => {
    // Use a more robust email validation regular expression
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };
  const basicInfoInputChange = (fieldName, value) => {
    if (fieldName === "CreditorBasicEmailAddress") {
      if (!isEmailValid(value)) {
        setCreditorFieldsError((prevErrors) => ({
          ...prevErrors,
          emailValidError: "Email must be valid",
        }));
      } else {
        setCreditorFieldsError((prevErrors) => ({
          ...prevErrors,
          emailValidError: "",
        }));
      }
    }
    if (fieldName === "CreditorBasicPhoneNumber") {
      if (value.length !== PHONE_NO_CHARACTERS) {
        setCreditorFieldsError((prevErrors) => ({
          ...prevErrors,
          creditorPhoneError: PHONE_NO_ERROR,
        }));
      } else {
        setCreditorFieldsError((prevErrors) => ({
          ...prevErrors,
          creditorPhoneError: "",
        }));
      }
    }
    setCreditorBasicsInfo((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };
  const businessInfoInputChange = (fieldName, value) => {
    setCreditorBusinessDetails((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleNumberInputKeyDown = (e) => {
    const invalidChars = ["e", "E", ".", "-"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };

  const validateForm = () => {
    return (
      creditorFieldsError?.emailValidError ||
      creditorFieldsError?.creditorPhoneError ||
      Object.values(creditorBasicsInfo)?.some((value) => value === "") ||
      Object.values(creditorBusinessDetails)?.some((value) => value === "")
    );
  };

  const updateCreditorBYId = async () => {
    setLoading(true);
    const params = {
      basicInformation: {
        fullName: creditorBasicsInfo?.CreditorBasicFullName,
        email: creditorBasicsInfo?.CreditorBasicEmailAddress,
        phone: creditorBasicsInfo?.CreditorBasicPhoneNumber,
      },
      businessInformation: {
        companyName: creditorBusinessDetails?.businessCompanyName,
        businessCategory: creditorBusinessDetails?.businessCategory,
      },
    };
    const updateCreditor = await UpdateCreditor(
      caseData?.creditor?._id,
      params
    );
    if (updateCreditor?.status === 200) {
      showToast(updateCreditor?.data?.message, "success");
      handleClose();
      GetCaseDetails(id);
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
          marginBottom: "1rem",
        }}
      >
        <Close />
      </Box>

      <Grid
        item
        xs={12}
        sx={{
          borderRadius: "10px",
          marginTop: { xs: ".5rem", xl: "0rem" },
          backgroundColor: Colors.WHITE,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "600",
            fontSize: 20,
            marginBottom: "1rem",
          }}
        >
          Edit Creditor Details
        </Typography>
        <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
          Business Information
        </Typography>
        <Grid container item xs={12}>
          <PaymentsTextFields
            type="text"
            label="Company Name*"
            placeHolderValue="Enter Company Name"
            width="97%"
            value={creditorBusinessDetails?.businessCompanyName}
            onChange={(e) =>
              businessInfoInputChange("businessCompanyName", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="Business Category*"
            placeHolderValue="Enter Category"
            width="97%"
            value={creditorBusinessDetails?.businessCategory}
            onChange={(e) =>
              businessInfoInputChange("businessCategory", e.target.value)
            }
          />
        </Grid>
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "600",
            marginTop: "1rem",
          }}
        >
          Creditor Details
        </Typography>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <PaymentsTextFields
            type="text"
            label="Full Name*"
            placeHolderValue="Enter Full Name"
            width="100%"
            value={creditorBasicsInfo?.CreditorBasicFullName}
            onChange={(e) =>
              basicInfoInputChange("CreditorBasicFullName", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="Email Address*"
            placeHolderValue="Enter Valid Email"
            width="100%"
            value={creditorBasicsInfo?.CreditorBasicEmailAddress}
            onChange={(e) =>
              basicInfoInputChange("CreditorBasicEmailAddress", e.target.value)
            }
            error={creditorFieldsError?.emailValidError}
          />

          <MuiPhoneTextField
            label="Phone #*"
            value={creditorBasicsInfo?.CreditorBasicPhoneNumber}
            onChange={(e) =>
              basicInfoInputChange(
                "CreditorBasicPhoneNumber",
                formatPhoneNumber(e)
              )
            }
            onKeyDown={handleNumberInputKeyDown}
            error={creditorFieldsError?.creditorPhoneError}
          />
        </Grid>
      </Grid>
      <Grid container xs={12} sx={{ justifyContent: "right" }}>
        <TextButton
          buttonText="Save"
          height="2rem"
          width="8rem"
          onClick={updateCreditorBYId}
          disabled={validateForm()}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={loading}
        />
      </Grid>
    </>
  );
}
