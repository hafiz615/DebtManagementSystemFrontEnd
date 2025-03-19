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
import TimelineData from "./timelineData";
import { FONT_SIZE_LARGE, FONT_SIZE_SMALL } from "../../constants/appConstants";
import { isEmpty } from "lodash";
import { GetCalls, GetLawsuitDetails } from "../../services/services";
import SendEmailCase from "./sendEmailCase";
import AttorneyDetail from "./attorneyDetail";
import OtherCreditors from "./otherCreditors";

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
  setAttorneyIsChecked,
  isAttorneyChecked,
  handleCreditorToggle,
  handleAttorneyToggle,
  isChecked,
  GetCasePaymentDetails,
  currentPaymentPage,
  setCurrentPaymentPage,
  totalPaymentPage,
  showEmail,
  from,
  getAllRanges,
  handleCloseNotes,
  cc,
}) {
  const [callLogs, setCallLogs] = useState([]);
  const [currentCallPage, setCurrentCallPage] = useState(1);
  const [totalCallPage, setTotalCallPage] = useState();
  const [creditorsTabs, setCreditorsTabs] = useState("singleCreditor");
  const [attorneyData, setAttorneyData] = useState();
  const [allAttorneyData, setAllAttorneyData] = useState();

  const getAttorneyData = async () => {
    const res = await GetLawsuitDetails(caseData?._id);
    if (res?.status === 200) {
      setAllAttorneyData(res?.data?.data);
      setAttorneyData(res?.data?.data ? res?.data?.data?.attorney : "");
      setAttorneyIsChecked(res?.data?.data?.lawSuit?.attorneyPaymentsProceed);
    }
  };

  const fetchCalls = async (caseId) => {
    const res = await GetCalls(caseId || id, currentCallPage);
    if (res?.status === 200) {
      let totalPage = Math.ceil(res?.data?.data?.callCount / 10);
      setCallLogs(res?.data?.data?.calls);
      setTotalCallPage(totalPage);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, [currentCallPage]);

  useEffect(() => {
    getAttorneyData();
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
                    {attorneyData && (
                      <Tab
                        sx={{
                          fontWeight: "600",
                          textTransform: "none",
                          fontFamily: "Nunito",
                          "&.Mui-selected": {
                            color: value ? Colors.SKY_BLUE : "inherit",
                          },
                        }}
                        label="Lawsuit Details"
                        value="Attorney"
                      />
                    )}

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
                        show="SeeCheckDetails"
                        maxHeight="70vh"
                        width="55vw"
                        caseId={id}
                        debtorId={caseData?.debtor?._id}
                        caseData={caseData}
                        GetCaseDetails={GetCaseDetails}
                      />
                      <MuiModels
                        show="bouncePayments"
                        maxHeight="70vh"
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
                        getAttorneyData={getAttorneyData}
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
                          Creditor Funds transfer
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Switch
                          checked={isChecked}
                          onChange={(e) =>
                            handleCreditorToggle(e.target.checked, "creditor")
                          }
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
                  {value === "Attorney" && attorneyData && (
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
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
                            Attorney Funds transfer
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Switch
                            checked={isAttorneyChecked}
                            onChange={(e) =>
                              handleAttorneyToggle(e.target.checked, "attorney")
                            }
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
                      <MuiModels
                        width="65vw"
                        show="attorneyPaymentPlan"
                        attorneyId={attorneyData?._id}
                        data={allAttorneyData?.lawSuit}
                        caseData={caseData}
                        remainingAmount={allAttorneyData?.lawSuit?.balance?.toString()}
                        GetCaseDetails={GetCaseDetails}
                        getAttorneyData={getAttorneyData}
                      />
                    </div>
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
                    accountsExist={caseData?.debtor?.accounts?.length > 0}
                    fetchCalls={fetchCalls}
                    verifiedSenders={verifiedSenders}
                    caseData={caseData}
                    GetCaseDetails={GetCaseDetails}
                    caseDataId={id}
                    GetLogsById={GetLogsById}
                    cc={cc}
                  />
                ) : value === "Creditor" ? (
                  <CreditorsDetailCards
                    accountsExist={
                      caseData?.creditor?.paynoteSourceVerified &&
                      caseData?.creditor?.paynoteUserFound
                    }
                    fetchCalls={fetchCalls}
                    verifiedSenders={verifiedSenders}
                    caseData={caseData}
                    GetCaseDetails={GetCaseDetails}
                    caseDataId={id}
                    GetLogsById={GetLogsById}
                    getAllRanges={getAllRanges}
                    cc={cc}
                  />
                ) : value === "Other Creditors" ? (
                  <OtherCreditors
                    caseData={caseData}
                    GetCaseDetails={GetCaseDetails}
                  />
                ) : value === "Transactions" ? (
                  <TransactionDetails
                    loading={isPaymentLoading}
                    paymentDetails={paymentDetails}
                    GetCasePaymentDetails={GetCasePaymentDetails}
                    caseData={caseData}
                    GetCaseDetails={GetCaseDetails}
                    currentPaymentPage={currentPaymentPage}
                    setCurrentPaymentPage={setCurrentPaymentPage}
                    totalPaymentPage={totalPaymentPage}
                  />
                ) : value === "Attorney" ? (
                  <AttorneyDetail
                    accountsExist={
                      allAttorneyData?.attorney?.paynoteSourceVerified &&
                      allAttorneyData?.attorney?.paynoteUserFound
                    }
                    caseData={caseData}
                    GetCaseDetails={GetCaseDetails}
                    getAttorneyData={getAttorneyData}
                    allAttorneyData={allAttorneyData}
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
                        gap: "10px",
                      }}
                    >
                      <TextButton
                        buttonText="Cancel"
                        height="2rem"
                        width="8rem"
                        onClick={() => handleCloseNotes()}
                        backgroundColor={Colors.ORANGE_COLOR}
                        hoverColor={Colors.ORANGE_COLOR}
                      />
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
                value={creditorsTabs}
                onChange={(e, value) => {
                  setCreditorsTabs(value);
                  if (value === "singleCreditor") {
                    const singleCreditorId = caseData?._id;
                    if (singleCreditorId) {
                      GetLogsById(singleCreditorId);
                      fetchCalls(singleCreditorId);
                    }
                  } else {
                    const selectedCreditor = caseData?.creditors?.[value];
                    const caseDataId = selectedCreditor?._id;
                    if (caseDataId) {
                      GetLogsById(caseDataId);
                      fetchCalls(caseDataId);
                    }
                  }
                }}
                variant="scrollable"
                scrollButtons="auto"
                centered={false}
                sx={{
                  bgcolor: Colors.WHITE,
                  maxWidth: "65rem",
                  minWidth: "120px",
                  fontWeight: "600",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  m: "10px 10px",
                  height: "3.5rem",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {/* Additional Tab for Single Creditor */}
                <AntTab
                  key="singleCreditor"
                  label={
                    caseData?.creditor?.businessInformation?.companyName ||
                    "Single Creditor"
                  }
                  sx={{
                    bgcolor: Colors.WHITE,
                    // width: "200px",
                    fontWeight: "600",
                    height: "3.5rem",
                  }}
                  value="singleCreditor"
                />

                {/* Existing Creditors Tabs */}
                {caseData?.creditors?.map((item, index) => (
                  <AntTab
                    key={index}
                    label={item?.creditor?.businessInformation?.companyName}
                    sx={{
                      bgcolor: Colors.WHITE,
                      width: "max-content",
                      fontWeight: "600",
                      height: "3.5rem",
                    }}
                    value={index}
                  />
                ))}
              </AntTabs>

              <AntTabs
                value={caseHistoryTabs}
                onChange={(e, value) => setCaseHistoryTabs(value)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  bgcolor: Colors.WHITE,
                  maxWidth: "65rem",
                  minWidth: "120px",
                  fontWeight: "600",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  m: "10px 10px",
                  height: "3.5rem",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
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
              {showEmail && (
                <Grid
                  container
                  id="targetComponent"
                  item
                  xs={12}
                  sx={{
                    backgroundColor: Colors.WHITE,
                    marginLeft: "1rem",
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "10px",
                  }}
                >
                  <SendEmailCase
                    headerName={false}
                    verifiedSenders={verifiedSenders}
                    GetLogsById={GetLogsById}
                    data={caseData}
                    caseDataId={id}
                    buttonName="sendEmailCase"
                    handleClose={handleClose}
                    from={from}
                    cc={cc}
                  />
                </Grid>
              )}

              {caseHistoryTabs === 5 ? (
                <TimelineData
                  callLogs={callLogs}
                  id={id}
                  date={null}
                  caseDataId={id}
                  GetLogsById={GetLogsById}
                  iconValue={caseHistoryTabs}
                  currentCallPage={currentCallPage}
                  setCurrentCallPage={setCurrentCallPage}
                  totalCallPage={totalCallPage}
                  cc={cc}
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
                    caseData={caseData}
                    verifiedSenders={verifiedSenders}
                    cc={cc}
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
                  verifiedSenders={verifiedSenders}
                />
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
}
