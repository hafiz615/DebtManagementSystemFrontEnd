import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
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
import MuiModels from "../models.jsx";

function CaseDetail() {
  const navigate = useNavigate();

  const [value, setValue] = React.useState("Debtor");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;
  const [loading, setLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [caseData, setCaseData] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const { id } = useParams();

  const GetCaseDetails = async (rowId) => {
    setLoading(true);
    const caseDetails = await GetCaseById(rowId);
    if (caseDetails?.status === 200) {
      setCaseData(caseDetails?.data?.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    GetCaseDetails(id);
  }, [id]);
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const GetCasePaymentDetails = async (rowId) => {
    setIsPaymentLoading(true);
    const casePayment = await GetCasePaymentById(rowId);
    if (casePayment?.status === 200) {
      setPaymentDetails(casePayment?.data?.data);
    }
    setIsPaymentLoading(false);
  };
  useEffect(() => {
    GetCasePaymentDetails(id);
  }, [id]);

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
                <Grid
                  container
                  sx={{
                    height: "max-content",
                    justifyContent: "space-between",
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
                  <Grid
                    item
                    xs={12}
                    lg={2.5}
                    sx={{
                      backgroundColor: Colors.WHITE,
                      borderRadius: "10px",
                      padding: "0px 10px",
                      height: "13rem",
                      marginBottom: "0.5rem",
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "5px",
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
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: "600",
                          fontSize: "13px",
                          fontFamily: "Nunito",
                        }}
                      >
                        Other Creditors
                      </p>
                      <Box sx={{ marginTop: "0.5rem" }}>
                        <MuiModels
                          show="addCase"
                          width="80vw"
                          height="90vh"
                          caseData={caseData}
                        />
                      </Box>
                    </div>
                    {caseData?.creditors?.map((item, index) => {
                      return (
                        <Grid
                          item
                          xs={12}
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundColor:
                              index % 2 === 0
                                ? Colors.WHITE
                                : "rgba(85, 148, 242, 0.06)",
                            "&:hover": {
                              backgroundColor: Colors.BG_LIGHT_GRAY,
                            },
                            cursor: "pointer",
                            paddingRight: ".2rem",
                            paddingLeft: ".2rem",
                            height: "2rem",
                            alignItems: "center",
                          }}
                          onClick={() => navigate(`/all-cases/${item?.caseId}`)}
                        >
                          <span
                            style={{
                              color: Colors.DARK_GRAY,
                              fontWeight: "700",
                              fontFamily: "Nunito",
                              fontSize: "11px",
                            }}
                          >
                            {item?.name}
                          </span>
                          <span
                            style={{
                              color: Colors.DIM_LIGHT_GRAY,
                              fontWeight: "600",
                              fontFamily: "Nunito",
                              fontSize: "11px",
                            }}
                          >
                            {item?.caseCode}
                          </span>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Grid container>
              <Grid xs={12} md={3}>
                <AnalyticsAccordion
                  loading={isPaymentLoading}
                  paymentDetails={paymentDetails}
                />
                <AboutAccordion
                  caseDetails={caseData}
                  GetCaseDetails={GetCaseDetails}
                />
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
