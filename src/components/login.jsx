import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Typography, TextField, Grid, FormHelperText } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { Colors } from "../config/default";
import { LoginPage } from "../constants/appConstants";
import { SignIn } from "../services/services";
import { useToast } from "../toast/toastContext";
import Button from "./button";

function Login() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  const handleLoginForm = async () => {
    setLoading(true);
    const params = { email: email, password: password };
    const login = await SignIn(params);

    if (login?.status === 200) {
      // showToast(login?.data?.message, "success");
      const token = login?.data?.data?.token;
      localStorage.setItem("token", token);
      navigate("/home");
    } else {
      const errorMessage = login?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

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

  const isButtonDisabled =
    !email.trim() ||
    !email.includes("@") ||
    !email.includes(".co") ||
    password.length < 8 ||
    !/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
      password
    );
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLoginForm();
    }
  };

  const {
    LOGIN_HEADING,
    FORGOT_PASSWORD,
    LOGIN_BUTTON_TEXT,
    INPUT_PASSWORD_LABEL,
    INPUT_EMAIL_LABEL,
  } = LoginPage;

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
        {LOGIN_HEADING}
      </Typography>
      <TextField
        id="standard-basic"
        label={INPUT_EMAIL_LABEL}
        variant="standard"
        sx={{
          marginBottom: "1rem",
        }}
        value={email}
        onChange={handleEmailChange}
      />
      {emailError && <FormHelperText error>{emailError}</FormHelperText>}

      <FormControl variant="standard">
        <InputLabel htmlFor="standard-adornment-password">
          {INPUT_PASSWORD_LABEL}
        </InputLabel>
        <Input
          id="standard-adornment-password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          onKeyPress={handleKeyPress}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        {passwordError && (
          <FormHelperText error>{passwordError}</FormHelperText>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography
            sx={{
              fontWeight: "200",
              fontSize: "15px",
              marginTop: "0.8rem",
              marginBottom: "1.5rem",
              cursor: "pointer",
              fontFamily: "Nunito",
              color: Colors.DARK_GRAY,
            }}
            onClick={() => alert("Forgot Password clicked")}
          >
            {FORGOT_PASSWORD}
          </Typography>
        </div>
      </FormControl>

      <Button
        buttonText={LOGIN_BUTTON_TEXT}
        disabled={isButtonDisabled}
        onClick={handleLoginForm}
        loading={loading}
        marginTop="2rem"
        height="3rem"
      />
    </Grid>
  );
}

export default Login;
