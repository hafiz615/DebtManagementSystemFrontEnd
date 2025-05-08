import { Close } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import PaymentsTextFields from "../caseTextField";
import TextButton from "../button";
import { Colors } from "../../config/default";
import { handleNumberInput } from "../../common";
import { useToast } from "../../toast/toastContext";
import { GetBankInfo, TokenizeAccount } from "../../services/bankServices";
import { AddAccountSeamlessPaynote } from "../../services/services";

function SeamLessChex({ setOpenDialog, debtorId }) {
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [paynoteForm, setPaynoteForm] = useState({
    firstName: "",
    lastName: "",
    number: "",
    routing: "",
  });

  const validateFields = (field, value) => {
    if (field === "routing") {
      if (value.length !== 9) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          routing: "Routing Number must be 9 digits",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, routing: "" }));
      }
    }

    if (field === "number") {
      if (value.length < 4 || value.length > 17) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          number: "Bank Account must be between 4 and 17 characters.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, number: "" }));
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
    const { firstName, lastName, number, routing } = paynoteForm;
    const hasErrors = Object.values(errors).some((error) => error !== "");
    const allFieldsFilled = firstName && lastName && number && routing;

    setIsButtonDisabled(!(allFieldsFilled && !hasErrors));
  }, [paynoteForm, errors]);

  const handleSubmit = async () => {
    setLoading(true);
    const { firstName, lastName, number, routing } = paynoteForm;

    try {
      const bankInfoResponse = await GetBankInfo(routing);
      if (bankInfoResponse?.status !== 200) {
        showToast("Invalid Routing Number", "error");
        setLoading(false);
        return;
      }
      const tokenPayload = {
        first_name: firstName,
        last_name: lastName,
        bank_account: number,
        bank_routing: routing,
        store: "fristChoice",
      };

      const tokenizeResponse = await TokenizeAccount(tokenPayload);
      if (tokenizeResponse?.status === 200) {
        const token = tokenizeResponse?.data?.tokenization?.token;

        if (token) {
          const params = {
            platform: "Seamlesschex",
            data: token,
            bank_routing: routing,
          };

          const submitResponse = await AddAccountSeamlessPaynote(
            params,
            debtorId
          );
          if (submitResponse?.status === 200) {
            showToast(submitResponse?.data?.message, "success");
            setOpenDialog(false);
          } else {
            const errorMessage = submitResponse?.response?.data?.message;
            showToast(errorMessage, "error");
          }
        } else {
          showToast("Token not found in response", "error");
        }
      } else {
        showToast("Account tokenization failed", "error");
      }
    } catch (error) {
      showToast("An unexpected error occurred", "error");
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
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontFamily: "Nunito",
            fontSize: "18px",
          }}
        >
          Seamless Chex Bank Information
        </Typography>
        <Close
          onClick={() => setOpenDialog(false)}
          sx={{ cursor: "pointer" }}
        />
      </Box>

      <Grid container>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <PaymentsTextFields
            type="text"
            label="First Name*"
            placeHolderValue="Enter First Name"
            width="100%"
            value={paynoteForm?.firstName}
            onChangeFunction={(e) =>
              handleInputChange("firstName", e.target.value)
            }
          />

          <PaymentsTextFields
            type="text"
            label="Last Name*"
            placeHolderValue="Enter Last Name"
            width="100%"
            value={paynoteForm?.lastName}
            onChangeFunction={(e) =>
              handleInputChange("lastName", e.target.value)
            }
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
          <PaymentsTextFields
            type="number"
            label="Account Number*"
            placeHolderValue="Enter Account Number"
            width="100%"
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
            width="100%"
            value={paynoteForm?.routing}
            onChangeFunction={(e) =>
              handleInputChange("routing", e.target.value)
            }
            onKeyDown={handleNumberInput}
            error={errors?.routing}
            border={errors?.routing ? "2px solid red" : "1px solid transparent"}
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "2rem",
        }}
      >
        <TextButton
          buttonText="SAVE"
          height="2.5rem"
          width="8rem"
          onClick={handleSubmit}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={loading}
          disabled={isButtonDisabled}
        />
      </Box>
    </>
  );
}

export default SeamLessChex;
