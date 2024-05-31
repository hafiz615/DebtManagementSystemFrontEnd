import * as React from "react";
import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Grid, Typography, Box } from "@mui/material";
import { Colors } from "../../config/default";
import Dropdown from "../dropdown";
import TextButton from "../button";
import RowConfigForm from "./paymentsAuthsNotificationRow";
import { SaveSettings } from "../../services/services";
import { useToast } from "../../toast/toastContext";

export default function SettingsAccordion({
  failedAuthorizations,
  successfulAuthorizations,
  failedPayments,
  successPayments,
  upcomingPayments,
  retryInterval,
  authorizationInterval,
  notificationTemplates,
  setfailedAuthorizations,
  setSuccessfulAuthorizations,
  setFailedPayments,
  setSuccessPayments,
  setUpcomingPayments,
  setRetryInterval,
  setAuthorizationInterval,
}) {
  const { showToast } = useToast();

  const retry = [
    { label: "Days", value: "days" },
    { label: "Hours", value: "hours" },
  ];

  const [retryAuthIntervalUnit, setRetryAuthIntervalUnit] = useState(
    retryInterval.failedAuthorization.unit
  );
  const [retryPaymentIntervalUnit, setRetryPaymentIntervalUnit] = useState(
    retryInterval.failedPayment.unit
  );
  const [templates, setTemplates] = useState({});

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
          ...prevData.failedAuthorization,
          value: value,
        },
      }));
    } else if (field === "auth_retries") {
      setRetryInterval((prevData) => ({
        ...prevData,
        failedAuthorization: {
          ...prevData.failedAuthorization,
          maxRetry: value,
        },
      }));
    } else if (field === "payment_value") {
      setRetryInterval((prevData) => ({
        ...prevData,
        failedPayment: {
          ...prevData.failedPayment,
          value: value,
        },
      }));
    } else if (field === "payment_retries") {
      setRetryInterval((prevData) => ({
        ...prevData,
        failedPayment: {
          ...prevData.failedPayment,
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
    const result = {};

    for (const [key, value] of Object.entries(notificationTemplates)) {
      result[key] = value.map((template) => {
        return { label: template.templateId, value: template.templateId };
      });
    }
    setTemplates(result);
  }, [notificationTemplates]);

  React.useEffect(() => {
    setRetryInterval((prevData) => ({
      failedAuthorization: {
        ...prevData.failedAuthorization,
        unit: retryAuthIntervalUnit,
      },
      failedPayment: {
        ...prevData.failedPayment,
        unit: retryPaymentIntervalUnit,
      },
    }));
  }, [retryAuthIntervalUnit, retryPaymentIntervalUnit]);

  return (
    <>
      <Accordion
        defaultExpanded
        sx={{
          width: "100%",
          borderRadius: "1rem !important",
          backgroundColor: Colors.WHITE,
          boxShadow: "none",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            fontFamily: "Nunito",
            fontWeight: "600",
            borderTopRightRadius: "1rem",
            borderTopLeftRadius: "1rem",
            borderBottomLeftRadius: "1rem",
            borderBottomRightRadius: "1rem",
            borderBottom: "1px solid #EAEBEB",
          }}
        >
          Payments & Authorizations
        </AccordionSummary>
        <AccordionDetails>
          <Grid container item sx={{ marginTop: "1rem" }}>
            <Grid
              item
              xs={12}
              lg={6.5}
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "35%",
                }}
              >
                <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
                  Notifications
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "7.5%",
                }}
              >
                <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
                  Email
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "7.5%",
                }}
              >
                <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
                  SMS
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "35%",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                  }}
                >
                  Template
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} lg={5}>
              <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
                Send To
              </Typography>
            </Grid>
          </Grid>
          <Grid container item sx={{ marginTop: "1rem" }}>
            <RowConfigForm
              title={"Failed Authorizations"}
              data={failedAuthorizations}
              setData={setfailedAuthorizations}
              menuItems={templates}
            />
            <RowConfigForm
              title={"Successful Authorizations"}
              data={successfulAuthorizations}
              setData={setSuccessfulAuthorizations}
              menuItems={templates}
            />
            <RowConfigForm
              title={"Failed Payments"}
              data={failedPayments}
              setData={setFailedPayments}
              menuItems={templates}
            />
            <RowConfigForm
              title={"Successful Payments"}
              data={successPayments}
              setData={setSuccessPayments}
              menuItems={templates}
            />
            <RowConfigForm
              title={"Upcoming Payments"}
              data={upcomingPayments}
              setData={setUpcomingPayments}
              menuItems={templates}
            />
          </Grid>

          <hr></hr>

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
                  width: "20%",
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
                  width: "5%",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
                value={retryInterval.failedAuthorization.value}
                onChange={(e) =>
                  handleIntervalInputChange("auth_value", e.target.value)
                }
              />
              <Dropdown
                menuItems={retry}
                placeholder="Choose Interval"
                backgroundColor={Colors.BG_LIGHT_GRAY}
                hoverColor={Colors.BG_LIGHT_GRAY}
                width="15%"
                selectedValue={retryInterval.failedAuthorization.unit}
                setSelectedValue={setRetryAuthIntervalUnit}
              />
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
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
                  width: "5%",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
                value={retryInterval.failedAuthorization.maxRetry}
                onChange={(e) =>
                  handleIntervalInputChange("auth_retries", e.target.value)
                }
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
                  width: "20%",
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
                  width: "5%",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
                value={retryInterval.failedPayment.value}
                onChange={(e) =>
                  handleIntervalInputChange("payment_value", e.target.value)
                }
              />
              <Dropdown
                menuItems={retry}
                placeholder="Choose Interval"
                backgroundColor={Colors.BG_LIGHT_GRAY}
                hoverColor={Colors.BG_LIGHT_GRAY}
                width="15%"
                selectedValue={retryInterval.failedPayment.unit}
                setSelectedValue={setRetryPaymentIntervalUnit}
              />
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
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
                  width: "5%",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
                value={retryInterval.failedPayment.maxRetry}
                onChange={(e) =>
                  handleIntervalInputChange("payment_retries", e.target.value)
                }
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
                value={authorizationInterval.custom.value}
                onChange={(e) =>
                  handleAuthIntervalInputChange("custom", e.target.value)
                }
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
                  width: "15%",
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
                value={authorizationInterval.fortnightly.value}
                onChange={(e) =>
                  handleAuthIntervalInputChange("fortnightly", e.target.value)
                }
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
                value={authorizationInterval.daily.value}
                onChange={(e) =>
                  handleAuthIntervalInputChange("daily", e.target.value)
                }
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
                  width: "15%",
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
                value={authorizationInterval.monthly.value}
                onChange={(e) =>
                  handleAuthIntervalInputChange("monthly", e.target.value)
                }
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
                value={authorizationInterval.weekly.value}
                onChange={(e) =>
                  handleAuthIntervalInputChange("weekly", e.target.value)
                }
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
        </AccordionDetails>
      </Accordion>
    </>
  );
}
