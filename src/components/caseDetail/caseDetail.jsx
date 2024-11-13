import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

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
  Hidden,
  Modal,
  TextField,
  Tooltip,
  styled,
  Switch,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_SMALL,
  PAGE_HEIGHT,
  UserListPage,
} from "../../constants/appConstants";
import AnalyticsAccordion from "./analyticsAccordion";
import AboutAccordion from "./aboutAccordion";
import TaskAccordion from "./tasksAccordion";
import CustomFieldsAccordion from "./customFieldsAccordion";
import TransactionAccordion from "./transactionDetail.jsx";
import CreditorsDetailCards from "./creditorsDetailCards.jsx";
import DebtorDetailsCards from "./debtorDetailCards.jsx";
import TimelineData from "./timelineData.jsx";
import {
  AddNotesCase,
  AddSenderIdentity,
  GetAllSenders,
  GetCaseById,
  GetCasePaymentById,
  GetLogs,
  PausePayments,
} from "../../services/services.js";
import { isEmpty } from "lodash";
import MuiModels from "../models.jsx";
import ScrollbarStyles from "../customScroll.jsx";
import TextButton from "../button.jsx";
import { setCaseCreditorId, setCaseId } from "../../redux/action/action.js";
import CaseFileCard from "./caseFileCard.jsx";
import { useToast } from "../../toast/toastContext.jsx";
import TransactionDetails from "./transactionDetail.jsx";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

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

function CaseDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const { showToast } = useToast();
  const [value, setValue] = React.useState("Debtor");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;
  const [loading, setLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [caseData, setCaseData] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const [addTaskModal, setAddTaskModal] = useState("");
  const [verifiedSenders, setVerified] = useState([]);
  const [caseHistoryTabs, setCaseHistoryTabs] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const { id } = useParams();
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");

  const handleOpen = async () => {
    setOpen(true);
  };
  const tabs = ["Email", "Sms", "Case"];
  const filteredLogs = logs?.filter((item) => {
    if (caseHistoryTabs === 0) {
      return item?.Action === "EMAIL";
    } else if (caseHistoryTabs === 1) {
      return item?.Action === "SMS";
    } else if (caseHistoryTabs === 2) {
      return item?.Action !== "EMAIL" && item?.Action !== "SMS";
    }
    return false;
  });

  const handleClose = () => setOpen(false);
  const GetCaseDetails = async (rowId) => {
    setLoading(true);
    const caseDetails = await GetCaseById(rowId);
    if (caseDetails?.status === 200) {
      GetLogsById(rowId);
      setCaseData(caseDetails?.data?.data);
      setIsChecked(caseDetails?.data?.data?.creditorPaymentsProceed);
      dispatch(setCaseId(id));
      dispatch(setCaseCreditorId(caseDetails?.data?.data?.creditor?._id));

      const senderRes = await GetAllSenders(
        caseDetails?.data?.data?.debtor?._id
      );
      if (senderRes?.status === 200) {
        setVerified(senderRes?.data?.data);
      }
    } else if (
      caseDetails?.response?.status === 401 ||
      caseDetails?.response?.status === 403
    ) {
      localStorage.clear();
      navigate("/");
    }
    setLoading(false);
  };
  useEffect(() => {
    GetCaseDetails(id);
    GetCasePaymentDetails(id);
  }, [id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const GetCasePaymentDetails = async (rowId) => {
    setIsPaymentLoading(true);
    const casePayment = await GetCasePaymentById(rowId);
    if (casePayment?.status === 200) {
      setPaymentDetails(casePayment?.data?.data);
    } else if (
      casePayment?.response?.status === 401 ||
      casePayment?.response?.status === 403
    ) {
      localStorage.clear();
      navigate("/");
    }
    setIsPaymentLoading(false);
  };

  const GetLogsById = async (id) => {
    const resLogs = await GetLogs(id);
    if (resLogs?.status === 200) {
      setLogs(resLogs?.data?.data);
    }
  };

  const handleChangeModal = (e) => {
    setAddTaskModal(e.target.value);
  };

  const handleClicked = async () => {
    setNotesLoading(true);
    if (addTaskModal === "") {
      setNotesLoading(false);
      showToast("The fields can't be empty, try again", "error");
    } else {
      const payload = {
        notes: addTaskModal,
      };
      const resposne = await AddNotesCase(id, payload);
      if (resposne?.status === 201) {
        setNotesLoading(false);
        GetLogsById(id);
      }
      setAddTaskModal("");
      handleClose();
    }
  };

  const emailData = caseData?.debtor?.basicInformation;
  const AddSenderInformation = async () => {
    const params = {
      from_email: emailData?.email || "",
      from_name: emailData?.fullName || "",
      address: emailData?.address || "",
      city: emailData?.city || "",
    };
    const SenderInfoResponse = await AddSenderIdentity(
      params,
      caseData?.debtor?._id
    );
    if (SenderInfoResponse?.status === 200) {
      showToast(SenderInfoResponse?.data?.message, "success");
    } else if (SenderInfoResponse?.response?.status === 400) {
      const errorMessage = SenderInfoResponse?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  const handleToggle = async (check) => {
    setIsChecked(check);
    const res = await PausePayments(id, check);
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
          <Grid
            container
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Tooltip
              title={caseData?.debtor?.businessInformation?.companyName}
              placement="top"
            >
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "1.5rem",
                  fontFamily: "Nunito",
                  color: Colors.BLACK,
                }}
              >
                {caseData?.debtor?.businessInformation?.companyName?.length > 20
                  ? `${caseData?.debtor?.businessInformation?.companyName?.slice(
                      0,
                      20
                    )}...`
                  : caseData?.debtor?.businessInformation?.companyName}
              </Typography>
            </Tooltip>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.2%",
              }}
            >
              <TextButton
                buttonText="Add Debtor Identity"
                height="2.5rem"
                width="14rem"
                onClick={AddSenderInformation}
                backgroundColor={Colors.SKY_BLUE}
                hoverColor={Colors.SKY_BLUE}
              />

              <MuiModels
                show="sendEmailCase"
                buttonName="sendEmailCase"
                iconColor={Colors.BLACK}
                maxHeight="78vh"
                caseDataId={id}
                GetLogsById={GetLogsById}
                data={caseData}
                verifiedSenders={verifiedSenders}
              />
              <MuiModels
                show="sendEmailCase"
                buttonName="sendSmsCase"
                headerName={true}
                iconColor={Colors.BLACK}
                maxHeight="78vh"
                caseDataId={id}
                GetLogsById={GetLogsById}
                data={caseData}
              />
              {caseData?.settlementRange ? (
                <TextButton
                  buttonText="Get Settlement Range"
                  height="2.5rem"
                  width="14rem"
                  onClick={() => {
                    navigate(`/settlementRange/${id}`);
                  }}
                  backgroundColor={Colors.SKY_BLUE}
                  hoverColor={Colors.SKY_BLUE}
                />
              ) : (
                <MuiModels
                  show="WeeklyBudget"
                  buttonName="Get Settlement Range"
                  iconColor={Colors.BLACK}
                  maxHeight="78vh"
                  caseData={caseData}
                />
              )}
            </div>
          </Grid>

          <Grid item sx={{ marginTop: "1rem" }}>
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
                        label="Debtor"
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
                      <MuiModels
                        width="70vw"
                        show="payments"
                        remainingAmount={caseData?.remaining.toString()}
                        data={caseData}
                        GetCaseDetails={GetCaseDetails}
                        GetCasePaymentDetails={GetCasePaymentDetails}
                      />
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
                      verifiedSenders={verifiedSenders}
                      caseData={caseData}
                      GetCaseDetails={GetCaseDetails}
                      caseDataId={id}
                      GetLogsById={GetLogsById}
                    />
                  ) : value === "Creditor" ? (
                    <CreditorsDetailCards
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
                            <Grid item xs={12} md={8} lg={5}>
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
                                {
                                  item?.creditor?.businessInformation
                                    ?.companyName
                                }
                              </span>
                            </Grid>
                            <Hidden smDown>
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
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : value === "Transactions" ? (
                    <TransactionDetails
                      caseData={caseData}
                      loading={isPaymentLoading}
                      paymentDetails={paymentDetails}
                      GetCaseDetails={GetCaseDetails}
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
                        style={{ display: "flex", justifyContent: "flex-end" }}
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

                {filteredLogs?.length > 0 ? (
                  filteredLogs.map((item, index) => (
                    <TimelineData
                      notes={false}
                      value={item}
                      date={null}
                      key={index}
                      caseDataId={id}
                      GetLogsById={GetLogsById}
                    />
                  ))
                ) : (
                  <TimelineData
                    notes={true}
                    value={
                      caseHistoryTabs === 0
                        ? "No Emails"
                        : caseHistoryTabs === 1
                        ? "No Sms"
                        : "No Data"
                    }
                    date={null}
                    caseData={caseData}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default CaseDetail;
