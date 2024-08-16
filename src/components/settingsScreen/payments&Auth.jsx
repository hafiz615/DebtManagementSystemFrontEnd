import * as React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Grid, Typography } from "@mui/material";
import { Colors } from "../../config/default";
import Dropdown from "../dropdown";
import TextButton from "../button";

import { SaveSettings } from "../../services/services";
import { useToast } from "../../toast/toastContext";
import useMediaQuery from "@mui/material/useMediaQuery";

import { styled } from "@mui/material/styles";
import { handleNumberInput } from "../../common";
const StyledAccordion = styled(Accordion)({
  "&:before": {
    display: "none", // Remove the default line
  },
  width: "100%",
  borderRadius: "1rem !important",
  backgroundColor: Colors.WHITE,
  marginTop: "1rem",
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

export default function SettingsAccordion({
  failedAuthorizations,
  successfulAuthorizations,
  failedPayments,
  successPayments,
  upcomingPayments,
  retryInterval,
  authorizationInterval,
  setRetryInterval,
  setAuthorizationInterval,
}) {
  const { showToast } = useToast();

  const retry = [
    { label: "Days", value: "days" },
    { label: "Hours", value: "hours" },
  ];
  const settings = useSelector(
    (state) => state?.permissions?.permissions?.settings
  );

  const [retryAuthIntervalUnit, setRetryAuthIntervalUnit] = useState(
    retryInterval?.failedAuthorization?.unit
  );
  const [retryPaymentIntervalUnit, setRetryPaymentIntervalUnit] = useState(
    retryInterval?.failedPayment?.unit
  );

  const saveAuthsPaymentsConfig = async () => {
    const settings = {
      paymentsAuthorizations: {
        failedAuthorizations: failedAuthorizations,
        successfulAuthorizations: successfulAuthorizations,
        failedPayments: failedPayments,
        successPayments: successPayments,
        upcomingPayments: upcomingPayments,
        retryInterval: retryInterval,
        authorizationInterval: authorizationInterval,
      },
    };
    const settingsSubmission = await SaveSettings(settings);
    if (settingsSubmission?.status === 200) {
      showToast(settingsSubmission?.data?.message, "success");
    } else {
      const errorMessage = settingsSubmission?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  const handleIntervalInputChange = (field, value) => {
    if (field === "auth_value") {
      setRetryInterval((prevData) => ({
        ...prevData,
        failedAuthorization: {
          ...prevData?.failedAuthorization,
          value: value,
        },
      }));
    } else if (field === "auth_retries") {
      setRetryInterval((prevData) => ({
        ...prevData,
        failedAuthorization: {
          ...prevData?.failedAuthorization,
          maxRetry: value,
        },
      }));
    } else if (field === "payment_value") {
      setRetryInterval((prevData) => ({
        ...prevData,
        failedPayment: {
          ...prevData?.failedPayment,
          value: value,
        },
      }));
    } else if (field === "payment_retries") {
      setRetryInterval((prevData) => ({
        ...prevData,
        failedPayment: {
          ...prevData?.failedPayment,
          maxRetry: value,
        },
      }));
    }
  };
  const handleAuthIntervalInputChange = (field, value) => {
    setAuthorizationInterval((prevIntervals) => ({
      ...prevIntervals,
      [field]: {
        ...prevIntervals[field],
        value: value,
      },
    }));
  };

  React.useEffect(() => {
    setRetryInterval((prevData) => ({
      failedAuthorization: {
        ...prevData?.failedAuthorization,
        unit: retryAuthIntervalUnit,
      },
      failedPayment: {
        ...prevData?.failedPayment,
        unit: retryPaymentIntervalUnit,
      },
    }));
  }, [retryAuthIntervalUnit, retryPaymentIntervalUnit]);
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");

  return (
    <>
      <StyledAccordion defaultExpanded sx={{ overflowX: "auto" }}>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          Payments & Authorizations
        </StyledAccordionSummary>

        <StyledAccordionDetails sx={{ width: { xs: "130vw", sm: "auto" } }}>
          <Grid container item sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                color: Colors.BLACK,
                paddingLeft: "1.5rem",
              }}
            >
              Retry Interval
            </Typography>

            <Grid
              container
              item
              xs={12}
              sx={{ marginTop: "1rem", display: "flex", alignItems: "center" }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: smallScreen ? "30%" : "20%",
                }}
              >
                Failed Authorizations
              </Typography>
              <input
                type="number"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: smallScreen ? "10%" : "5%",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
                disabled={!settings?.editAuthorizationInterval}
                value={retryInterval?.failedAuthorization?.value}
                onChange={(e) =>
                  handleIntervalInputChange("auth_value", e.target.value)
                }
                onKeyDown={handleNumberInput}
              />
              <Dropdown
                menuWidth="11.3rem"
                menuItems={retry}
                placeholder="Choose Interval"
                backgroundColor={Colors.BG_LIGHT_GRAY}
                hoverColor={Colors.BG_LIGHT_GRAY}
                width={smallScreen ? "17%" : "15%"}
                height="2.5rem"
                selectedValue={retryInterval?.failedAuthorization?.unit}
                disabled={!settings?.editAuthorizationInterval}
                setSelectedValue={setRetryAuthIntervalUnit}
              />
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: smallScreen ? "10px" : "1.5rem",
                }}
              >
                Max Retry
              </Typography>
              <input
                type="number"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: smallScreen ? "10%" : "5%",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
                disabled={!settings?.editAuthorizationInterval}
                value={retryInterval?.failedAuthorization?.maxRetry}
                onChange={(e) =>
                  handleIntervalInputChange("auth_retries", e.target.value)
                }
                onKeyDown={handleNumberInput}
              />
            </Grid>
            <Grid
              container
              item
              xs={12}
              sx={{ marginTop: "1rem", display: "flex", alignItems: "center" }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: smallScreen ? "30%" : "20%",
                }}
              >
                Failed Payment
              </Typography>
              <input
                type="number"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: smallScreen ? "10%" : "5%",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
                disabled={!settings?.editAuthorizationInterval}
                value={retryInterval?.failedPayment?.value}
                onChange={(e) =>
                  handleIntervalInputChange("payment_value", e.target.value)
                }
                onKeyDown={handleNumberInput}
              />
              <Dropdown
                menuWidth="11.3rem"
                menuItems={retry}
                placeholder="Choose Interval"
                backgroundColor={Colors.BG_LIGHT_GRAY}
                hoverColor={Colors.BG_LIGHT_GRAY}
                width={smallScreen ? "17%" : "15%"}
                height="2.5rem"
                selectedValue={retryInterval?.failedPayment?.unit}
                setSelectedValue={setRetryPaymentIntervalUnit}
                disabled={!settings?.editAuthorizationInterval}
              />
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: smallScreen ? "10px" : "1.5rem",
                }}
              >
                Max Retry
              </Typography>
              <input
                type="number"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: smallScreen ? "10%" : "5%",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
                disabled={!settings?.editAuthorizationInterval}
                value={retryInterval?.failedPayment?.maxRetry}
                onChange={(e) =>
                  handleIntervalInputChange("payment_retries", e.target.value)
                }
                onKeyDown={handleNumberInput}
              />
            </Grid>
          </Grid>
          <hr></hr>
          <Grid container item sx={{ marginTop: "1rem", marginBottom: "2rem" }}>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                color: Colors.BLACK,
                paddingLeft: "1.5rem",
              }}
            >
              Authorization Interval
            </Typography>

            <Grid
              container
              item
              xs={12}
              sx={{ marginTop: "1rem", display: "flex", alignItems: "center" }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "15%",
                }}
              >
                Custom
              </Typography>
              <input
                type="number"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "10%",
                  marginLeft: "1rem",
                }}
                disabled={!settings?.editRetryInterval}
                value={authorizationInterval?.custom?.value}
                onChange={(e) =>
                  handleAuthIntervalInputChange("custom", e.target.value)
                }
                onKeyDown={handleNumberInput}
              />

              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "15%",
                }}
              >
                Hours
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: { xs: "22%", sm: "15%" },
                }}
              >
                Fortnightly
              </Typography>
              <input
                type="number"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "10%",
                  marginLeft: "1rem",
                }}
                disabled={!settings?.editRetryInterval}
                value={authorizationInterval?.fortnightly?.value}
                onChange={(e) =>
                  handleAuthIntervalInputChange("fortnightly", e.target.value)
                }
                onKeyDown={handleNumberInput}
              />
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                }}
              >
                Days
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={12}
              sx={{ marginTop: "1rem", display: "flex", alignItems: "center" }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "15%",
                }}
              >
                Daily
              </Typography>
              <input
                type="number"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "10%",
                  marginLeft: "1rem",
                }}
                disabled={!settings?.editRetryInterval}
                value={authorizationInterval?.daily?.value}
                onChange={(e) =>
                  handleAuthIntervalInputChange("daily", e.target.value)
                }
                onKeyDown={handleNumberInput}
              />

              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "15%",
                }}
              >
                Hours
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: { xs: "22%", sm: "15%" },
                }}
              >
                Monthly
              </Typography>
              <input
                type="number"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "10%",
                  marginLeft: "1rem",
                }}
                disabled={!settings?.editRetryInterval}
                value={authorizationInterval?.monthly?.value}
                onChange={(e) =>
                  handleAuthIntervalInputChange("monthly", e.target.value)
                }
                onKeyDown={handleNumberInput}
              />
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                }}
              >
                Days
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={12}
              sx={{ marginTop: "1rem", display: "flex", alignItems: "center" }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "15%",
                }}
              >
                Weekly
              </Typography>
              <input
                type="number"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "10%",
                  marginLeft: "1rem",
                }}
                disabled={!settings?.editRetryInterval}
                value={authorizationInterval?.weekly?.value}
                onChange={(e) =>
                  handleAuthIntervalInputChange("weekly", e.target.value)
                }
                onKeyDown={handleNumberInput}
              />

              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "15%",
                }}
              >
                Days
              </Typography>
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
              onClick={saveAuthsPaymentsConfig}
            />
          </Grid>
        </StyledAccordionDetails>
      </StyledAccordion>
    </>
  );
}
