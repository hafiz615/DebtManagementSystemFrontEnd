import React, { useState } from "react";
import { Typography, TextField, Grid } from "@mui/material";
import Button from "./button";
import { Colors } from "../config/default";
import { useNavigate } from "react-router-dom";
import { VerifyLink, UpdateUserPassword } from "../services/services";
import { useToast } from "../toast/toastContext";

export default function VerifyProfile() {
  const navigate = useNavigate();
  // State variables to hold text field values
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const currentURL = window.location.href;
  const url = new URL(currentURL);
  const tokenValue = url?.searchParams?.get("token");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    const verifyUser = await VerifyLink(tokenValue);

    if (verifyUser?.status === 200) {
      const params = {
        password: password,
        email: verifyUser?.data?.data?.email,
      };
      const updateUserPassword = await UpdateUserPassword(params, tokenValue);
      if (updateUserPassword?.status === 200) {
        showToast(updateUserPassword?.data?.message, "success");
        navigate("/");
      } else {
        showToast(updateUserPassword?.response?.data?.message, "error");
      }
    } else {
      const errorMessage = verifyUser?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  return (
    <Grid
      item
      lg={8.5}
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{
          fontSize: "2.5rem",
          fontWeight: "700",
          marginBottom: "2rem",
          color: Colors.NAVY_BLUE,
          fontFamily: "Nunito",
        }}
      >
        Verify User
      </Typography>
      <TextField
        id="password"
        label="Password"
        variant="standard"
        value={password}
        onChange={handlePasswordChange}
        sx={{
          marginBottom: "1rem",
        }}
      />
      <TextField
        id="confirmPassword"
        label="Confirm Password"
        variant="standard"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        sx={{
          marginBottom: "1rem",
        }}
      />

      <Button
        loading={loading}
        buttonText="Save"
        onClick={handleFormSubmit}
        marginTop="2rem"
        height="3rem"
      />
    </Grid>
  );
}
