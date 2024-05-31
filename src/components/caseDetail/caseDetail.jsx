import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Box,
  CircularProgress,
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
import { GetCaseById, GetCasePaymentById } from "../../services/services.js";
import { isEmpty } from "lodash";

function CaseDetail() {
  const [value, setValue] = React.useState("Debtor");

  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;
  const [loading, setLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [caseData, setCaseData] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const { id } = useParams();

  const GetCaseDetails = async () => {
    setLoading(true);
    const caseDetails = await GetCaseById(id);
    if (caseDetails?.status === 200) {
      setCaseData(caseDetails?.data?.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    GetCaseDetails();
  }, []);
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const GetCasePaymentDetails = async () => {
    setIsPaymentLoading(true);
    const casePayment = await GetCasePaymentById(id);
    if (casePayment?.status === 200) {
      setPaymentDetails(casePayment?.data?.data);
    }
    setIsPaymentLoading(false);
  };
  useEffect(() => {
    GetCasePaymentDetails();
  }, []);
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
          marginTop: "1.5rem",
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
      {loading || isEmpty(caseData) ? (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "90vh",
          }}
        >
          <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : (
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
            {caseData?.caseCode}
          </Typography>

          {/* remove container  */}
          <Grid item sx={{ marginTop: "1.5rem" }}>
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
                  <DebtorDetailsCards
                    caseData={caseData}
                    GetCaseDetails={GetCaseDetails}
                  />
                ) : (
                  <CreditorsDetailCards
                    caseData={caseData}
                    GetCaseDetails={GetCaseDetails}
                  />
                )}
              </AccordionDetails>
            </Accordion>
            <Grid container>
              <Grid xs={12} md={3}>
                <AnalyticsAccordion
                  loading={isPaymentLoading}
                  paymentDetails={paymentDetails}
                />
                <AboutAccordion caseDetails={caseData} />
                <TaskAccordion />
                <CustomFieldsAccordion
                  caseData={caseData}
                  GetCaseDetails={GetCaseDetails}
                />
                <TransactionAccordion
                  loading={isPaymentLoading}
                  paymentDetails={paymentDetails}
                />
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
      )}
    </Grid>
  );
}

export default CaseDetail;
