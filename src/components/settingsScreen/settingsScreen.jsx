// import React, { useEffect } from "react";

import { Grid, Typography } from "@mui/material";
import { Colors } from "../../config/default";
import SettingsAccordion from "./payments&Auth";
import NotificationTemplatesTabs from "./notifications";
import CustomFieldsAccordion from "./customFields";
import PasswordAccordion from "./passwordAccord";
// import { GetAllSettings } from "../../services/services";

export default function SettingsScreen() {
  // const getSettings = async () => {
  //   const allSettings = await GetAllSettings();
  //   console.log(allSettings, "allSettings");

  // };
  // useEffect(() => {
  //   getSettings();
  // });
  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        paddingLeft: "2rem",
        paddingRight: "2rem",
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          marginTop: "1.5rem",
        }}
      >
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "2rem",
            fontFamily: "Nunito",
            color: Colors.BLACK,
          }}
        >
          Settings
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{
          marginTop: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <SettingsAccordion />
        <NotificationTemplatesTabs />
        <CustomFieldsAccordion />
        <PasswordAccordion />
      </Grid>
    </Grid>
  );
}
