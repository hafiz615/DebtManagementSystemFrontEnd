import React, { useState } from "react";

import { Grid, Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Colors } from "../config/default";
import PaymentsTextFields from "./caseTextField";
import TextButton from "./button";
import { UpdateCreditor } from "../services/services";
import { useToast } from "../toast/toastContext";
import MuiPhoneNumber from "material-ui-phone-number";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function EditCreditorDetail({
  handleClose,
  caseData,
  GetCaseDetails,
}) {
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
  const smallScreen = useMediaQuery("(min-width:300px) and (max-width:760px)");
  const formatPhoneNumber = (value) => {
    const spaceReplace = value?.replace(/ /g, "");
    const phoneFormat = spaceReplace?.replace(/[^+a-zA-Z 0-9]+/g, "");
    return phoneFormat;
  };
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
      if (value.length !== 11) {
        setCreditorFieldsError((prevErrors) => ({
          ...prevErrors,
          creditorPhoneError: "Phone number must be 10 digits",
        }));
      } else {
        setCreditorFieldsError((prevErrors) => ({
          ...prevErrors,
          creditorPhoneError: "",
        }));
      }
    } else {
      setCreditorBasicsInfo((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    }
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
      GetCaseDetails();
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
          padding: "1rem",
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
          gutterBottom
        >
          Creditor Details
        </Typography>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
          }}
        >
          <PaymentsTextFields
            type="text"
            label="Full Name*"
            placeHolderValue="Enter Full Name"
            width="97%"
            value={creditorBasicsInfo?.CreditorBasicFullName}
            onChange={(e) =>
              basicInfoInputChange("CreditorBasicFullName", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="Email Address*"
            placeHolderValue="Enter Valid Email"
            width="97%"
            value={creditorBasicsInfo?.CreditorBasicEmailAddress}
            onChange={(e) =>
              basicInfoInputChange("CreditorBasicEmailAddress", e.target.value)
            }
            error={creditorFieldsError?.emailValidError}
          />

          <Grid item xs={12} md={3.9}>
            <Typography
              sx={{
                fontWeight: "500",
                fontFamily: "Nunito",
                marginLeft: "1rem",
                color: Colors.DARK_GRAY,
              }}
            >
              Phone #*
            </Typography>
            <MuiPhoneNumber
              sx={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                height: "2.5rem",
                paddingLeft: ".4rem",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "center",
                border: "none !important",
                "& .MuiInputBase-input": {
                  color: Colors.DIM_LIGHT_GRAY,
                  fontSize: ".8rem",
                },
                "& .MuiInput-underline:before": {
                  borderBottom: "none",
                },
                "& .MuiInput-underline:after": {
                  borderBottom: "none",
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottom: "none",
                },
              }}
              value={creditorBasicsInfo?.CreditorBasicPhoneNumber}
              variant="standard"
              fullWidth
              defaultCountry={"us"}
              disableDropdown={false}
              onChange={(e) =>
                basicInfoInputChange(
                  "CreditorBasicPhoneNumber",
                  formatPhoneNumber(e)
                )
              }
              onKeyDown={handleNumberInputKeyDown}
            />
            {creditorFieldsError?.creditorPhoneError ? (
              <Box
                sx={{
                  color: "red",
                  fontSize: "9.3px",
                  height: smallScreen ? "0.5rem" : "0.7rem",
                }}
              >
                {creditorFieldsError?.creditorPhoneError}
              </Box>
            ) : (
              <Box
                sx={{
                  color: "red",
                  height: smallScreen ? "0.5rem" : "0.7rem",
                }}
              ></Box>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid container xs={11.4} sx={{ justifyContent: "right" }}>
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
