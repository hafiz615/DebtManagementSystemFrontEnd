import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { Grid, Typography } from "@mui/material";
import { Colors } from "../../config/default";
import SettingsAccordion from "./payments&Auth";
import NotificationTemplatesTabs from "./notifications";
import CustomFieldsAccordion from "./customFields";
import PasswordAccordion from "./passwordAccord";
import { GetAllSettings } from "../../services/services";
import { PAGE_HEIGHT, settingsHeading } from "../../constants/appConstants";
import ScrollbarStyles from "../customScroll";
import CaseStatuses from "./caseStatuses";
import PipelineAccordion from "./pipelineAccordion";
import RoleAndPermission from "./roleAndPermission";
import NotificationConfiguration from "../notificationConfigure";
import JustificationModal from "./justificationModal";
import AddUrlsAccordion from "./addUrlsAccordion";
import EmailIdentityAccordion from "./emailIdentityAccordion";

export default function SettingsScreen() {
  const navigate = useNavigate();
  const settings = useSelector(
    (state) => state?.permissions?.permissions?.settings
  );

  const [retryInterval, setRetryInterval] = useState({
    failedAuthorization: { unit: "days", value: 0, maxRetry: 0, retryCount: 0 },
    failedPayment: { unit: "days", value: 0, maxRetry: 0, retryCount: 0 },
  });
  const [authorizationInterval, setAuthorizationInterval] = useState({
    custom: { unit: "hours", value: 0 },
    daily: { unit: "hours", value: 0 },
    weekly: { unit: "days", value: 0 },
    fortnightly: { unit: "days", value: 0 },
    monthly: { unit: "days", value: 0 },
  });
  const [notificationTemplates, setNotificationTemplates] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectJustification, setSelectJustification] = useState({});

  const getSettings = async () => {
    setLoading(true);
    const allSettings = await GetAllSettings();
    if (
      allSettings?.response?.status === 401 ||
      allSettings?.response?.status === 403
    ) {
      localStorage.clear();
      navigate("/");
    }
    if (allSettings?.status === 200) {
      setRetryInterval(
        allSettings?.data?.data?.paymentsAuthorizations?.retryInterval
      );
      setAuthorizationInterval(
        allSettings?.data?.data?.paymentsAuthorizations
          ?.authorizationInterval || {
          custom: { unit: "hours", value: 0 },
          daily: { unit: "hours", value: 0 },
          weekly: { unit: "days", value: 0 },
          fortnightly: { unit: "days", value: 0 },
          monthly: { unit: "days", value: 0 },
        }
      );
      setNotificationTemplates(allSettings?.data?.data?.notificationTemplates);
      setCustomFields(allSettings?.data?.data?.customFields);
      setSelectJustification(allSettings?.data?.data?.justification);
      setLoading(false);
    }
  };

  useEffect(() => {
    getSettings();
  }, [settings]);

  const refreshData = () => {
    getSettings();
  };

  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        paddingLeft: "2rem",
        paddingRight: "2rem",
        height: PAGE_HEIGHT,
        overflowY: "auto",
        ...ScrollbarStyles,
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
          {settingsHeading}
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{
          marginTop: "1rem",
          marginBottom: "1.5rem",
          width: { xs: "65vw", sm: "auto" },
        }}
      >
        <SettingsAccordion
          retryInterval={retryInterval}
          authorizationInterval={authorizationInterval}
          setRetryInterval={setRetryInterval}
          setAuthorizationInterval={setAuthorizationInterval}
          loading={loading}
        />
        {settings?.viewNotificationTemplates && (
          <NotificationTemplatesTabs
            notificationTemplates={notificationTemplates}
            setNotificationTemplates={setNotificationTemplates}
            getSettings={getSettings}
            loading={loading}
            setLoading={setLoading}
          />
        )}
        <NotificationConfiguration data={notificationTemplates} />

        {settings?.viewCustomFields && (
          <CustomFieldsAccordion
            customFields={customFields}
            refreshData={refreshData}
          />
        )}

        <PasswordAccordion />
        <JustificationModal
          getSettings={getSettings}
          selectJustification={selectJustification}
        />
        <EmailIdentityAccordion />
        <AddUrlsAccordion />
        {settings?.viewCaseStatuses && <CaseStatuses />}

        {settings?.viewPipeline && <PipelineAccordion />}

        <RoleAndPermission />
      </Grid>
    </Grid>
  );
}
