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
import AmountTextField from "./amountTextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { isEmailValid } from "../common";
import { HistoricRangeHandleNumberInput } from "../common";

export default function EditCreditorDetail({
  handleClose,
  caseData,
  GetCaseDetails,
  maxHeight,
}) {
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
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
  const formattedFundedDate = caseData?.creditor?.lastFundedDate
    ? new Date(caseData?.creditor?.lastFundedDate).toISOString().split("T")[0]
    : "";
  const [fundedDate, setFundedDate] = useState(formattedFundedDate || "");
  const [historicRange, setHistoricRange] = useState({
    minimum: caseData?.creditor?.historicalRange?.minimum || "",
    maximum: caseData?.creditor?.historicalRange?.maximum || "",
  });
  const [loading, setLoading] = useState(false);

  const [creditorFieldsError, setCreditorFieldsError] = useState({
    emailValidError: "",
    creditorPhoneError: "",
  });

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

  const validateForm = () => {
    return (
      creditorFieldsError?.emailValidError ||
      creditorFieldsError?.creditorPhoneError ||
      Object.values(creditorBasicsInfo)?.some((value) => value === "") ||
      Object.values(creditorBusinessDetails)?.some((value) => value === "")
    );
  };
  const today = new Date().toISOString().split("T")[0];

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
      lastFundedDate: fundedDate,
      historicalRange: historicRange,
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
        }}
      >
        <Close />
      </Box>

      <Grid
        item
        xs={12}
        sx={{
          maxHeight: maxHeight,
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
            marginBottom: "0.5rem",
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
            onChangeFunction={(e) =>
              businessInfoInputChange("businessCompanyName", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="Business Category*"
            placeHolderValue="Enter Category"
            width="97%"
            value={creditorBusinessDetails?.businessCategory}
            onChangeFunction={(e) =>
              businessInfoInputChange("businessCategory", e.target.value)
            }
          />
        </Grid>
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "600",
            marginTop: ".8rem",
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
            onChangeFunction={(e) =>
              basicInfoInputChange("CreditorBasicFullName", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="Email Address*"
            placeHolderValue="Enter Valid Email"
            width="100%"
            value={creditorBasicsInfo?.CreditorBasicEmailAddress}
            onChangeFunction={(e) =>
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
            error={creditorFieldsError?.creditorPhoneError}
          />
        </Grid>
        <Grid
          container
          sx={{
            marginTop: ".8rem",
            borderRadius: "10px",
            backgroundColor: Colors.WHITE,
          }}
        >
          <Grid item xs={12}>
            <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
              Funded
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "500",
                color: Colors.DARK_GRAY,
                marginLeft: "1rem",
              }}
            >
              Last Funded Date
            </Typography>
            <PaymentsTextFields
              width={smallScreen ? "100%" : "97%"}
              type="date"
              placeHolderValue="00/00/00"
              value={fundedDate}
              onChangeFunction={(e) => setFundedDate(e.target.value)}
              max={today}
            />
          </Grid>

          <Grid item xs={12} md={7} lg={8}>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                marginTop: ".8rem",
              }}
            >
              Historical Range
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    color: Colors.DARK_GRAY,
                    marginLeft: "1rem",
                  }}
                >
                  Minimum
                </Typography>
                <AmountTextField
                  value={historicRange?.minimum}
                  onChange={(e) =>
                    setHistoricRange((prev) => ({
                      ...prev,
                      minimum: parseInt(e.target.value),
                    }))
                  }
                  onKeyDown={HistoricRangeHandleNumberInput}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    color: Colors.DARK_GRAY,
                    marginLeft: "1rem",
                  }}
                >
                  Maximum
                </Typography>
                <AmountTextField
                  value={historicRange?.maximum}
                  onChange={(e) =>
                    setHistoricRange((prev) => ({
                      ...prev,
                      maximum: parseInt(e.target.value),
                    }))
                  }
                  onKeyDown={HistoricRangeHandleNumberInput}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container sx={{ justifyContent: "right" }}>
          <TextButton
            marginBottom=".5rem"
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
      </Grid>
    </>
  );
}
