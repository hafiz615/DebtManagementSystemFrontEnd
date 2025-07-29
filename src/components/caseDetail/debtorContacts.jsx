import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Grid, Box } from "@mui/material";
import { Close } from "@mui/icons-material";

import PaymentsTextFields from "../caseTextField";
import { useToast } from "./../../toast/toastContext";

import useMediaQuery from "@mui/material/useMediaQuery";
import { Colors } from "../../config/default";
import { PhoneValidation } from "../../constants/appConstants";
import TextButton from "../button";

import { UpdateCreditor, UpdateDebtor } from "../../services/services";
import { isEmailValid, handleNumberInput } from "../../common";

export default function DebtorContacts({
  GetCaseDetails,
  handleClose,
  show,
  caseId,
  item,
}) {
  const { id } = useParams();
  const { showToast } = useToast();
  const { PHONE_NO_CHARACTERS, PHONE_NO_ERROR } = PhoneValidation;
  const [loading, setLoading] = useState(false);
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");

  const initialContact = {
    name: item?.name || "",
    phone: item?.phone || "",
    email: item?.email || "",
    _id: item?._id,
  };

  const [debtorContactDetails, setDebtorContactDetails] =
    useState(initialContact);

  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleInputChange = (field, value) => {
    const updatedContact = { ...debtorContactDetails };
    updatedContact[field] = value;
    setDebtorContactDetails(updatedContact);

    if (field === "email") {
      setEmailError(
        value.trim() === "" || isEmailValid(value) ? "" : "Email must be valid"
      );
    }

    if (field === "phone") {
      setPhoneError(
        value.trim() === "" || value.length === PHONE_NO_CHARACTERS
          ? ""
          : PHONE_NO_ERROR
      );
    }
  };

  const isAnyFieldFilled = () => {
    const { name, phone, email } = debtorContactDetails;
    return name.trim() !== "" || phone.trim() !== "" || email.trim() !== "";
  };

  const updateDebtorById = async (type) => {
    setLoading(true);
    let contactToUpdate = { ...debtorContactDetails };

    if (show === "Debtor" || show === "Creditor") {
      delete contactToUpdate._id;
    }

    const params = {
      contact: contactToUpdate,
    };

    let updateDebtor;
    if (show === "Debtor" || show === "EditDebtor") {
      updateDebtor = await UpdateDebtor(caseId, params, type);
    } else {
      updateDebtor = await UpdateCreditor(caseId, params, type);
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
        sx={{
          cursor: "pointer",
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
        <Close onClick={handleClose} />
      </Box>

      <Grid
        item
        xs={12}
        sx={{
          marginTop: "1rem",
          borderRadius: "10px",
          backgroundColor: Colors.WHITE,
          padding: "1rem",
        }}
      >
        <Grid container item xs={12}>
          <Grid container item xs={12} md={12}>
            <PaymentsTextFields
              type="text"
              label="Name"
              placeHolderValue="Enter Name"
              width={smallScreen ? "100%" : "97%"}
              value={debtorContactDetails?.name}
              onChangeFunction={(e) =>
                handleInputChange("name", e.target.value)
              }
            />
            <PaymentsTextFields
              type="text"
              label="Phone #"
              placeHolderValue="Enter Phone Number"
              width={smallScreen ? "100%" : "97%"}
              value={debtorContactDetails?.phone || ""}
              onChangeFunction={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                handleInputChange("phone", numericValue);
              }}
              error={phoneError}
              onKeyDown={handleNumberInput}
            />
            <PaymentsTextFields
              type="text"
              label="Enter Email"
              placeHolderValue="Enter Email"
              width={smallScreen ? "100%" : "97%"}
              value={debtorContactDetails?.email}
              onChangeFunction={(e) =>
                handleInputChange("email", e.target.value)
              }
              error={emailError}
            />
          </Grid>
        </Grid>

        <Grid container sx={{ justifyContent: "flex-end", marginTop: "1rem" }}>
          <TextButton
            buttonText={
              show === "EditDebtor" || show === "EditCreditor" ? "Save" : "Add"
            }
            height="2rem"
            width="6rem"
            disabled={
              !isAnyFieldFilled() ||
              loading ||
              phoneError !== "" ||
              emailError !== ""
            }
            onClick={() =>
              updateDebtorById(
                show === "EditDebtor" || show === "EditCreditor"
                  ? "edit"
                  : "add"
              )
            }
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            loading={loading}
          />
        </Grid>
      </Grid>
    </>
  );
}
