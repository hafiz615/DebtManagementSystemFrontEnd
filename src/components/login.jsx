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

function Login({ setAuthForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleLogin = () => {
    setAuthForm(false);
  };

  const isFormEmpty = () => {
    return !email || !password;
  };

  const navigate = useNavigate();
  const handleLoginForm = () => {
    console.log({ email, password });
    navigate("/dashboard");
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
          fontSize: "40px",
          fontWeight: "500",
          marginBottom: "2rem",
        }}
      >
        Login
      </Typography>
      <TextField
        id="standard-basic"
        label="Email"
        variant="standard"
        sx={{ marginBottom: "1rem" }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography
            sx={{
              fontWeight: "200",
              fontSize: "15px",
              color: "#555555",
              marginTop: "0.8rem",
              marginBottom: "1.5rem",
            }}
          >
            Forgot Password?
          </Typography>
        </div>
      </FormControl>
      <Button
        buttonText="Login"
        disabled={isFormEmpty()}
        onClick={handleLoginForm}
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
        don’t have an account?
        <span
          style={{
            fontWeight: "700",
            color: "#000000",
            cursor: "pointer",
          }}
          onClick={() => handleLogin()}
        >
          {" "}
          Sign Up
        </span>
      </Typography>
    </Grid>
  );
}

export default Login;
