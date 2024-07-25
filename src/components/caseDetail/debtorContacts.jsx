import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Grid, Box } from "@mui/material";
import { Close } from "@mui/icons-material";

import PaymentsTextFields from "../caseTextField";
import MuiPhoneTextField from "../muiPhoneText";
import { useToast } from "./../../toast/toastContext";

import useMediaQuery from "@mui/material/useMediaQuery";
import { Colors } from "../../config/default";
import { PhoneValidation } from "../../constants/appConstants";
import { formatPhoneNumber } from "../../common";
import TextButton from "../button";

import { UpdateCreditor, UpdateDebtor } from "../../services/services";
import { hasAnyValue } from "../../common";
import ScrollbarStyles from "../customScroll";

export default function DebtorContacts({
  caseData,
  GetCaseDetails,
  handleClose,
  maxHeight,
  show,
  caseId,
}) {
  const { id } = useParams();
  const { showToast } = useToast();
  const { PHONE_NO_CHARACTERS, PHONE_NO_ERROR } = PhoneValidation;
  const [loading, setLoading] = useState(false);
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");

  const initialContact = {
    name: "",
    title: "",
    phone: "",
    email: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    relationWithDebtor: "",
  };

  const [debtorContactDetails, setDebtorContactDetails] =
    useState(initialContact);
  const debtorContantHasValue = hasAnyValue(debtorContactDetails);

  const [contactError, setContactErrors] = useState({});
  const [emailContactError, setEmailContactError] = useState({});

  const handleInputChange = (field, value) => {
    const updatedContact = { ...debtorContactDetails };
    if (field === "email") {
      if (!isEmailValid(value)) {
        setEmailContactError((prevErrors) => ({
          ...prevErrors,
          email: "Email must be Valid",
        }));
      } else {
        setEmailContactError((prevErrors) => ({
          ...prevErrors,
          email: "",
        }));
      }
    }
    if (field === "phone") {
      if (value.length !== PHONE_NO_CHARACTERS) {
        setContactErrors((prevErrors) => ({
          ...prevErrors,
          phone: PHONE_NO_ERROR,
        }));
      } else {
        setContactErrors((prevErrors) => ({
          ...prevErrors,
          phone: "",
        }));
      }
    }
    if (field === "zipCode") {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        updatedContact[field] = value;
        setDebtorContactDetails(updatedContact);
      }
    } else {
      updatedContact[field] = value;
      setDebtorContactDetails(updatedContact);
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

  const isEmailValid = (email) => {
    // Use a more robust email validation regular expression
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };
  const areRequiredFieldsFilled = () => {
    return (
      debtorContactDetails.name.trim() !== "" &&
      debtorContactDetails.title.trim() !== "" &&
      debtorContactDetails.phone.trim() !== "" &&
      debtorContactDetails.email.trim() !== ""
    );
  };

  const updateDebtorById = async () => {
    setLoading(true);
    let contactToUpdate = { ...debtorContactDetails };

    // Rename the property if show is "Creditor"
    if (show === "Creditor") {
      const { relationWithDebtor, ...rest } = debtorContactDetails;
      contactToUpdate = { ...rest, relationWithCreditor: relationWithDebtor };
    }
    const params = {
      contact: contactToUpdate,
    };
    let updateDebtor;
    if (show === "Debtor") {
      updateDebtor = await UpdateDebtor(caseId, params);
    } else {
      updateDebtor = await UpdateCreditor(caseId, params);
    }

    if (updateDebtor?.status === 200) {
      showToast(updateDebtor?.data?.message, "success");
      GetCaseDetails(id);
      setDebtorContactDetails(initialContact);
      handleClose();
    } else {
      showToast(
        updateDebtor?.response?.data?.message || updateDebtor?.data?.message,
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
          justifyContent: "right",
          marginBottom: "1rem",
        }}
      >
        <Close />
      </Box>
      <Grid container>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <Typography
            sx={{ fontFamily: "Nunito", fontWeight: "600" }}
            gutterBottom
          >
            Contact Details
          </Typography>
        </Grid>

        <Grid
          container
          sx={{ overflow: "auto", ...ScrollbarStyles, height: "55vh" }}
        >
          <Grid container item xs={12}>
            <Grid container item xs={12}>
              <PaymentsTextFields
                type="text"
                label="Name*"
                placeHolderValue="Enter Name"
                width={smallScreen ? "100%" : "97%"}
                value={debtorContactDetails.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <PaymentsTextFields
                type="text"
                label="Title*"
                placeHolderValue="Enter Title"
                width={smallScreen ? "100%" : "97%"}
                value={debtorContactDetails.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />

              <MuiPhoneTextField
                label="Phone #*"
                value={debtorContactDetails.phone}
                onChange={(e) =>
                  handleInputChange("phone", formatPhoneNumber(e))
                }
                onKeyDown={handleNumberInputKeyDown}
                error={contactError.phone}
              />

              <PaymentsTextFields
                type="text"
                label="Enter Email*"
                placeHolderValue="Enter Email"
                width={smallScreen ? "100%" : "97%"}
                value={debtorContactDetails.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={emailContactError.email}
              />

              <PaymentsTextFields
                type="text"
                label="Country (Optional)"
                placeHolderValue="Country Name"
                width={smallScreen ? "100%" : "97%"}
                value={debtorContactDetails.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />
              <PaymentsTextFields
                type="text"
                label="State (Optional)"
                placeHolderValue="Enter State"
                width={smallScreen ? "100%" : "97%"}
                value={debtorContactDetails.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
              />
              <PaymentsTextFields
                label="City (Optional)"
                placeHolderValue="Enter City"
                width={smallScreen ? "100%" : "97%"}
                value={debtorContactDetails.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
              <PaymentsTextFields
                type="number"
                label="Zip Code (Optional)"
                placeHolderValue="Enter Zip Code"
                width={smallScreen ? "100%" : "97%"}
                value={debtorContactDetails.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                onKeyDown={handleNumberInput}
              />
            </Grid>
            <Grid
              container
              item
              xs={12}
              md={4}
              sx={{ flexDirection: "column" }}
            >
              <Typography
                sx={{
                  fontWeight: "500",
                  fontFamily: "Nunito",
                  marginLeft: "1rem",
                  color: Colors.DARK_GRAY,
                }}
              >
                {show === "Debtor"
                  ? "Relation with Debtor (Optional)"
                  : "Relation with Creditor (Optional)"}
              </Typography>
              <input
                type="text"
                placeholder="Relation"
                value={debtorContactDetails.relationWithDebtor}
                onChange={(e) =>
                  handleInputChange("relationWithDebtor", e.target.value)
                }
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: smallScreen ? "100%" : "97%",
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          xs={12}
          sx={{ justifyContent: "flex-end", marginTop: "1rem" }}
        >
          <TextButton
            buttonText="Add"
            height="2rem"
            width="6rem"
            disabled={
              !debtorContantHasValue ||
              loading ||
              !areRequiredFieldsFilled() ||
              Object.values(emailContactError).some((error) => error) ||
              Object.values(contactError).some((error) => error)
            }
            onClick={updateDebtorById}
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            loading={loading}
          />
        </Grid>
      </Grid>
    </>
  );
}
