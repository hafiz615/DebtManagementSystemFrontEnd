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
import {
  isEmailValid,
  handleNumberInput,
  handleNumberInputKeyDown,
} from "../../common";

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
    title: item?.title || "",
    phone: item?.phone || "",
    email: item?.email || "",
    state: item?.state || "",
    city: item?.city || "",
    zipCode: item?.zipCode || "",
    relationWithDebtor:
      item?.relationWithDebtor || item?.relationWithCreditor || "",
    _id: item?._id,
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

  const areRequiredFieldsFilled = () => {
    return (
      debtorContactDetails.name.trim() !== "" &&
      debtorContactDetails.title.trim() !== "" &&
      debtorContactDetails.phone.trim() !== "" &&
      debtorContactDetails.email.trim() !== ""
    );
  };

  const updateDebtorById = async (type) => {
    setLoading(true);
    let contactToUpdate = { ...debtorContactDetails };

    // Rename the property if show is "Creditor"
    if (show === "Creditor" || show === "EditCreditor") {
      const { relationWithDebtor, ...rest } = debtorContactDetails;
      contactToUpdate = { ...rest, relationWithCreditor: relationWithDebtor };
    }
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
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ fontFamily: "Nunito", fontWeight: "600" }}
            gutterBottom
          >
            Contact Details
          </Typography>
        </Grid>

        <Grid container item xs={12}>
          <Grid container item xs={12} md={8}>
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
              label="Title"
              placeHolderValue="Enter Title"
              width={smallScreen ? "100%" : "97%"}
              value={debtorContactDetails?.title}
              onChangeFunction={(e) =>
                handleInputChange("title", e.target.value)
              }
            />
            <PaymentsTextFields
              type="text"
              label="Phone #*"
              placeHolderValue="Enter Phone Number"
              width="100%"
              value={debtorContactDetails?.phone || ""}
              onChangeFunction={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                handleInputChange("phone", numericValue);
              }}
              error={contactError?.phone}
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
              error={emailContactError?.email}
            />

            <PaymentsTextFields
              type="text"
              label="State (Optional)"
              placeHolderValue="Enter State"
              width={smallScreen ? "100%" : "97%"}
              value={debtorContactDetails?.state}
              onChangeFunction={(e) =>
                handleInputChange("state", e.target.value)
              }
            />
            <PaymentsTextFields
              label="City (Optional)"
              placeHolderValue="Enter City"
              width={smallScreen ? "100%" : "97%"}
              value={debtorContactDetails?.city}
              onChangeFunction={(e) =>
                handleInputChange("city", e.target.value)
              }
            />
            <PaymentsTextFields
              type="number"
              label="Zip Code (Optional)"
              placeHolderValue="Enter Zip Code"
              width={smallScreen ? "100%" : "97%"}
              value={debtorContactDetails?.zipCode}
              onChangeFunction={(e) =>
                handleInputChange("zipCode", e.target.value)
              }
              onKeyDown={handleNumberInput}
            />
          </Grid>
          <Grid container item xs={12} md={4} sx={{ flexDirection: "column" }}>
            <Typography
              sx={{
                fontWeight: "500",
                fontFamily: "Nunito",
                marginLeft: "1rem",
                color: Colors.DARK_GRAY,
              }}
            >
              {show === "Debtor" || show === "EditDebtor"
                ? "Relation with Debtor (Optional)"
                : "Relation with Creditor (Optional)"}
            </Typography>
            <input
              type="text"
              placeholder="Relation"
              value={debtorContactDetails?.relationWithDebtor}
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
        <Grid container sx={{ justifyContent: "flex-end", marginTop: "1rem" }}>
          <TextButton
            buttonText={
              show === "EditDebtor" || show === "EditCreditor" ? "Edit" : "Add"
            }
            height="2rem"
            width="6rem"
            disabled={
              !debtorContantHasValue ||
              loading ||
              !areRequiredFieldsFilled() ||
              Object.values(emailContactError).some((error) => error) ||
              Object.values(contactError).some((error) => error)
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
