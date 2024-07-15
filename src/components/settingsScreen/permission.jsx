import React from "react";
import { Typography, Grid, Box } from "@mui/material";
import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../../constants/appConstants";
import { Colors } from "../../config/default";
import BasicSwitches from "./basicSwitches";

export default function Permission({
  role,
  general,
  settingsPermissions,
  analyticsPermissions,
  setGeneralData,
  setSettingsData,
  setAnalyticsData,
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
          fontFamily: "Nunito",
          fontWeight: "700",
        }}
      >
        {role} Permissions
      </Typography>

      <Grid container xs={12} sx={{ marginTop: "1rem" }}>
        <Typography
          sx={{
            fontSize: FONT_SIZE_XL,
            fontFamily: "Nunito",
            fontWeight: "700",
          }}
        >
          General Permissions
        </Typography>
        <Grid container item xs={12}>
          {general &&
            Object?.entries(general)?.map(([key, value], index) => (
              <Grid
                key={index}
                item
                xs={12}
                lg={3.8}
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
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      fontSize: FONT_SIZE_LARGE,
                    }}
                  >
                    {key}
                  </Typography>
                </Box>
                <Box sx={{ marginLeft: "auto" }}>
                  <BasicSwitches
                    checked={value}
                    onChange={() => handleGeneralToggle(key)}
                  />
                </Box>
              </Grid>
            ))}
        </Grid>
      </Grid>

      <Grid container xs={12} sx={{ marginTop: "1rem" }}>
        <Typography
          sx={{
            fontSize: FONT_SIZE_XL,
            fontFamily: "Nunito",
            fontWeight: "700",
          }}
        >
          Settings Permissions
        </Typography>
        <Grid container item xs={12}>
          {settingsPermissions &&
            Object?.entries(settingsPermissions)?.map(([key, value], index) => (
              <Grid
                key={index}
                item
                xs={12}
                lg={3.8}
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
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      fontSize: FONT_SIZE_LARGE,
                    }}
                  >
                    {key}
                  </Typography>
                </Box>
                <Box sx={{ marginLeft: "auto" }}>
                  <BasicSwitches
                    checked={value}
                    onChange={() => handleSettingsToggle(key)}
                  />
                </Box>
              </Grid>
            ))}
        </Grid>
      </Grid>

      <Grid container xs={12} sx={{ marginTop: "1rem" }}>
        <Typography
          sx={{
            fontSize: FONT_SIZE_XL,
            fontFamily: "Nunito",
            fontWeight: "700",
          }}
        >
          Analytics Permissions
        </Typography>
        <Grid container item xs={12}>
          {analyticsPermissions &&
            Object?.entries(analyticsPermissions)?.map(
              ([key, value], index) => (
                <Grid
                  key={index}
                  item
                  xs={12}
                  lg={3.8}
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
                        fontFamily: "Nunito",
                        fontWeight: "500",
                        fontSize: FONT_SIZE_LARGE,
                      }}
                    >
                      {key}
                    </Typography>
                  </Box>
                  <Box sx={{ marginLeft: "auto" }}>
                    <BasicSwitches
                      checked={value}
                      onChange={() => handleAnalyticsToggle(key)}
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
