import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box, Grid, Typography } from "@mui/material";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Colors } from "../../config/default";
import ListTableDynamic from "../listTableDynamic";
import MuiModels from "../models";

const AntTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: Colors.SKY_BLUE,
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },
    fontWeight: "500",
    color: Colors.DARK_GRAY,
    fontFamily: ["Nunito"].join(","),
    "&:hover": {
      color: Colors.SKY_BLUE,
      opacity: 1,
    },
    "&.Mui-selected": {
      color: Colors.SKY_BLUE,
      fontWeight: "500",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
  })
);
const StyledAccordion = styled(Accordion)({
  "&:before": {
    display: "none", // Remove the default line
  },
  width: "100%",
  borderRadius: "1rem !important",
  backgroundColor: Colors.WHITE,
  marginTop: "1rem",
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
  borderBottom: "1px solid #EAEBEB", // Remove bottom border
});

const StyledAccordionDetails = styled(AccordionDetails)({
  borderTop: "none", // Remove top border
});

export default function NotificationTemplatesTabs({ notificationTemplates }) {
  const TABS = {
    EMAIL: "Email",
    SMS: "SMS",
  };
  const [value, setValue] = useState(TABS.EMAIL);
  const [froalaEditor, setFroalaEditor] = useState("");
  const [htmlData, setHtmlData] = useState(null);
  const [emailTemplateId, setEmailTemplateId] = useState("");
  const [textData, setTextData] = useState(null);
  const [smsTemplateId, setSmsTemplateId] = useState("");
  const headerData = [
    { key: "templateId", heading: "Template ID", width: "10%" },
    { key: "name", heading: "Name", width: "15%" },
    { key: "event", heading: "Event", width: "15%" },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const renderEmailTemplate = (id, data) => {
    setHtmlData(data);
    setEmailTemplateId(id);
  };
  const renderSmsTemplate = (id, data) => {
    setTextData(data);
    setSmsTemplateId(id);
  };
  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Notification Templates
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Box>
          <AntTabs
            value={value}
            onChange={handleChange}
            aria-label="ant example"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              width: "max-content",
            }}
          >
            <AntTab
              sx={{
                bgcolor: Colors.WHITE,
                width: "max-content",
                borderTopLeftRadius: "10px",
                fontWeight: "600",
                height: "3.5rem",
              }}
              label={TABS.EMAIL}
              value={TABS.EMAIL}
            />

            <AntTab
              sx={{
                bgcolor: Colors.WHITE,
                width: "max-content",
                fontWeight: "600",
                height: "3.5rem",
              }}
              label={TABS.SMS}
              value={TABS.SMS}
            />
          </AntTabs>

          <Box
            sx={{
              backgroundColor: Colors.WHITE,
              borderRadius: "10px",
            }}
          >
            {value === TABS.EMAIL && (
              <Grid
                container
                sx={{ justifyContent: "space-between", marginTop: "1rem" }}
              >
                <Grid
                  container
                  item
                  xs={12}
                  lg={6}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
                    Templates
                  </Typography>

                  <MuiModels
                    show="froalaEditor"
                    froalaEditorButton="Add New"
                    froalaEditor={froalaEditor}
                    setFroalaEditor={setFroalaEditor}
                    templateType="email"
                  />
                  <Grid
                    item
                    xs={12}
                    sx={{
                      backgroundColor: Colors.WHITE,
                      borderRadius: "10px ",
                      marginTop: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ListTableDynamic
                      headerData={headerData}
                      data={notificationTemplates.email}
                      requiredIcons={true}
                      onRowClick={renderEmailTemplate}
                      show="email_template"
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  lg={6}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#E5E5E5",
                      padding: ".5rem",
                      marginTop: "3rem",
                      // height: "6vh",
                      width: "100%",
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "10px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#E5E5E5",
                        borderRadius: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: Colors.WHITE,
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: Colors.WHITE,
                        borderRadius: "10px",
                        width: "100%",
                        height: "100%",
                        padding: "1rem",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontWeight: "600",
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        Template Preview
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontWeight: "600",
                          fontSize: ".9rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        {emailTemplateId}
                      </Typography>
                      <div dangerouslySetInnerHTML={{ __html: htmlData }} />
                    </div>
                  </Box>
                </Grid>
              </Grid>
            )}
            {value === TABS.SMS && (
              <Grid
                container
                sx={{ justifyContent: "space-between", marginTop: "1rem" }}
              >
                <Grid
                  container
                  item
                  xs={12}
                  lg={6}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                    }}
                  >
                    Templates
                  </Typography>

                  <MuiModels
                    show="froalaEditor"
                    froalaEditorButton="Add New"
                    froalaEditor={froalaEditor}
                    setFroalaEditor={setFroalaEditor}
                    templateType="sms"
                  />
                  <Grid
                    item
                    xs={12}
                    sx={{
                      backgroundColor: Colors.WHITE,
                      borderRadius: "10px ",
                      marginTop: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ListTableDynamic
                      headerData={headerData}
                      data={notificationTemplates.sms}
                      requiredIcons={true}
                      onRowClick={renderSmsTemplate}
                      show="sms_template"
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  lg={6}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#E5E5E5",
                      padding: ".5rem",
                      marginTop: "3rem",
                      height: "55vh",
                      width: "100%",
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "10px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#E5E5E5",
                        borderRadius: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: Colors.WHITE,
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: Colors.WHITE,
                        borderRadius: "10px",
                        width: "100%",
                        height: "100%",
                        padding: "1rem",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontWeight: "600",
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        Template Preview
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontWeight: "600",
                          fontSize: ".9rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        {smsTemplateId}
                      </Typography>
                      <div dangerouslySetInnerHTML={{ __html: textData }} />
                    </div>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>
        </Box>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
