import { useState, useEffect } from "react";
import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Grid,
  Hidden,
  Modal,
  styled,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import React from "react";
import { Colors } from "../../config/default";
import MuiModels from "../models";
import DebtorDetailsCards from "./debtorDetailCards";
import CreditorsDetailCards from "./creditorsDetailCards";
import TransactionDetails from "./transactionDetail";
import CaseFileCard from "./caseFileCard";
import AnalyticsAccordion from "./analyticsAccordion";
import AboutAccordion from "./aboutAccordion";
import TaskAccordion from "./tasksAccordion";
import CustomFieldsAccordion from "./customFieldsAccordion";
import TextButton from "../button";
import { useNavigate } from "react-router-dom";
import TimelineData from "./timelineData";
import { FONT_SIZE_LARGE, FONT_SIZE_SMALL } from "../../constants/appConstants";
import ScrollbarStyles from "../customScroll";
import { isEmpty } from "lodash";
import FinancialAccordion from "./Financial";
import SettlementAccordion from "./settlementRanges";
import DeletePrompt from "../deletePrompt";
import { GetCalls } from "../../services/services";
import { useToast } from "../../toast/toastContext";

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
      fontSize: "14px !important",
    },
    [theme.breakpoints.up("xs")]: {
      fontSize: FONT_SIZE_SMALL,
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

export default function CaseById({
  id,
  loading,
  caseData,
  GetCaseDetails,
  handleOpen,
  style,
  handleClicked,
  notesLoading,
  caseHistoryTabs,
  setCaseHistoryTabs,
  tabs,
  filteredLogs,
  value,
  handleChange,
  verifiedSenders,
  GetLogsById,
  isPaymentLoading,
  paymentDetails,
  handleClose,
  addTaskModal,
  handleChangeModal,
  open,
  handleToggle,
  isChecked,
  GetCasePaymentDetails,
}) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [callLogs, setCallLogs] = useState([]);

  const fetchCalls = async () => {
    const res = await GetCalls(id);
    if (res?.status === 200) {
      setCallLogs(res?.data?.data);
    }
  };
  useEffect(() => {
    fetchCalls();
  }, []);

  return (
    <Grid item sx={{ marginTop: "1rem" }}>
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
        <>
          <Accordion
            sx={{
              boxShadow: "none",
              marginBottom: "10px",
              backgroundColor: Colors.BG_LIGHT_GRAY,
              width: { xs: "65vw", sm: "auto" },
            }}
            defaultExpanded
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                height: "20px",
                backgroundColor: Colors.WHITE,
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    TabIndicatorProps={{
                      style: {
                        backgroundColor: Colors.SKY_BLUE,
                      },
                    }}
                  >
                    <Tab
                      sx={{
                        fontWeight: "600",
                        textTransform: "none",
                        fontFamily: "Nunito",

                        "&.Mui-selected": {
                          color: value ? Colors.SKY_BLUE : "inherit",
                        },
                      }}
                      label="Client"
                      value="Debtor"
                    />
                    <Tab
                      sx={{
                        fontWeight: "600",
                        textTransform: "none",
                        fontFamily: "Nunito",
                        "&.Mui-selected": {
                          color: value ? Colors.SKY_BLUE : "inherit",
                        },
                      }}
                      label="Creditor"
                      value="Creditor"
                    />
                    <Tab
                      sx={{
                        fontWeight: "600",
                        textTransform: "none",
                        fontFamily: "Nunito",
                        "&.Mui-selected": {
                          color: value ? Colors.SKY_BLUE : "inherit",
                        },
                      }}
                      label="Other Creditors"
                      value="Other Creditors"
                    />
                    <Tab
                      sx={{
                        fontWeight: "600",
                        textTransform: "none",
                        fontFamily: "Nunito",
                        "&.Mui-selected": {
                          color: value ? Colors.SKY_BLUE : "inherit",
                        },
                      }}
                      label="Files"
                      value="Files"
                    />
                    <Tab
                      sx={{
                        fontWeight: "600",
                        textTransform: "none",
                        fontFamily: "Nunito",
                        "&.Mui-selected": {
                          color: value ? Colors.SKY_BLUE : "inherit",
                        },
                      }}
                      label="Transactions"
                      value="Transactions"
                    />
                  </Tabs>
                </Box>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    paddingRight: "10px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {value === "Debtor" && (
                    <MuiModels
                      show="debtorPaymentPlan"
                      caseData={caseData}
                      GetCaseDetails={GetCaseDetails}
                    />
                  )}
                  {value === "Transactions" && (
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <MuiModels
                        show="AddPayments"
                        width="55vw"
                        caseId={id}
                        debtorId={caseData?.debtor?._id}
                        GetCaseDetails={GetCaseDetails}
                      />
                      <MuiModels
                        width="70vw"
                        show="payments"
                        remainingAmount={caseData?.remaining.toString()}
                        data={caseData}
                        GetCaseDetails={GetCaseDetails}
                        GetCasePaymentDetails={GetCasePaymentDetails}
                      />
                    </div>
                  )}
                  {value === "Creditor" && (
                    <Grid
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: "10px",
                        padding: "10px",
                      }}
                    >
                      <Grid item sx={{ mr: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: "Nunito",
                            fontSize: FONT_SIZE_LARGE,
                          }}
                        >
                          Funds transfer
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Switch
                          checked={isChecked}
                          onChange={(e) => handleToggle(e.target.checked)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: Colors.SKY_BLUE,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: Colors.SKY_BLUE,
                              },
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </div>
              </div>
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
                    fetchCalls={fetchCalls}
                    verifiedSenders={verifiedSenders}
                    caseData={caseData}
                    GetCaseDetails={GetCaseDetails}
                    caseDataId={id}
                    GetLogsById={GetLogsById}
                  />
                ) : value === "Creditor" ? (
                  <CreditorsDetailCards
                    fetchCalls={fetchCalls}
                    verifiedSenders={verifiedSenders}
                    caseData={caseData}
                    GetCaseDetails={GetCaseDetails}
                    caseDataId={id}
                    GetLogsById={GetLogsById}
                  />
                ) : value === "Other Creditors" ? (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      backgroundColor: Colors.WHITE,
                      borderRadius: "10px",
                      padding: "0px 10px",
                      height: "13rem",
                      marginBottom: "0.5rem",
                      overflowY: "auto",
                      ...ScrollbarStyles,
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
                          height="80vh"
                          caseData={caseData}
                        />
                      </Box>
                    </div>
                    {caseData?.creditors?.map((item, index) => {
                      return (
                        <Grid
                          container
                          key={index}
                          sx={{
                            display: "flex",
                            backgroundColor:
                              index % 2 === 0 ? Colors.WHITE : Colors.VIOLET,
                            "&:hover": {
                              backgroundColor: Colors.BG_LIGHT_GRAY,
                            },
                            cursor: "pointer",
                            paddingRight: ".2rem",
                            paddingLeft: ".2rem",
                            height: "2rem",
                            alignItems: "center",
                          }}
                          onClick={() => navigate(`/all-cases/${item?._id}`)}
                        >
                          <Grid item xs={11} md={8} lg={5}>
                            <span
                              style={{
                                color: Colors.DIM_LIGHT_GRAY,
                                fontWeight: "700",
                                fontFamily: "Nunito",
                                fontSize: "11px",
                              }}
                            >
                              <Hidden smDown>
                                <span
                                  style={{
                                    fontWeight: "700",
                                    color: Colors.DARK_GRAY,
                                    marginRight: "1rem",
                                  }}
                                >
                                  Name
                                </span>
                              </Hidden>
                              {item?.creditor?.businessInformation?.companyName}
                            </span>
                          </Grid>
                          <Hidden mdDown>
                            <Grid item xs={3} sm={4} lg={6}>
                              <span
                                style={{
                                  color: Colors.DIM_LIGHT_GRAY,
                                  fontWeight: "600",
                                  fontFamily: "Nunito",
                                  fontSize: "11px",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: "700",
                                    color: Colors.DARK_GRAY,
                                    marginRight: "1rem",
                                  }}
                                >
                                  Case Code
                                </span>

                                {item?.caseCode}
                              </span>
                            </Grid>
                          </Hidden>
                          <Grid
                            item
                            xs={1}
                            sm={1}
                            lg={1}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <DeletePrompt
                              buttonName="Delete"
                              heading="Delete Creditor"
                              text={`Are you sure you want to delete ${item?.creditor?.businessInformation?.companyName}?`}
                              creditorId={item?._id}
                              loading={deleting}
                              GetCaseDetails={GetCaseDetails}
                              setLoading={setDeleting}
                              id={id}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                ) : value === "Transactions" ? (
                  <TransactionDetails
                    loading={isPaymentLoading}
                    paymentDetails={paymentDetails}
                    GetCasePaymentDetails={GetCasePaymentDetails}
                  />
                ) : (
                  <CaseFileCard
                    caseData={caseData}
                    caseDataId={id}
                    GetCaseDetails={GetCaseDetails}
                  />
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Grid container>
            <Grid item xs={12} md={3}>
              <AnalyticsAccordion
                loading={isPaymentLoading}
                paymentDetails={paymentDetails}
              />

              {/* <FinancialAccordion />
              <SettlementAccordion /> */}
              <AboutAccordion
                caseDetails={caseData}
                GetCaseDetails={GetCaseDetails}
              />
              <TaskAccordion GetLogsById={GetLogsById} caseData={caseData} />
              <CustomFieldsAccordion
                caseData={caseData}
                GetCaseDetails={GetCaseDetails}
              />
            </Grid>

            <Grid item xs={12} md={9}>
              <span
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "end",
                }}
              >
                <TextButton
                  buttonText="Add Notes"
                  height="2rem"
                  width="8rem"
                  onClick={handleOpen}
                  backgroundColor={Colors.SKY_BLUE}
                  hoverColor={Colors.SKY_BLUE}
                />

                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      align="center"
                    >
                      Add Case Notes
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      margin="normal"
                      name="notes"
                      value={addTaskModal}
                      onChange={handleChangeModal}
                      sx={{
                        backgroundColor: "white",
                      }}
                      placeholder="Please enter case notes"
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <TextButton
                        buttonText="Submit"
                        height="2rem"
                        width="8rem"
                        onClick={handleClicked}
                        loading={notesLoading}
                        backgroundColor={Colors.SKY_BLUE}
                        hoverColor={Colors.SKY_BLUE}
                      />
                    </div>
                  </Box>
                </Modal>
              </span>
              <AntTabs
                value={caseHistoryTabs}
                onChange={(e, value) => setCaseHistoryTabs(value)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minWidth: "100%",
                  backgroundColor: Colors.WHITE,
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  m: "10px 10px",
                }}
              >
                {tabs?.map((item, index) => (
                  <AntTab
                    key={index}
                    sx={{
                      bgcolor: Colors.WHITE,
                      width: "max-content",
                      fontWeight: "600",
                      height: "3.5rem",
                    }}
                    label={item}
                  />
                ))}
              </AntTabs>
              {caseHistoryTabs === 5 ? (
                <TimelineData
                  callLogs={callLogs}
                  id={id}
                  date={null}
                  caseDataId={id}
                  GetLogsById={GetLogsById}
                  iconValue={caseHistoryTabs}
                />
              ) : filteredLogs?.length > 0 ? (
                filteredLogs?.map((item, index) => (
                  <TimelineData
                    callLogs={callLogs}
                    id={id}
                    notes={false}
                    value={item}
                    date={null}
                    key={index}
                    caseDataId={id}
                    GetLogsById={GetLogsById}
                    iconValue={caseHistoryTabs}
                  />
                ))
              ) : (
                <TimelineData
                  callLogs={callLogs}
                  id={id}
                  notes={true}
                  value={
                    caseHistoryTabs === 1
                      ? "No Emails"
                      : caseHistoryTabs === 2
                      ? "No Sms"
                      : caseHistoryTabs === 4
                      ? "No Notes"
                      : "No Data"
                  }
                  date={null}
                  caseData={caseData}
                  iconValue={caseHistoryTabs}
                />
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
}
