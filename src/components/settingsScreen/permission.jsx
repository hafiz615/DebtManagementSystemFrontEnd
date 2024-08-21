import React from "react";
import { Typography, Grid, Box } from "@mui/material";
import {
  FONT_FAMILY,
  FONT_SIZE_LARGE,
  FONT_SIZE_XL,
  FONT_WEIGHT_HEADING,
  FONT_WEIGHT_MEDIUM,
} from "../../constants/appConstants";
import { Colors } from "../../config/default";
import BasicSwitches from "./basicSwitches";
import { convertCamelCaseToTitle } from "../../common";
import {
  generalPermissionsHeading,
  settingsPermissionsHeading,
  analyticsPermissionsHeading,
} from "../../constants/appConstants";

export default function Permission({
  role,
  general,
  settingsPermissions,
  analyticsPermissions,
  setGeneralData,
  setSettingsData,
  setAnalyticsData,
  disableToggleButtons,
}) {
  const handleGeneralToggle = (key) => {
    setGeneralData((prevData) => ({
      ...prevData,
      [key]: !prevData[key],
    }));
  };
  const handleSettingsToggle = (key) => {
    setSettingsData((prevData) => ({
      ...prevData,
      [key]: !prevData[key],
    }));
  };
  const handleAnalyticsToggle = (key) => {
    setAnalyticsData((prevData) => ({
      ...prevData,
      [key]: !prevData[key],
    }));
  };

  return (
    <>
      <Typography
        sx={{
          fontSize: FONT_SIZE_XL,
          fontFamily: FONT_FAMILY,
          fontWeight: FONT_WEIGHT_HEADING,
        }}
      >
        {role} Permissions
      </Typography>

      <Grid container sx={{ marginTop: "1rem" }}>
        <Typography
          sx={{
            fontSize: FONT_SIZE_XL,
            fontFamily: FONT_FAMILY,
            fontWeight: FONT_WEIGHT_HEADING,
          }}
        >
          {generalPermissionsHeading}
        </Typography>
        <Grid container item>
          {general &&
            Object?.entries(general)?.map(([key, value], index) => (
              <Grid
                key={index}
                item
                xs={12}
                lg={2.8}
                sx={{
                  alignItems: "center",
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  borderRadius: "5px",
                  display: "flex",
                  padding: "1rem",
                  margin: "0.5rem",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontFamily: FONT_FAMILY,
                      fontWeight: FONT_WEIGHT_MEDIUM,
                      fontSize: FONT_SIZE_LARGE,
                    }}
                  >
                    {convertCamelCaseToTitle(key)}
                  </Typography>
                </Box>
                <Box sx={{ marginLeft: "auto" }}>
                  <BasicSwitches
                    checked={value}
                    onChange={() => handleGeneralToggle(key)}
                    disableToggleButtons={disableToggleButtons}
                  />
                </Box>
              </Grid>
            ))}
        </Grid>
      </Grid>

      <Grid container sx={{ marginTop: "1rem" }}>
        <Typography
          sx={{
            fontSize: FONT_SIZE_XL,
            fontFamily: FONT_FAMILY,
            fontWeight: FONT_WEIGHT_HEADING,
          }}
        >
          {settingsPermissionsHeading}
        </Typography>
        <Grid container item>
          {settingsPermissions &&
            Object?.entries(settingsPermissions)?.map(([key, value], index) => (
              <Grid
                key={index}
                item
                xs={12}
                lg={2.8}
                sx={{
                  alignItems: "center",
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  borderRadius: "5px",
                  display: "flex",
                  padding: "1rem",
                  margin: "0.5rem",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontFamily: FONT_FAMILY,
                      fontWeight: FONT_WEIGHT_MEDIUM,
                      fontSize: FONT_SIZE_LARGE,
                    }}
                  >
                    {convertCamelCaseToTitle(key)}
                  </Typography>
                </Box>
                <Box sx={{ marginLeft: "auto" }}>
                  <BasicSwitches
                    checked={value}
                    onChange={() => handleSettingsToggle(key)}
                    disableToggleButtons={disableToggleButtons}
                  />
                </Box>
              </Grid>
            ))}
        </Grid>
      </Grid>

      <Grid container sx={{ marginTop: "1rem" }}>
        <Typography
          sx={{
            fontSize: FONT_SIZE_XL,
            fontFamily: FONT_FAMILY,
            fontWeight: FONT_WEIGHT_HEADING,
          }}
        >
          {analyticsPermissionsHeading}
        </Typography>
        <Grid container item xs={12}>
          {analyticsPermissions &&
            Object?.entries(analyticsPermissions)?.map(
              ([key, value], index) => (
                <Grid
                  item
                  xs={12}
                  lg={2.8}
                  key={index}
                  sx={{
                    alignItems: "center",
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    borderRadius: "5px",
                    display: "flex",
                    padding: "1rem",
                    margin: "0.5rem",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: FONT_FAMILY,
                        fontWeight: FONT_WEIGHT_MEDIUM,
                        fontSize: FONT_SIZE_LARGE,
                      }}
                    >
                      {convertCamelCaseToTitle(key)}
                    </Typography>
                  </Box>
                  <Box sx={{ marginLeft: "auto" }}>
                    <BasicSwitches
                      checked={value}
                      onChange={() => handleAnalyticsToggle(key)}
                      disableToggleButtons={disableToggleButtons}
                    />
                  </Box>
                </Grid>
              )
            )}
        </Grid>
      </Grid>
    </>
  );
}
