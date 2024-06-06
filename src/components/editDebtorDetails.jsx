import React, { useState, useEffect } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Colors } from "../config/default";
import TextButton from "./button";
import PaymentsTextFields from "./caseTextField";
import Dropdown from "./dropdown";
import { UpdateDebtor } from "../services/services";
import { useToast } from "../toast/toastContext";
import MuiPhoneTextField from "./muiPhoneText";
import { PhoneValidation } from "../constants/appConstants";
import { formatPhoneNumber } from "../common";
import AmountTextField from "./amountTextField";

export default function EditDebtorDetail({
  handleClose,
  caseData,
  GetCaseDetails,
}) {
  const { PHONE_NO_CHARACTERS, PHONE_NO_ERROR } = PhoneValidation;
  const { showToast } = useToast();
  const menuItems = [
    { label: "Customer", value: "Customer" },
    { label: "On hold", value: "On hold" },
    { label: "Canceled", value: "Canceled" },
    { label: "Declared Bankruptcy", value: "Declared Bankruptcy" },
  ];

  const debtorBasicInfo = caseData?.debtor?.basicInformation;
  const debtorBusinessInfo = caseData?.debtor?.businessInformation;
  const [loading, setLoading] = useState(false);
  const [debtorOwnDetails, setDebtorOwnDetails] = useState({
    BasicFullName: debtorBasicInfo?.fullName || "",
    BasicEmailAddress: debtorBasicInfo?.email || "",
    BasicSsid: debtorBasicInfo?.SSID || "",
    BasicCountry: debtorBasicInfo?.country || "",
    BasicState: debtorBasicInfo?.state || "",
    BasicCity: debtorBasicInfo?.city || "",
    BasicZipCode: debtorBasicInfo?.zipCode || "",
    BasicPhoneNumber: debtorBasicInfo?.phone || "",
    BasicAddress: debtorBasicInfo?.address || "",
  });

  const [debtorBusinessDetails, setDebtorBusinessDetails] = useState({
    businessCompanyName: debtorBusinessInfo?.companyName || "",
    businessEinNumber: debtorBusinessInfo?.EIN || "",
    businessCategory: debtorBusinessInfo?.businessCategory || "",
    businessDescription: debtorBusinessInfo?.description || "",
    businessCountry: debtorBusinessInfo?.country || "",
    businessState: debtorBusinessInfo?.state || "",
    businessCity: debtorBusinessInfo?.city || "",
    businessZipCode: debtorBusinessInfo?.zipCode || "",
    businessPhoneNumber: debtorBusinessInfo?.phone || "",
    businessAddress: debtorBusinessInfo?.address || "",
  });

  const [status, setStatus] = useState(debtorBasicInfo?.status || "");
  const [errors, setErrors] = useState({
    businessPhone: "",
    einNumber: "",
    ssn: "",
    basicPhone: "",
    emailValid: "",
  });
  const isEmailValid = (email) => {
    // Use a more robust email validation regular expression
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const [isFormValid, setIsFormValid] = useState(false);
  const validateForm = () => {
    const ownDetailsValid = Object.values(debtorOwnDetails).every(
      (value) => value !== ""
    );
    const businessDetailsValid = Object.entries(debtorBusinessDetails).every(
      ([key, value]) => key === "businessDescription" || value !== ""
    );
    const noErrors = Object.values(errors).every((error) => error === "");
    return ownDetailsValid && businessDetailsValid && noErrors && status !== "";
  };
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [debtorOwnDetails, debtorBusinessDetails, errors, status]);
  const handleOwnDetailsChange = (field, value) => {
    if (field === "BasicEmailAddress") {
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
    if (field === "BasicSsid") {
      if (value.length !== 9) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ssn: "SSN must be 9 digits",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ssn: "",
        }));
      }
    }
    if (field === "BasicPhoneNumber") {
      if (value.length !== PHONE_NO_CHARACTERS) {
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
    if (field === "BasicSsid" || field === "BasicZipCode") {
      const inputValue = value;
      if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
        setDebtorOwnDetails((prevDetails) => ({
          ...prevDetails,
          [field]: value,
        }));
      }
    } else {
      setDebtorOwnDetails((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const updateDebtorById = async () => {
    setLoading(true);
    const params = {
      basicInformation: {
        fullName: debtorOwnDetails?.BasicFullName,
        email: debtorOwnDetails?.BasicEmailAddress,
        SSID: debtorOwnDetails?.BasicSsid,
        country: debtorOwnDetails?.BasicCountry,
        state: debtorOwnDetails?.BasicState,
        city: debtorOwnDetails?.BasicCity,
        zipCode: debtorOwnDetails?.BasicZipCode,
        status: status,
        phone: debtorOwnDetails?.BasicPhoneNumber,
        address: debtorOwnDetails?.BasicAddress,
        weeklyBudget: debtorOwnDetails?.BasicWeeklyBudget,
      },
      businessInformation: {
        companyName: debtorBusinessDetails?.businessCompanyName,
        EIN: debtorBusinessDetails?.businessEinNumber,
        businessCategory: debtorBusinessDetails?.businessCategory,
        description: debtorBusinessDetails?.businessDescription,
        country: debtorBusinessDetails?.businessCountry,
        state: debtorBusinessDetails?.businessState,
        city: debtorBusinessDetails?.businessCity,
        zipCode: debtorBusinessDetails?.businessZipCode,
        phone: debtorBusinessDetails?.businessPhoneNumber,
        address: debtorBusinessDetails?.businessAddress,
      },
    };
    const updateDebtor = await UpdateDebtor(caseData?.debtor?._id, params);
    if (updateDebtor?.status === 200) {
      showToast(updateDebtor?.data?.message, "success");
      handleClose();
      GetCaseDetails();
    } else {
      showToast(
        updateDebtor?.response?.data?.message || updateDebtor?.data?.message,
        "error"
      );
    }
    setLoading(false);
  };

  const handleBusinessDetailsChange = (field, value) => {
    if (field === "businessPhoneNumber") {
      if (value.length !== PHONE_NO_CHARACTERS) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          businessPhone: PHONE_NO_ERROR,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          businessPhone: "",
        }));
      }
    }
    if (field === "businessEinNumber") {
      if (value.length !== 9) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          einNumber: "EIN must be 9 digits",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          einNumber: "",
        }));
      }
    }
    if (field === "businessEinNumber" || field === "businessZipCode") {
      const inputValue = value;
      if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
        setDebtorBusinessDetails((prevDetails) => ({
          ...prevDetails,
          [field]: value,
        }));
      }
    } else {
      setDebtorBusinessDetails((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const handleNumberInputKeyDown = (e) => {
    const invalidChars = ["e", "E", ".", "-"];
    const allowedKeys = [
      "+",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
    ];
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };
  const handleNumberInput = (e) => {
    const allowedKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
    ];
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
    const invalidChars = ["e", "E", ".", "+", "-"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
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
            marginBottom: "1.5rem",
          }}
        >
          Edit Debtor Details
        </Typography>
        <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
          Personal Details
        </Typography>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <PaymentsTextFields
            type="text"
            label="Full Name*"
            placeHolderValue="Enter Your Name"
            width="100%"
            value={debtorOwnDetails?.BasicFullName}
            onChange={(e) =>
              handleOwnDetailsChange("BasicFullName", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="Email Address*"
            placeHolderValue="Enter Valid Email"
            width="100%"
            value={debtorOwnDetails?.BasicEmailAddress}
            onChange={(e) =>
              handleOwnDetailsChange("BasicEmailAddress", e.target.value)
            }
            error={errors?.emailValid}
          />
          <PaymentsTextFields
            type="text"
            label="SSN*"
            placeHolderValue="Enter SSN"
            width="100%"
            value={debtorOwnDetails?.BasicSsid}
            onChange={(e) =>
              handleOwnDetailsChange("BasicSsid", e.target.value)
            }
            onKeyDown={handleNumberInput}
            error={errors?.ssn}
          />
          <Typography
            sx={{
              fontWeight: "500",
              fontFamily: "Nunito",
              marginLeft: "1rem",
              color: Colors.DARK_GRAY,
            }}
          >
            Status*
          </Typography>
          <Dropdown
            menuItems={menuItems}
            placeholder="Choose Status"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            width="100%"
            selectedValue={status}
            setSelectedValue={setStatus}
          />
        </Grid>

        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.5rem",
          }}
        >
          <PaymentsTextFields
            type="text"
            label="Country*"
            placeHolderValue="Enter Country Name"
            width="100%"
            value={debtorOwnDetails?.BasicCountry}
            onChange={(e) =>
              handleOwnDetailsChange("BasicCountry", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="State*"
            placeHolderValue="Enter State Name"
            width="100%"
            value={debtorOwnDetails?.BasicState}
            onChange={(e) =>
              handleOwnDetailsChange("BasicState", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="City*"
            placeHolderValue="Enter City Name"
            width="100%"
            value={debtorOwnDetails?.BasicCity}
            onChange={(e) =>
              handleOwnDetailsChange("BasicCity", e.target.value)
            }
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.5rem",
          }}
        >
          <PaymentsTextFields
            type="number"
            label="Zip Code*"
            placeHolderValue="Enter Zip Code"
            width="100%"
            value={debtorOwnDetails?.BasicZipCode}
            onChange={(e) =>
              handleOwnDetailsChange("BasicZipCode", e.target.value)
            }
            onKeyDown={handleNumberInput}
          />

          <MuiPhoneTextField
            label="Phone #*"
            value={debtorOwnDetails?.BasicPhoneNumber}
            onChange={(e) =>
              handleOwnDetailsChange("BasicPhoneNumber", formatPhoneNumber(e))
            }
            onKeyDown={handleNumberInputKeyDown}
            error={errors?.basicPhone}
          />
          <PaymentsTextFields
            type="text"
            label="Address*"
            placeHolderValue="Add Your Address"
            width="100%"
            value={debtorOwnDetails?.BasicAddress}
            onChange={(e) =>
              handleOwnDetailsChange("BasicAddress", e.target.value)
            }
          />
        </Grid>
        <Grid container xs={12}>
          <Typography
            sx={{
              fontWeight: "500",
              fontFamily: "Nunito",
              marginLeft: "1rem",
              color: Colors.DARK_GRAY,
            }}
          >
            Weekly Budget*
          </Typography>
          <AmountTextField
            width="100%"
            value={debtorOwnDetails?.BasicWeeklyBudget}
            onChange={(e) =>
              handleOwnDetailsChange(
                "BasicWeeklyBudget",
                Number(e.target.value)
              )
            }
          />
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          borderRadius: "10px",
          marginTop: { xs: ".5rem", xl: "0rem" },
          backgroundColor: Colors.WHITE,
          // padding: "1rem",
        }}
      >
        <Typography
          sx={{ fontFamily: "Nunito", fontWeight: "600" }}
          gutterBottom
        >
          Business Information
        </Typography>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <PaymentsTextFields
            type="text"
            label="Company Name*"
            placeHolderValue="Enter Company Name"
            width="100%"
            value={debtorBusinessDetails?.businessCompanyName}
            onChange={(e) =>
              handleBusinessDetailsChange("businessCompanyName", e.target.value)
            }
          />
          <PaymentsTextFields
            type="number"
            label="EIN Number*"
            placeHolderValue="Enter Ein Number"
            width="100%"
            value={debtorBusinessDetails?.businessEinNumber}
            onChange={(e) =>
              handleBusinessDetailsChange("businessEinNumber", e.target.value)
            }
            error={errors?.einNumber}
            onKeyDown={handleNumberInput}
          />
          <PaymentsTextFields
            type="text"
            label="Business Category*"
            placeHolderValue="Enter Business Category"
            width="100%"
            value={debtorBusinessDetails?.businessCategory}
            onChange={(e) =>
              handleBusinessDetailsChange("businessCategory", e.target.value)
            }
          />
          <Typography
            sx={{
              fontWeight: "500",
              fontFamily: "Nunito",
              marginLeft: "1rem",
              color: Colors.DARK_GRAY,
            }}
          >
            Description (Optional)
          </Typography>
          <input
            type="text"
            placeholder="Add Description"
            value={debtorBusinessDetails?.businessDescription}
            onChange={(e) =>
              handleBusinessDetailsChange("businessDescription", e.target.value)
            }
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border: "none",
              outline: "none",
              borderRadius: "5px",
              width: "100%",
            }}
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.5rem",
          }}
        >
          <PaymentsTextFields
            type="text"
            label="Country*"
            placeHolderValue="Enter Country Name"
            width="100%"
            value={debtorBusinessDetails?.businessCountry}
            onChange={(e) =>
              handleBusinessDetailsChange("businessCountry", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="State*"
            placeHolderValue="Enter State Name"
            width="100%"
            value={debtorBusinessDetails?.businessState}
            onChange={(e) =>
              handleBusinessDetailsChange("businessState", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="City*"
            placeHolderValue="Enter City Name"
            width="100%"
            value={debtorBusinessDetails?.businessCity}
            onChange={(e) =>
              handleBusinessDetailsChange("businessCity", e.target.value)
            }
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.5rem",
          }}
        >
          <PaymentsTextFields
            type="number"
            label="Zip Code*"
            placeHolderValue="Enter Zip Code"
            width="100%"
            value={debtorBusinessDetails?.businessZipCode}
            onChange={(e) =>
              handleBusinessDetailsChange("businessZipCode", e.target.value)
            }
            onKeyDown={handleNumberInput}
          />

          <MuiPhoneTextField
            label="Phone #*"
            value={debtorBusinessDetails?.businessPhoneNumber}
            onChange={(e) =>
              handleBusinessDetailsChange(
                "businessPhoneNumber",
                formatPhoneNumber(e)
              )
            }
            onKeyDown={handleNumberInputKeyDown}
            error={errors?.businessPhone}
          />
          <PaymentsTextFields
            type="text"
            label="Address*"
            placeHolderValue="Add Your Address"
            width="100%"
            value={debtorBusinessDetails?.businessAddress}
            onChange={(e) =>
              handleBusinessDetailsChange("businessAddress", e.target.value)
            }
          />
        </Grid>
      </Grid>
      <Grid container xs={12} sx={{ justifyContent: "right" }}>
        <TextButton
          buttonText="Save"
          height="2rem"
          width="8rem"
          disabled={!isFormValid}
          onClick={updateDebtorById}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={loading}
        />
      </Grid>
    </>
  );
}
