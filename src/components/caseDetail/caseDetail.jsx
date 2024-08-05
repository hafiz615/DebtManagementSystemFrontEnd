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
  Button,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import IconButton from "@mui/material/IconButton";
import { Colors } from "../../config/default";
import { PAGE_HEIGHT, UserListPage } from "../../constants/appConstants";
import AnalyticsAccordion from "./analyticsAccordion";
import AboutAccordion from "./aboutAccordion";
import TaskAccordion from "./tasksAccordion";
import CustomFieldsAccordion from "./customFieldsAccordion";
import TransactionAccordion from "./transactionAccordion";
import CreditorsDetailCards from "./creditorsDetailCards.jsx";
import DebtorDetailsCards from "./debtorDetailCards.jsx";
import TimelineData from "./timelineData.jsx";
import {
  AddNotesCase,
  GetCaseById,
  GetCasePaymentById,
} from "../../services/services.js";
import { isEmpty } from "lodash";
import MuiModels from "../models.jsx";
import ScrollbarStyles from "../customScroll.jsx";
import TextButton from "../button.jsx";
import { setCaseCreditorId, setCaseId } from "../../redux/action/action.js";
import CaseFileCard from "./caseFileCard.jsx";
import { useToast } from "../../toast/toastContext.jsx";

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
  const [caseData, setCaseData] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const [addTaskModal, setAddTaskModal] = useState("");
  const [caseSummary, setCaseSummary] = useState([]);
  const { id } = useParams();
  const handleOpen = async () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const GetCaseDetails = async (rowId) => {
    setLoading(true);
    const caseDetails = await GetCaseById(rowId);
    if (caseDetails?.status === 200) {
      setCaseData(caseDetails?.data?.data);
      dispatch(setCaseId(id));
      dispatch(setCaseCreditorId(caseDetails?.data?.data?.creditor?._id));
      setCaseSummary(caseDetails?.data?.data?.notes)
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
    } else if (
      casePayment?.response?.status === 401 ||
      casePayment?.response?.status === 403
    ) {
      localStorage.clear();
      navigate("/");
    }
    setIsPaymentLoading(false);
  };
  useEffect(() => {
    GetCasePaymentDetails(id);
  }, [id]);

  const handleChangeModal = (e) => {
    setAddTaskModal(e.target.value);
  };
  const handleClicked = async () => {
    if (addTaskModal === "") {
      showToast("The fields can't be empty, try again", "error");
    } else {
      const payload = {
        notes: addTaskModal,
      };
      const resposne = await AddNotesCase(id, payload);
      setCaseSummary(resposne?.data?.data?.notes);
      setAddTaskModal("");
      handleClose();
    }
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
            xs={12}
            container
            sx={{ justifyContent: "space-between", alignItems: "center" }}
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
          </Grid>
          {/* remove container  */}
          <Grid item sx={{ marginTop: "1.5rem" }}>
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
                    <Tab
                      sx={{
                        fontWeight: "600",
                        textTransform: "none",
                        fontFamily: "Nunito",
                      }}
                      label="Other Creditors"
                      value="Other Creditors"
                    />
                    <Tab
                      sx={{
                        fontWeight: "600",
                        textTransform: "none",
                        fontFamily: "Nunito",
                      }}
                      label="Files"
                      value="Files"
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
                  ) : value === "Creditor" ? (
                    <CreditorsDetailCards
                      caseData={caseData}
                      GetCaseDetails={GetCaseDetails}
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
                            height="80vh"
                            caseData={caseData}
                          />
                        </Box>
                      </div>
                      {caseData?.creditors?.map((item, index) => {
                        console.log(item, "item");
                        return (
                          <Grid
                            container
                            key={index}
                            sx={{
                              display: "flex",
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
                            onClick={() =>
                              navigate(`/all-cases/${item?.caseId}`)
                            }
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
                                <Hidden mdDown>
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
                                {item?.name}
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
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : (
                    <CaseFileCard
                      caseData={caseData}
                      GetCaseDetails={GetCaseDetails}
                    />
                  )}
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
                <TaskAccordion caseData={caseData} />
                <CustomFieldsAccordion
                  caseData={caseData}
                  GetCaseDetails={GetCaseDetails}
                />
                <TransactionAccordion
                  loading={isPaymentLoading}
                  paymentDetails={paymentDetails}
                  GetCasePaymentDetails={GetCasePaymentDetails}
                />
              </Grid>

              <Grid xs={12} md={9}>
                <span
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "end",
                  }}
                >
                  <IconButton
                    aria-label="delete"
                    sx={{
                      color: Colors.BLACK,
                    }}
                    onClick={() => handleOpen()}
                  >
                    <span style={{ fontSize: "16px" }}>Add Notes</span>
                    <NoteAddIcon />
                  </IconButton>
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
                      <Button
                        variant="contained"
                        onClick={handleClicked}
                        sx={{
                          marginTop: "1em",
                          background: Colors.SKY_BLUE,
                          color: "white",
                          justifyContent: "end",
                        }}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Modal>
                </span>
                {!isEmpty(caseSummary) ? (
                  caseSummary
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((item) => (
                      <TimelineData
                        value={item?.value}
                        date={item?.createdAt}
                      />
                    ))
                ) : (
                  <TimelineData value={"No Data Found"} date={null} />
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
