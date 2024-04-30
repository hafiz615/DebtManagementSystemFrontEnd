import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Typography, TextField, Grid } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Button from "./button";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const isFormEmpty = () => {
    return !name || !email || !password;
  };

  const navigate = useNavigate();
  const handleSignUpForm = () => {
    navigate("/dashboard");
  };

  return (
    <Grid
      item
      xs={8.5}
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{
          fontSize: "40px",
          fontWeight: "500",
          marginBottom: "2rem",
        }}
      >
        Sign Up
      </Typography>
      <TextField
        id="name"
        label="Name"
        variant="standard"
        sx={{ marginBottom: "1rem" }}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <TextField
        id="email"
        label="Email"
        variant="standard"
        sx={{ marginBottom: "1rem" }}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />

      <FormControl variant="standard">
        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
        <Input
          id="standard-adornment-password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
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
      </FormControl>
      <Button
        buttonText="Sign Up"
        disabled={isFormEmpty()}
        onClick={handleSignUpForm}
      />

      <Typography
        sx={{
          textAlign: "center",
          marginTop: "1rem",
          fontWeight: "400",
          fontSize: { xs: "15px", lg: "20px" },
          color: "#555555",
        }}
      >
        Already have an account?
        <span
          style={{
            fontWeight: "700",
            color: "#000000",
            cursor: "pointer",
          }}
        >
          {" "}
          Login
        </span>
      </Typography>
    </Grid>
  );
}

export default SignUp;
