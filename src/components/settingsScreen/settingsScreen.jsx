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
import { PAGE_HEIGHT } from "../../constants/appConstants";
import ScrollbarStyles from "../customScroll";
import CaseStatuses from "./caseStatuses";
import PipelineAccordion from "./pipelineAccordion";
import RoleAndPermission from "./roleAndPermission";

export default function SettingsScreen() {
  const navigate = useNavigate();
  const settings = useSelector(
    (state) => state?.permissions?.permissions?.settings
  );
  const [failedAuthorizations, setfailedAuthorizations] = useState({
    email: false,
    sms: false,
    emailTemplate: "",
    smsTemplate: "",
    sendTo: {
      admin: false,
      manager: false,
      negotiator: false,
      debtor: false,
      creditor: false,
    },
  });
  const [successfulAuthorizations, setSuccessfulAuthorizations] = useState({
    email: false,
    sms: false,
    emailTemplate: "",
    smsTemplate: "",
    sendTo: {
      admin: false,
      manager: false,
      negotiator: false,
      debtor: false,
      creditor: false,
    },
  });
  const [failedPayments, setFailedPayments] = useState({
    email: false,
    sms: false,
    emailTemplate: "",
    smsTemplate: "",
    sendTo: {
      admin: false,
      manager: false,
      negotiator: false,
      debtor: false,
      creditor: false,
    },
  });
  const [successPayments, setSuccessPayments] = useState({
    email: false,
    sms: false,
    emailTemplate: "",
    smsTemplate: "",
    sendTo: {
      admin: false,
      manager: false,
      negotiator: false,
      debtor: false,
      creditor: false,
    },
  });
  const [upcomingPayments, setUpcomingPayments] = useState({
    email: false,
    sms: false,
    emailTemplate: "",
    smsTemplate: "",
    sendTo: {
      admin: false,
      manager: false,
      negotiator: false,
      debtor: false,
      creditor: false,
    },
  });
  const [retryInterval, setRetryInterval] = useState({
    failedAuthorization: { unit: "days", value: 0, maxRetry: 0, retryCount: 0 },
    failedPayment: { unit: "hours", value: 0, maxRetry: 0, retryCount: 0 },
  });
  const [authorizationInterval, setAuthorizationInterval] = useState({
    custom: { unit: "hours", value: 0 },
    daily: { unit: "hours", value: 0 },
    weekly: { unit: "days", value: 0 },
    fortnightly: { unit: "days", value: 0 },
    monthly: { unit: "days", value: 0 },
  });
  const [notificationTemplates, setNotificationTemplates] = useState({
    email: [],
    sms: [],
  });
  const [customFields, setCustomFields] = useState([]);
  const [templates, setTemplates] = useState({});
  const [loading, setLoading] = useState(false);

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
    setfailedAuthorizations(
      allSettings?.data?.data?.paymentsAuthorizations?.failedAuthorizations
    );
    setSuccessfulAuthorizations(
      allSettings?.data?.data?.paymentsAuthorizations?.successfulAuthorizations
    );
    setFailedPayments(
      allSettings?.data?.data?.paymentsAuthorizations?.failedPayments
    );
    setSuccessPayments(
      allSettings?.data?.data?.paymentsAuthorizations?.successPayments
    );
    setUpcomingPayments(
      allSettings?.data?.data?.paymentsAuthorizations?.upcomingPayments
    );
    setRetryInterval(
      allSettings?.data?.data?.paymentsAuthorizations?.retryInterval
    );
    setAuthorizationInterval(
      allSettings?.data?.data?.paymentsAuthorizations?.authorizationInterval
    );
    setNotificationTemplates(allSettings?.data?.data?.notificationTemplates);
    setCustomFields(allSettings?.data?.data?.customFields);
    const result = {};

    for (const [key, value] of Object.entries(notificationTemplates)) {
      result[key] = value.map((template) => {
        return { label: template?.templateId, value: template?.templateId };
      });
    }
    setTemplates(result);
    setLoading(false);
  };

  useEffect(() => {
    getSettings();
  }, []);

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
          width: { xs: "65vw", sm: "auto" },
        }}
      >
        <SettingsAccordion
          failedAuthorizations={failedAuthorizations}
          successfulAuthorizations={successfulAuthorizations}
          failedPayments={failedPayments}
          successPayments={successPayments}
          upcomingPayments={upcomingPayments}
          retryInterval={retryInterval}
          authorizationInterval={authorizationInterval}
          notificationTemplates={notificationTemplates}
          templates={templates}
          {...{
            setfailedAuthorizations,
            setSuccessfulAuthorizations,
            setFailedPayments,
            setSuccessPayments,
            setUpcomingPayments,
            setRetryInterval,
            setAuthorizationInterval,
          }}
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
        {settings?.viewCustomFields && (
          <CustomFieldsAccordion
            customFields={customFields}
            refreshData={refreshData}
          />
        )}

        <PasswordAccordion />
        {settings?.viewCaseStatuses && <CaseStatuses />}

        {settings?.viewPipeline && <PipelineAccordion />}

        <RoleAndPermission />
      </Grid>
    </Grid>
  );
}
