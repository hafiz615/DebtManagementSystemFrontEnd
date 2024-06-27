import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sign_In } from "../redux/action/action";

import { Typography, TextField, Grid, FormHelperText } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../config/default";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_SMALL,
  LoginPage,
} from "../constants/appConstants";
import { SignIn } from "../services/services";
import { useToast } from "../toast/toastContext";
import Button from "./button";

function Login() {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const smallScreen = useMediaQuery("(min-width:250px) and (max-width:900px)");

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    const auth = localStorage.getItem("token");
    if (auth) {
      navigate("/home");
    }
  }, []);
  const navigate = useNavigate();

  const handleLoginForm = async () => {
    setLoading(true);
    const params = { email: email, password: password };
    const login = await SignIn(params);

    if (login?.status === 200) {
      dispatch(sign_In(login?.data?.data));
      const token = login?.data?.data?.token;
      localStorage.setItem("token", token);
      navigate("/home");
    } else {
      const errorMessage = login?.response?.data?.message;
      showToast(errorMessage || login?.message, "error");
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

  const {
    LOGIN_HEADING,
    FORGOT_PASSWORD,
    LOGIN_BUTTON_TEXT,
    INPUT_PASSWORD_LABEL,
    INPUT_EMAIL_LABEL,
  } = LoginPage;

  return (
    <>
      {smallScreen && (
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "2rem",
            color: Colors.WHITE,
            fontFamily: "Nunito",
            float: "left",
          }}
        >
          {LOGIN_HEADING}
        </Typography>
      )}
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
            {LOGIN_HEADING}
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
        />
        {emailError && <FormHelperText error>{emailError}</FormHelperText>}

        <FormControl variant="standard">
          <InputLabel htmlFor="standard-adornment-password">
            {INPUT_PASSWORD_LABEL}
          </InputLabel>
          <Input
            className="no-autofill-bg"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            style={{
              fontSize: smallScreen ? FONT_SIZE_SMALL : FONT_SIZE_LARGE,
              fontFamily: "Nunito",
            }}
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
                fontSize: smallScreen ? FONT_SIZE_SMALL : FONT_SIZE_LARGE,
                marginTop: "0.8rem",
                marginBottom: smallScreen ? "0px" : "1.5rem",
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
          marginTop={smallScreen ? "1rem" : "2rem"}
          height={smallScreen ? "2rem" : "3rem"}
          loginFont="600"
        />
      </Grid>
    </>
  );
}

export default Login;
