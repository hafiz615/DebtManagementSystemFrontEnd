// Asd123<>?
import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import { Typography, Grid } from "@mui/material";
import PasswordField from "./passwordField";
import TextButton from "../button";
import { ResetUserPassword } from "../../services/services";
import { useToast } from "../../toast/toastContext";
import { styled } from "@mui/material/styles";
const StyledAccordion = styled(Accordion)({
  "&:before": {
    display: "none", // Remove the default line
  },
  width: "100%",
  borderRadius: "1rem !important",
  backgroundColor: Colors.WHITE,
  marginBottom: "1rem",
  boxShadow: "none",
});
const StyledAccordionSummary = styled(AccordionSummary)({
  fontFamily: "Nunito",
  fontWeight: "600",
  borderTopRightRadius: "1rem",
  borderTopLeftRadius: "1rem",
  borderBottomLeftRadius: "1rem",
  borderBottomRightRadius: "1rem",
  borderBottom: "1px solid #EAEBEB", // Remove bottom border
});

const StyledAccordionDetails = styled(AccordionDetails)({
  borderTop: "none", // Remove top border
});
export default function PasswordAccordion() {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [passwordStrengthError, setPasswordStrengthError] = useState("");

  const handleResetPassword = async () => {
    const resetPWD = await ResetUserPassword({
      currentPassword: currentPassword,
      newPassword: verifyPassword,
    });
    if (resetPWD?.status === 200) {
      showToast(resetPWD?.data?.message, "success");
    } else {
      const errorMessage = resetPWD?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  useEffect(() => {
    if (newPassword && verifyPassword && newPassword !== verifyPassword) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }

    if (newPassword && !validatePassword(newPassword)) {
      setPasswordStrengthError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      );
    } else {
      setPasswordStrengthError("");
    }
  }, [newPassword, verifyPassword]);

  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Password
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Grid
          container
          sx={{
            paddingLeft: "2rem",
            paddingRight: "2rem",
          }}
        >
          <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
            Reset Password
          </Typography>
          <Grid
            container
            item
            xs={12}
            sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                width: { xs: "40%", lg: "15%" },
                color: Colors.DARK_GRAY,
              }}
            >
              Current Password
            </Typography>
            <PasswordField
              label="Current Password"
              password={currentPassword}
              setPassword={setCurrentPassword}
            />
          </Grid>
          <Grid
            container
            item
            xs={12}
            sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                width: { xs: "40%", lg: "15%" },
                color: Colors.DARK_GRAY,
              }}
            >
              New Password
            </Typography>
            <PasswordField
              label="New Password"
              password={newPassword}
              setPassword={setNewPassword}
              helperText={passwordStrengthError}
              error={Boolean(passwordStrengthError)}
            />
          </Grid>
          <Grid
            container
            item
            xs={12}
            sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                width: { xs: "40%", lg: "15%" },
                color: Colors.DARK_GRAY,
              }}
            >
              Confirm Password
            </Typography>
            <PasswordField
              label="Verify Password"
              password={verifyPassword}
              setPassword={setVerifyPassword}
              helperText={passwordMatchError}
              error={Boolean(passwordMatchError)}
            />
          </Grid>
        </Grid>
        <Grid
          container
          item
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <TextButton
            buttonText="SAVE"
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            paddingLeft="2rem"
            paddingRight="2rem"
            height="2rem"
            marginRight="1rem"
            disabled={Boolean(passwordMatchError || passwordStrengthError)}
            onClick={handleResetPassword}
          />
        </Grid>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  );
};
