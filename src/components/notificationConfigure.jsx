import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { styled } from "@mui/material/styles";
import { Colors } from "../config/default";
import { Box, Grid, Typography } from "@mui/material";
import Dropdown from "./dropdown";
import Checkboxes from "./checkBox";
import { FONT_SIZE_LARGE } from "../constants/appConstants";
import TextButton from "./button";

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
  const userConfig = {
    admin: {
      emailTemplate: "",
      smsTemplate: "",
      emailChecked: false,
      smsChecked: false,
    },
    negotiator: {
      emailTemplate: "",
      smsTemplate: "",
      emailChecked: false,
      smsChecked: false,
    },
    user: {
      emailTemplate: "",
      smsTemplate: "",
      emailChecked: false,
      smsChecked: false,
    },
    asdahjhsd: {
      emailTemplate: "",
      smsTemplate: "",
      emailChecked: false,
      smsChecked: false,
    },
  };

  const allUserTypes = Object.entries(userConfig)?.map(([key, value]) => key);

  const [userSettings, setUserSettings] = useState(
    allUserTypes?.reduce((userType, index) => {
      userType[index] = {
        emailTemplate: "",
        smsTemplate: "",
        emailChecked: false,
        smsChecked: false,
      };
      return userType;
    }, {})
  );

  const allEvents = [
    { label: "Payment Successful", value: "Payment Successful" },
    { label: "Payment Failure", value: "Payment Failure" },
    { label: "Authorization Successful", value: "Authorization Successful" },
    { label: "Authorization Failure", value: "Authorization Failure" },
  ];

  const allEmailTemplates = data?.email?.map((item) => ({
    label: item?.templateId,
    value: item?.templateId,
  }));

  const allSmsTemplates = data?.email?.map((item) => ({
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

  const handleEmailTemplateChange = (userType, value) => {
    setUserSettings((prevSettings) => ({
      ...prevSettings,
      [userType]: { ...prevSettings[userType], emailTemplate: value },
    }));
  };

  const handleSmsTemplateChange = (userType, value) => {
    setUserSettings((prevSettings) => ({
      ...prevSettings,
      [userType]: { ...prevSettings[userType], smsTemplate: value },
    }));
  };

  const handleEmailCheckChange = (userType, checked) => {
    setUserSettings((prevSettings) => ({
      ...prevSettings,
      [userType]: { ...prevSettings[userType], emailChecked: checked },
    }));
  };

  const handleSmsCheckChange = (userType, checked) => {
    setUserSettings((prevSettings) => ({
      ...prevSettings,
      [userType]: { ...prevSettings[userType], smsChecked: checked },
    }));
  };

  useEffect(() => {
    console.log(selectedValue);
  }, [selectedValue]);

  const handleSave = () => {
    console.log(userSettings);
  };

  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Notification Configuration
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Grid xs={12} sx={{ mt: "1rem" }}>
          <Dropdown
            menuWidth="16rem"
            menuItems={allEvents}
            placeholder="Events"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            width="16rem"
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
          {allUserTypes?.map((userType) => (
            <Grid
              key={userType}
              container
              xs={12}
              sx={{ mt: "4px", gap: "2rem", alignItems: "center" }}
            >
              <Typography sx={{ ...fontStyling, width: "20%" }}>
                {userType}
              </Typography>
              <Box sx={boxStyling}>
                <Checkboxes
                  checked={userSettings[userType]?.emailChecked}
                  handleCheckChange={(e) =>
                    handleEmailCheckChange(userType, e.target.checked)
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
                selectedValue={userSettings[userType]?.emailTemplate}
                setSelectedValue={(value) =>
                  handleEmailTemplateChange(userType, value)
                }
              />

              <Box sx={boxStyling}>
                <Checkboxes
                  checked={userSettings[userType]?.smsChecked}
                  handleCheckChange={(e) =>
                    handleSmsCheckChange(userType, e.target.checked)
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
                selectedValue={userSettings[userType]?.smsTemplate}
                setSelectedValue={(value) =>
                  handleSmsTemplateChange(userType, value)
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
            />
          </div>
        </Grid>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
