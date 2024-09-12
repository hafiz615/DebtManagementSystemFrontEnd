import React, { useState } from "react";
import {
  Typography,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";

import { useDispatch } from "react-redux";
import { sign_In } from "../redux/action/action";

import Button from "./button";
import { Colors } from "../config/default";
import { useNavigate } from "react-router-dom";
import { VerifyLink, UpdateUserPassword } from "../services/services";
import { useToast } from "../toast/toastContext";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

export default function VerifyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const currentURL = window.location.href;
  const url = new URL(currentURL);
  const tokenValue = url?.searchParams?.get("token");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 8) {
      setPasswordError(
        "Password must be at least 8 characters long and include special characters"
      );
    } else if (
      /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
        e.target.value
      )
    ) {
      setPasswordError("");
    } else {
      setPasswordError(
        "Password must contain at least one special character, one lowercase letter, and one uppercase letter"
      );
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value.length < 8) {
      setConfirmPasswordError(
        "Password must be at least 8 characters long and include special characters"
      );
    } else if (
      /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
        e.target.value
      )
    ) {
      setConfirmPasswordError("");
    } else {
      setConfirmPasswordError(
        "Password must contain at least one special character, one lowercase letter, and one uppercase letter"
      );
    }
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
        localStorage.clear();
        dispatch(sign_In(updateUserPassword?.data?.data));
        const token = updateUserPassword?.data?.data?.token;
        localStorage.setItem("token", token);
        navigate("/home");
      } else {
        showToast(updateUserPassword?.response?.data?.message, "error");
      }
    } else {
      const errorMessage = verifyUser?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const isButtonDisabled =
    password !== confirmPassword ||
    password === "" ||
    !!passwordError ||
    !!confirmPasswordError;
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
          background: Colors.GRADIENT,
          fontFamily: "Nunito",
        }}
      >
        Verify User
      </Typography>
      <TextField
        type={showPassword ? "text" : "password"}
        id="password"
        label="Password"
        variant="standard"
        value={password}
        onChange={handlePasswordChange}
        sx={{
          marginBottom: "1rem",
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {passwordError && <FormHelperText error>{passwordError}</FormHelperText>}
      <TextField
        type={showConfirmPassword ? "text" : "password"}
        id="confirmPassword"
        label="Confirm Password"
        variant="standard"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        sx={{
          marginBottom: "1rem",
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={handleClickShowConfirmPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {confirmPasswordError && (
        <FormHelperText error>{confirmPasswordError}</FormHelperText>
      )}

      <Button
        disabled={isButtonDisabled}
        loading={loading}
        buttonText="SAVE"
        onClick={handleFormSubmit}
        marginTop="2rem"
        height="3rem"
        loginFont="600"
      />
    </Grid>
  );
}
