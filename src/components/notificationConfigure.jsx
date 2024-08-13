import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { styled } from "@mui/material/styles";
import { Colors } from "../config/default";
import {
  Box,
  CircularProgress,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import Dropdown from "./dropdown";
import Checkboxes from "./checkBox";
import { FONT_SIZE_LARGE } from "../constants/appConstants";
import TextButton from "./button";
import {
  GetEvents,
  UpdateNotificationConfiguration,
} from "../services/services";
import { useToast } from "../toast/toastContext";

const StyledAccordion = styled(Accordion)({
  "&:before": {
    display: "none",
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
  borderBottom: "1px solid #EAEBEB",
});

const StyledAccordionDetails = styled(AccordionDetails)({
  borderTop: "none",
});

export default function NotificationConfiguration({ data }) {
  const [selectedValue, setSelectedValue] = useState("");
  const [allEvents, setAllEvents] = useState([]);
  const [anchorElNew, setAnchorElNew] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { showToast } = useToast();

  const [userSettings, setUserSettings] = useState([]);

  const getEvents = async () => {
    const resEvents = await GetEvents("all");
    if (resEvents?.status === 200) {
      setAllEvents(resEvents?.data?.data);
    }
  };

  const allExistingEvents =
    allEvents &&
    allEvents.map((item) => ({
      label: item?.label
        ? item.label.charAt(0).toUpperCase() + item.label.slice(1)
        : "",
      value: item?.value,
    }));

  const getConfiguration = async () => {
    if (selectedValue) {
      setLoading(true);
      const params = selectedValue;
      const resNotificationConf = await GetEvents(params);
      if (resNotificationConf?.status === 200) {
        setUserSettings(resNotificationConf?.data?.data?.userPermission);
        showToast(resNotificationConf?.data?.message, "success");
      } else {
        const errorMessage = resNotificationConf?.response?.data?.message;
        showToast(errorMessage, "error");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    getConfiguration();
  }, [selectedValue]);

  const allEmailTemplates = data
    ?.filter((item) => item?.type === "email")
    ?.map((item) => ({
      label: item?.templateId,
      value: item?.templateId,
    }));

  const allSmsTemplates = data
    ?.filter((item) => item?.type === "sms")
    ?.map((item) => ({
      label: item?.templateId,
      value: item?.templateId,
    }));

  const fontStyling = {
    fontSize: FONT_SIZE_LARGE,
    fontFamily: "Nunito",
    color: Colors.BLACK,
    fontWeight: "700",
  };

  const boxStyling = { display: "flex", alignItems: "center" };

  const handleEmailTemplateChange = (role, value) => {
    setUserSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.role === role ? { ...setting, email_template: value } : setting
      )
    );
  };

  const handleSmsTemplateChange = (role, value) => {
    setUserSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.role === role ? { ...setting, sms_template: value } : setting
      )
    );
  };

  const handleEmailCheckChange = (role, checked) => {
    setUserSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.role === role ? { ...setting, email_allowed: checked } : setting
      )
    );
  };

  const handleSmsCheckChange = (role, checked) => {
    setUserSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.role === role ? { ...setting, sms_allowed: checked } : setting
      )
    );
  };

  const handleSave = async () => {
    setButtonLoading(true);
    const payload = {
      value: selectedValue,
      userPermission: userSettings,
    };
    const resSave = await UpdateNotificationConfiguration(payload);
    if (resSave?.status === 200) {
      showToast(resSave?.data?.message, "success");
    } else {
      const errorMessage = resSave?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setButtonLoading(false);
  };

  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Notification Configuration
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        {loading ? (
          <Grid
            container
            sx={{
              justifyContent: "center",
              alignItems: "center",
              height: "30vh",
            }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Grid xs={12} sx={{ mt: "1rem" }}>
            <Dropdown
              menuWidth="16rem"
              menuItems={allExistingEvents}
              placeholder="Events"
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
              width="16rem"
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
            />
            {userSettings?.map((item) => (
              <Grid
                key={item.role}
                container
                xs={12}
                sx={{ mt: "10px", gap: "2rem", alignItems: "center" }}
              >
                <Typography sx={{ ...fontStyling, width: "20%" }}>
                  {item?.role}
                </Typography>
                <Box sx={boxStyling}>
                  <Checkboxes
                    checked={item?.email_allowed}
                    handleCheckChange={(e) =>
                      handleEmailCheckChange(item.role, e.target.checked)
                    }
                  />
                  <Typography sx={fontStyling}>Email</Typography>
                </Box>
                <Dropdown
                  menuWidth="16rem"
                  menuItems={allEmailTemplates}
                  placeholder="Templates"
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                  width="16rem"
                  selectedValue={item?.email_template}
                  setSelectedValue={(value) =>
                    handleEmailTemplateChange(item.role, value)
                  }
                />

                <Box sx={boxStyling}>
                  <Checkboxes
                    checked={item?.sms_allowed}
                    handleCheckChange={(e) =>
                      handleSmsCheckChange(item.role, e.target.checked)
                    }
                  />
                  <Typography sx={fontStyling}>SMS</Typography>
                </Box>
                <Dropdown
                  menuWidth="16rem"
                  menuItems={allSmsTemplates}
                  placeholder="Templates"
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                  width="16rem"
                  selectedValue={item?.sms_template}
                  setSelectedValue={(value) =>
                    handleSmsTemplateChange(item.role, value)
                  }
                />
              </Grid>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "right",
                marginTop: "1rem",
              }}
            >
              <TextButton
                buttonText="Save"
                height="2rem"
                width="8rem"
                onClick={handleSave}
                backgroundColor={Colors.SKY_BLUE}
                hoverColor={Colors.SKY_BLUE}
                loading={buttonLoading}
              />
            </div>
          </Grid>
        )}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
