import { Close } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import PaymentsTextFields from "../caseTextField";
import TextButton from "../button";
import { Colors } from "../../config/default";
import Dropdown from "../dropdown";
import { handleNumberInput } from "../../common";
import { encrypt, decrypt, compare } from "n-krypta";

function PaynoteForm({ handleClose, caseData }) {
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [selectedValue, setSelectedValue] = useState("Choose Type");
  const [paynoteForm, setPaynoteForm] = useState({
    number: "",
    routing: "",
    bank: "",
  });

  const menuItems = [
    { label: "checking", value: "checking" },
    { label: "savings", value: "savings" },
  ];

  const validateFields = (field, value) => {
    if (field === "routing") {
      if (value.length !== 9) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          routing: "Routing Number must be 9 digits",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          routing: "",
        }));
      }
    }

    if (field === "number") {
      if (value.length !== 15) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          number: "Account Number must be 15 digits",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          number: "",
        }));
      }
    }
  };

  const handleInputChange = (field, value) => {
    setPaynoteForm({
      ...paynoteForm,
      [field]: value,
    });
    validateFields(field, value);
  };

  useEffect(() => {
    const { number, routing, bank } = paynoteForm;
    const hasErrors = Object.values(errors).some((error) => error !== "");
    const allFieldsFilled =
      number && routing && bank && selectedValue !== "Choose Type";

    setIsButtonDisabled(!(allFieldsFilled && !hasErrors));
  }, [paynoteForm, errors, selectedValue]);

  const creditorId = caseData?.creditor?._id;
  console.log(creditorId, "idddd");
  const { encrypt } = require("n-krypta");

  const securityKey = process.env.REACT_APP_SECURITY_KEY;
  const handleSubmit = () => {
    const encryptedData = {
      number: paynoteForm?.number,
      routing: paynoteForm?.routing,
      type: selectedValue,
      bank: paynoteForm?.bank,
    };

    console.log("Submitted Data:", encrypt(encryptedData, securityKey));
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
          sx={{
            fontWeight: "600",
            fontFamily: "Nunito",
          }}
        >
          Bank Information
        </Typography>
        <Close onClick={handleClose} />
      </Box>

      <Grid container>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-around",
            // border: "1px solid red",
          }}
        >
          <PaymentsTextFields
            type="number"
            label="Account Number*"
            placeHolderValue="Enter Account Number"
            width="98%"
            value={paynoteForm?.number}
            onChangeFunction={(e) =>
              handleInputChange("number", e.target.value)
            }
            onKeyDown={handleNumberInput}
            error={errors?.number}
            border={errors?.number ? "2px solid red" : "1px solid transparent"}
          />

          <PaymentsTextFields
            type="number"
            label="Routing Number*"
            placeHolderValue="Enter Routing Number"
            width="98%"
            value={paynoteForm?.routing}
            onChangeFunction={(e) =>
              handleInputChange("routing", e.target.value)
            }
            onKeyDown={handleNumberInput}
            error={errors?.routing}
            border={errors?.routing ? "2px solid red" : "1px solid transparent"}
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Grid item xs={12} md={3.9}>
            <Typography
              sx={{
                fontWeight: "500",
                fontFamily: "Nunito",
                marginLeft: "1rem",
                color: Colors.DARK_GRAY,
              }}
            >
              Type*
            </Typography>
            <Dropdown
              menuWidth="4rem"
              width="98%"
              height="2.5rem"
              menuItems={menuItems}
              backgroundColor={Colors.BG_LIGHT_GRAY}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
            />
          </Grid>

          <PaymentsTextFields
            type="text"
            label="Bank Name*"
            placeHolderValue="Enter Bank Name"
            width="98%"
            value={paynoteForm?.bank}
            onChangeFunction={(e) => handleInputChange("bank", e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={12}
        md={11.1}
        sx={{
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <TextButton
          buttonText="SAVE"
          height="2rem"
          width="8rem"
          marginRight="1rem"
          onClick={handleSubmit}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          disabled={isButtonDisabled}
        />
      </Grid>
    </>
  );
}

export default PaynoteForm;
