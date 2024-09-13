import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { Typography, TextField, Grid, FormHelperText } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../config/default";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_SMALL,
  LoginPage,
} from "../constants/appConstants";

import { useToast } from "../toast/toastContext";
import Button from "./button";
import { ForgotPasswordRes } from "../services/services";

const ForgotPassword = ({ setShowForgotPassword }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [timer, setTimer] = useState(0);
  const [isResend, setIsResend] = useState(false);
  const smallScreen = useMediaQuery("(min-width:250px) and (max-width:900px)");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!e.target.value.trim()) {
      setEmailError("Email is required");
    } else if (
      !e.target.value.includes("@") ||
      !e.target.value.includes(".co")
    ) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isButtonDisabled) {
      handleSubmit();
    }
  };
  const { INPUT_EMAIL_LABEL } = LoginPage;

  const isButtonDisabled =
    !email.trim() || !email.includes("@") || !email.includes(".co");

  const handleSubmit = async () => {
    setLoading(true);
    const params = { email: email };
    const forgotPassRes = await ForgotPasswordRes(params);
    if (forgotPassRes?.status === 200) {
      showToast(forgotPassRes?.data?.message, "success");
      setTimer(30);
      setIsResend(true);
      // backToLogin();
    } else {
      const errorMessage = forgotPassRes?.response?.data?.message;
      showToast(errorMessage || forgotPassRes?.message, "error");
    }
    setLoading(false);
  };
  const backToLogin = async () => {
    setShowForgotPassword(false);
  };
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && isResend) {
      setIsResend(true); // Allow resend after timer completes
    }
    return () => clearTimeout(countdown); // Cleanup timer on component unmount
  }, [timer]);
  return (
    <Grid
      item
      xs={10}
      sm={6}
      lg={8.5}
      sx={{
        display: "flex",
        width: { xs: "80%", md: "auto" },
        flexDirection: "column",
        backgroundColor: smallScreen ? Colors.WHITE : "",
        padding: smallScreen ? "16px  12px" : "",
        borderRadius: smallScreen ? "10px" : "",
      }}
    >
      {!smallScreen && (
        <Typography
          sx={{
            fontSize: "2.5rem",
            fontWeight: "700",
            marginBottom: "2rem",
            color: Colors.NAVY_BLUE,
            fontFamily: "Nunito",
          }}
        >
          Forgot Password
        </Typography>
      )}

      <TextField
        id="standard-basic"
        label={INPUT_EMAIL_LABEL}
        variant="standard"
        sx={{
          marginBottom: "1rem",
          "& .MuiInputBase-input": {
            fontSize: smallScreen ? FONT_SIZE_SMALL : FONT_SIZE_LARGE,
            fontFamily: "Nunito",
          },
        }}
        value={email}
        onChange={handleEmailChange}
        onKeyDown={handleKeyDown}
      />
      {emailError && <FormHelperText error>{emailError}</FormHelperText>}
      {timer > 0 && (
        <Typography
          sx={{
            fontSize: ".8rem",
            fontWeight: "700",
            color: Colors.NAVY_BLUE,
            fontFamily: "Nunito",
            textAlign: "right",
          }}
        >
          ({timer})
        </Typography>
      )}
      <Grid container item sx={{ display: "flex", flexDirection: "column" }}>
        <Button
          buttonText={isResend ? "RESEND" : "SEND"}
          disabled={isButtonDisabled || (isResend && timer > 0)}
          onClick={handleSubmit}
          loading={loading}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          marginTop={smallScreen ? "1rem" : "2rem"}
          height={smallScreen ? "2rem" : "3rem"}
          loginFont="600"
        />
        <Button
          buttonText="CANCEL"
          onClick={backToLogin}
          backgroundColor={Colors.DIM_LIGHT_GRAY}
          hoverColor={Colors.DIM_LIGHT_GRAY}
          marginTop={smallScreen ? "1rem" : "2rem"}
          height={smallScreen ? "2rem" : "3rem"}
          loginFont="600"
        />
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
