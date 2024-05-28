import React from "react";
import { useSelector } from "react-redux";

import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Colors } from "../../config/default";
import { UserListPage } from "../../constants/appConstants";
import AnalyticsAccordion from "./analyticsAccordion";
import AboutAccordion from "./aboutAccordion";
import TaskAccordion from "./tasksAccordion";
import CustomFieldsAccordion from "./customFieldsAccordion";
import TransactionAccordion from "./transactionAccordion";
import CreditorsDetailCards from "./creditorsDetailCards.jsx";
import DebtorDetailsCards from "./debtorDetailCards.jsx";
import TimelineData from "./timelineData.jsx";

function CaseDetail() {
  const [value, setValue] = React.useState("Debtor");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
          display: "flex",
          justifyContent: smallScreen ? "flex-start" : "flex-end",
          marginTop: ".5rem",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "500",
            color: Colors.DARK_GRAY,
          }}
        >
          {AUTHORITY_TEXT} <span>{role}</span>
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: ".5rem",
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
          Case Code
        </Typography>
        <Grid>
          <Accordion
            sx={{
              boxShadow: "none",
              marginBottom: "10px",
              backgroundColor: Colors.BG_LIGHT_GRAY,
            }}
            defaultExpanded
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                height: "20px",
                backgroundColor: Colors.WHITE,
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <Box
                sx={{ borderBottom: 1, borderColor: "divider" }}
                onClick={(event) => event.stopPropagation()}
              >
                <Tabs value={value} onChange={handleChange}>
                  <Tab
                    sx={{
                      fontWeight: "600",
                      textTransform: "none",
                      fontFamily: "Nunito",
                    }}
                    label="Debtor"
                    value="Debtor"
                  />
                  <Tab
                    sx={{
                      fontWeight: "600",
                      textTransform: "none",
                      fontFamily: "Nunito",
                    }}
                    label="Creditor"
                    value="Creditor"
                  />
                </Tabs>
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                boxShadow: " 0 2px 5px -3px rgba(0, 0, 0, 0.5)",

                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              {value === "Debtor" ? (
                <DebtorDetailsCards />
              ) : (
                <CreditorsDetailCards />
              )}
            </AccordionDetails>
          </Accordion>
          <Grid container>
            <Grid xs={12} md={3}>
              <AnalyticsAccordion />
              <AboutAccordion />
              <TaskAccordion />
              <CustomFieldsAccordion />
              <TransactionAccordion />
            </Grid>
            <Grid xs={12} md={9}>
              <TimelineData />
              <TimelineData />
              <TimelineData />
              <TimelineData />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CaseDetail;
