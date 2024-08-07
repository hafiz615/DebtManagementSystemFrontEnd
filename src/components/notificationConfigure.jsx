// Asd123<>?
import React, { useState } from "react";
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
import CheckboxAutocomplete from "./checkboxAutocomplete";
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
  const [template, setTemplate] = useState("");
  const [userTypes, setUserTypes] = useState([]);
  const [smsChecked, setSmsChecked] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);

  const allEvents = [
    { label: "Payment Successful", value: "Payment Successful" },
    { label: "Payment Failure", value: "Payment Failure" },
    { label: "Authorization Successful", value: "Authorization Successful" },
    { label: "Authorization Failure", value: "Authorization Failure" },
  ];

  const allUserTypes = ["Admin", "Negotiator", "User", "asdahjhsd"];

  const allTemplates = data?.email?.map((item) => ({
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
          {selectedValue && (
            <>
              <Grid
                container
                xs={12}
                sx={{ mt: "1rem", gap: "2rem", alignItems: "center" }}
              >
                <Dropdown
                  menuWidth="16rem"
                  menuItems={allTemplates}
                  placeholder="Templates"
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                  width="16rem"
                  selectedValue={template}
                  setSelectedValue={setTemplate}
                />
                <CheckboxAutocomplete
                  options={allUserTypes}
                  multiSelect={userTypes}
                  setMultiselect={setUserTypes}
                  placeholder="User Types"
                  width="16rem"
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  paddingLeft="10px"
                />
                <Box sx={boxStyling}>
                  <Checkboxes
                    checked={emailChecked}
                    handleCheckChange={(e) => setEmailChecked(e.target.checked)}
                  />
                  <Typography sx={fontStyling}>Email</Typography>
                </Box>
                <Box sx={boxStyling}>
                  <Checkboxes
                    checked={smsChecked}
                    handleCheckChange={(e) => setSmsChecked(e.target.checked)}
                  />
                  <Typography sx={fontStyling}>SMS</Typography>
                </Box>
              </Grid>
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
                  // onClick={handleSave}
                  backgroundColor={Colors.SKY_BLUE}
                  hoverColor={Colors.SKY_BLUE}
                />
              </div>
            </>
          )}
        </Grid>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
