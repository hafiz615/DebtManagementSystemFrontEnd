import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Colors } from "../../config/default";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_XL,
} from "../../constants/appConstants";
import TextButton from "../button";
import DebtorPaymentPlan from "../paymentPlan/debtorPaymentPlan";
import ScrollbarStyles from "../customScroll";
import CreditorPaymentPlan from "../paymentPlan/creditorPaymentPlan";
import ClientPaymentTable from "./clientPaymentTable";

import {
  GetCasePaymentById,
  GetDebtorCreditorPaymentPlan,
  ClientPaymentPlan,
  CreatePaymentPlan,
  UpdateCommissionPercentage,
  UpdateServiceFee,
  UpdateLegalFee,
  GetClientPaymentById,
  CancelPaymentPlan,
  CancelDebtorPaymentPlan,
  DeleteCasePriority,
  UpdateCasePriority,
} from "../../services/services";
import { useEffect } from "react";
import TransactionDetails from "./transactionDetail";
import { useToast } from "../../toast/toastContext";
import { Edit } from "@mui/icons-material";
import { Select, MenuItem } from "@mui/material";

export default function PaymentPlan({ caseData }) {
  const [data, setData] = useState();
  const [tabs, setTabs] = useState([]);
  const [activePayment, setActivePayment] = useState(1);
  const [activeIndex, setActiveIndex] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isExempt, setIsExempt] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [currentPaymentPage, setCurrentPaymentPage] = useState(1);
  const [totalPaymentPage, setTotalPaymentPage] = useState();
  const [openDialogue, setOpenDialogue] = useState(false);
  const [openServiceDialogue, setOpenServiceDialogue] = useState(false);
  const [openLegalDialogue, setOpenLegalDialogue] = useState(false);
  const [openRenegotiate, setOpenRenegotiate] = useState(false);
  const [renegotiateLoading, setRenegotiateLoading] = useState(false);
  const [intervalCommission, setIntervalCommission] = useState([]);
  const [commission, setCommission] = useState(0);
  const [legalFee, setLegalFee] = useState(0);

  const [priorityBitMap, setPriorityBitMap] = useState({});
  const [priorityError, setPriorityError] = useState("");

  const [serviceFee, setServiceFee] = useState(0);
  const [commissionLoading, setCommissionLoading] = useState(false);
  const [legalFeeLoading, setLegalFeeLoading] = useState(false);
  const [serviceFeeLoading, setServiceFeeLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [debtorDataList, setDebtorDataList] = useState([
    {
      amount: "",
      startDate: today,
      timePeriod: "Weekly",
      frequency: 1,
    },
  ]);
  const [creditorDataList, setCreditorDataList] = useState([
    {
      amount: "",
      startDate: today,
      timePeriod: "Weekly",
      frequency: 1,
    },
  ]);

  const { showToast } = useToast();

  const getPaymentPlan = async () => {
    setLoading(true);
    const res = await GetDebtorCreditorPaymentPlan(caseData?.debtor?._id);
    if (res?.status === 200) {
      const cases = res?.data?.data?.cases;
      const priorityBitMapFromAPI = {};
      cases?.forEach((item, idx) => {
        priorityBitMapFromAPI[idx] = item?.priority;
      });

      setPriorityBitMap(priorityBitMapFromAPI);
      setData(res?.data?.data);
      setTabs(res?.data?.data?.cases);
      setIntervalCommission(res?.data?.data?.commissions);
      setDebtorDataList(
        res?.data?.data?.debtor?.intervals?.length > 0
          ? res?.data?.data?.debtor?.intervals
          : [
              {
                amount: "",
                startDate: today,
                timePeriod: "Weekly",
                frequency: 1,
              },
            ]
      );
      setCreditorDataList(
        res?.data?.data?.cases?.[activeIndex]?.intervals?.length > 0
          ? res?.data?.data?.cases?.[activeIndex]?.intervals
          : [
              {
                amount: "",
                startDate: today,
                timePeriod: "Weekly",
                frequency: 1,
              },
            ]
      );
      if (activePayment === 1) {
        setIsExempt(res?.data?.data?.debtor?.isExempt);
      } else {
        setIsExempt(res?.data?.data?.cases?.[activeIndex]?.isExempt);
      }
      setCommission(res?.data?.data?.debtor?.commissionPercentage);
      setServiceFee(res?.data?.data?.debtor?.serviceFee);
      setLegalFee(res?.data?.data?.cases?.[activeIndex]?.legalFee);
    }
    setLoading(false);
  };

  const calculateTotalAmount = (data) => {
    let total = 0;
    data.forEach((item) => {
      const frequency = item?.frequency || 1;
      total += item?.amount === "" ? 0 : item?.amount * frequency;
    });
    return total;
  };

  const getCasePaymentDetails = async (load) => {
    if (!load) {
      setIsPaymentLoading(true);
    }
    const casePayment = await GetCasePaymentById(
      currentPaymentPage,
      tabs?.[activeIndex]?._id
    );
    if (casePayment?.status === 200) {
      let totalPreviousPage =
        Math.ceil(casePayment?.data?.data?.transactions?.previousCount / 15) ||
        0;
      let totalUpcomingPage =
        Math.ceil(casePayment?.data?.data?.transactions?.upcomingCount / 15) ||
        0;
      if (totalPreviousPage > totalUpcomingPage) {
        setTotalPaymentPage(totalPreviousPage);
      } else {
        setTotalPaymentPage(totalUpcomingPage);
      }
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

  const getClientPaymentDetails = async (load) => {
    if (!load) {
      setIsPaymentLoading(true);
    }
    const casePayment = await GetClientPaymentById(
      currentPaymentPage,
      caseData?.debtor?._id
    );
    if (casePayment?.status === 200) {
      let totalPreviousPage =
        Math.ceil(casePayment?.data?.data?.transactions?.previousCount / 15) ||
        0;
      let totalUpcomingPage =
        Math.ceil(casePayment?.data?.data?.transactions?.upcomingCount / 15) ||
        0;
      if (totalPreviousPage > totalUpcomingPage) {
        setTotalPaymentPage(totalPreviousPage);
      } else {
        setTotalPaymentPage(totalUpcomingPage);
      }
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

  const handleSave = async () => {
    setSaveLoading(true);
    if (activePayment === 1) {
      const updatedDebtorDataList = debtorDataList?.map(
        ({ _id, ...rest }) => rest
      );

      const payload = {
        intervals: updatedDebtorDataList,
        isExempt: isExempt,
      };
      const response = await ClientPaymentPlan(caseData?.debtor?._id, payload);
      if (response?.status === 200) {
        showToast(response?.data?.message, "success");
        getPaymentPlan();
        getClientPaymentDetails();
      } else {
        const errorMessage = response?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    } else {
      const updateCreditorDataList = creditorDataList?.map(
        ({ _id, ...rest }) => rest
      );
      const payload = {
        intervals: updateCreditorDataList,
        isExempt: isExempt,
      };
      const response = await CreatePaymentPlan(
        payload,
        tabs?.[activeIndex]?._id
      );
      if (response?.status === 200) {
        showToast(response?.data?.message, "success");
        getPaymentPlan();
        getCasePaymentDetails();
      } else {
        const errorMessage = response?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    }
    setSaveLoading(false);
  };

  const handleUpdateCommission = async () => {
    setCommissionLoading(true);
    const payload = {
      commission: parseInt(commission),
    };
    const response = await UpdateCommissionPercentage(
      data?.debtor?._id,
      payload
    );
    if (response?.status === 200) {
      showToast(response?.data?.message, "success");
      getPaymentPlan();
      setOpenDialogue(false);
    } else {
      const errorMessage = response?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setCommissionLoading(false);
  };

  const handleUpdateServiceFee = async () => {
    setServiceFeeLoading(true);
    const payload = {
      serviceFee: parseInt(serviceFee),
    };
    const response = await UpdateServiceFee(data?.debtor?._id, payload);
    if (response?.status === 200) {
      showToast(response?.data?.message, "success");
      getPaymentPlan();
      setOpenServiceDialogue(false);
    } else {
      const errorMessage = response?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setServiceFeeLoading(false);
  };

  const handleUpdateLegalFee = async () => {
    setLegalFeeLoading(true);
    const payload = {
      legalFee: parseInt(legalFee),
    };
    const response = await UpdateLegalFee(tabs?.[activeIndex]?._id, payload);
    if (response?.status === 200) {
      showToast(response?.data?.message, "success");
      getPaymentPlan();
      setOpenLegalDialogue(false);
    } else {
      const errorMessage = response?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLegalFeeLoading(false);
  };

  const handleUpdatePriorityBit = async (newPriorityBit, index) => {
    const payload = {
      priority: newPriorityBit,
    };
    const response = await UpdateCasePriority(
      tabs?.[activeIndex]?._id,
      payload
    );
    if (response?.status === 200) {
      showToast(response?.data?.message, "success");
      getPaymentPlan();
    } else {
      const errorMessage = response?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  const handleDeletePriorityBit = async (index) => {
    const response = await DeleteCasePriority(tabs?.[activeIndex]?._id);
    if (response?.status === 200) {
      showToast(response?.data?.message, "success");
      setPriorityBitMap((prev) => {
        const newMap = { ...prev };
        delete newMap[index];
        return newMap;
      });
    } else {
      const errorMessage = response?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  const handleRenegotiate = async () => {
    setRenegotiateLoading(true);
    if (activePayment === 1) {
      const response = await CancelDebtorPaymentPlan(data?.debtor?._id);
      if (response?.status === 200) {
        showToast(response?.data?.message, "success");
        getClientPaymentDetails();
        getPaymentPlan();
        setOpenRenegotiate(false);
      } else {
        const errorMessage = response?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    } else {
      const response = await CancelPaymentPlan(tabs?.[activeIndex]?._id);
      if (response?.status === 200) {
        showToast(response?.data?.message, "success");
        getCasePaymentDetails();
        getPaymentPlan();
        setOpenRenegotiate(false);
      } else {
        const errorMessage = response?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    }
    setRenegotiateLoading(false);
  };

  useEffect(() => {
    getPaymentPlan();
  }, [caseData]);

  useEffect(() => {
    if (activePayment === 1) {
      setIsExempt(data?.debtor?.isExempt);
      setDebtorDataList(
        data?.debtor?.intervals?.length > 0
          ? data?.debtor?.intervals
          : [
              {
                amount: "",
                startDate: today,
                timePeriod: "Weekly",
                frequency: 1,
              },
            ]
      );
      getClientPaymentDetails(false);
    } else {
      setIsExempt(tabs?.[activeIndex]?.isExempt);
      setCreditorDataList(
        tabs?.[activeIndex]?.intervals?.length > 0
          ? tabs?.[activeIndex]?.intervals
          : [
              {
                amount: "",
                startDate: today,
                timePeriod: "Weekly",
                frequency: 1,
              },
            ]
      );
      getCasePaymentDetails(false);
      setCurrentPaymentPage(1);
    }
  }, [activePayment, caseData]);

  useEffect(() => {
    if (activePayment === 1) {
      const newTotal = calculateTotalAmount(debtorDataList);
      setTotalAmount(newTotal);
    } else {
      const newTotal = calculateTotalAmount(creditorDataList);
      setTotalAmount(newTotal);
    }
  }, [debtorDataList, creditorDataList]);

  useEffect(() => {
    if (activePayment === 1) {
      getClientPaymentDetails(true);
    } else {
      getCasePaymentDetails(true);
    }
  }, [currentPaymentPage]);
  const isAnyDebtorAmountInvalid = debtorDataList?.some(
    (item) => item.amount === "" || item.amount === null || isNaN(item.amount)
  );

  const isAnyCreditorAmountInvalid = creditorDataList?.some(
    (item) =>
      item.amount === "" ||
      item.amount === null ||
      isNaN(item.amount) ||
      !priorityBitMap[activeIndex]
  );

  return (
    <Grid
      item
      container
      xs={12}
      sx={{
        backgroundColor: Colors.WHITE,
        borderRadius: "10px",
        padding: "1rem",
        height: "60vh",
        marginBottom: "0.5rem",
        justifyContent: "space-between",
      }}
    >
      <Dialog
        open={openDialogue}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "5px",
            width: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
          Update Commission
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontSize: FONT_SIZE_LARGE,
              color: Colors.SKY_BLUE,
            }}
          ></Typography>
          <input
            min={0}
            max={100}
            style={{
              width: "100%",
              padding: "7px 5px",
              borderRadius: "5px",
              backgroundColor: Colors.BG_LIGHT_GRAY,
              border: "none",
              outline: "none",
              fontSize: "14px",
              fontFamily: "Nunito",
              color: Colors.DIM_LIGHT_GRAY,
            }}
            placeholder="Commission"
            type="number"
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <div
            style={{
              marginTop: "1em",
              gap: "1em",
              display: "flex",
              justifyContent: "right",
            }}
          >
            <TextButton
              buttonText="Cancel"
              height="2rem"
              width="8rem"
              onClick={() => setOpenDialogue(false)}
              backgroundColor={Colors.ORANGE_COLOR}
              hoverColor={Colors.ORANGE_COLOR}
            />
            <TextButton
              buttonText="Update"
              height="2rem"
              width="8rem"
              onClick={handleUpdateCommission}
              loading={commissionLoading}
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
            />
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openServiceDialogue}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "5px",
            width: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
          Update Service Fee
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontSize: FONT_SIZE_LARGE,
              color: Colors.SKY_BLUE,
            }}
          ></Typography>
          <input
            min={0}
            max={100}
            style={{
              width: "100%",
              padding: "7px 5px",
              borderRadius: "5px",
              backgroundColor: Colors.BG_LIGHT_GRAY,
              border: "none",
              outline: "none",
              fontSize: "14px",
              fontFamily: "Nunito",
              color: Colors.DIM_LIGHT_GRAY,
            }}
            placeholder="Service Fee"
            type="number"
            value={serviceFee}
            onChange={(e) => setServiceFee(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <div
            style={{
              marginTop: "1em",
              gap: "1em",
              display: "flex",
              justifyContent: "right",
            }}
          >
            <TextButton
              buttonText="Cancel"
              height="2rem"
              width="8rem"
              onClick={() => setOpenServiceDialogue(false)}
              backgroundColor={Colors.ORANGE_COLOR}
              hoverColor={Colors.ORANGE_COLOR}
            />
            <TextButton
              buttonText="Update"
              height="2rem"
              width="8rem"
              onClick={handleUpdateServiceFee}
              loading={serviceFeeLoading}
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
            />
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openLegalDialogue}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "5px",
            width: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
          Update Legal Fee
        </DialogTitle>
        <DialogContent>
          <input
            min={0}
            max={100}
            style={{
              width: "100%",
              padding: "7px 5px",
              borderRadius: "5px",
              backgroundColor: Colors.BG_LIGHT_GRAY,
              border: "none",
              outline: "none",
              fontSize: "14px",
              fontFamily: "Nunito",
              color: Colors.DIM_LIGHT_GRAY,
            }}
            placeholder="Legal Fee"
            type="number"
            value={legalFee}
            onChange={(e) => setLegalFee(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <div
            style={{
              marginTop: "1em",
              gap: "1em",
              display: "flex",
              justifyContent: "right",
            }}
          >
            <TextButton
              buttonText="Cancel"
              height="2rem"
              width="8rem"
              onClick={() => setOpenLegalDialogue(false)}
              backgroundColor={Colors.ORANGE_COLOR}
              hoverColor={Colors.ORANGE_COLOR}
            />
            <TextButton
              buttonText="Update"
              height="2rem"
              width="8rem"
              onClick={handleUpdateLegalFee}
              loading={legalFeeLoading}
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
            />
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openRenegotiate}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "5px",
            width: 400,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Nunito",
            fontWeight: "600",
            fontSize: FONT_SIZE_LARGE,
          }}
        >
          Are you sure you want to renegotiate this payment plan?
        </DialogTitle>
        <DialogActions>
          <div
            style={{
              marginTop: "1em",
              gap: "1em",
              display: "flex",
              justifyContent: "right",
            }}
          >
            <TextButton
              buttonText="Cancel"
              height="2rem"
              width="8rem"
              onClick={() => setOpenRenegotiate(false)}
              backgroundColor={Colors.ORANGE_COLOR}
              hoverColor={Colors.ORANGE_COLOR}
            />
            <TextButton
              buttonText="Confirm"
              height="2rem"
              width="8rem"
              onClick={handleRenegotiate}
              loading={renegotiateLoading}
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
            />
          </div>
        </DialogActions>
      </Dialog>

      {loading ? (
        <Grid
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={50} sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : (
        <>
          <Grid
            xs={2.05}
            sx={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              borderRadius: "10px",
              padding: "1rem 10px",
              height: "100%",
              overflowY: "auto",
              ...ScrollbarStyles,
            }}
          >
            {[
              {
                _id: 1,
                creditor: {
                  businessInformation: { companyName: "Client" },
                },
              },
              ...tabs,
            ]?.map((item, index) => (
              <Button
                key={index}
                sx={{
                  position: "relative",
                  width: "100%",
                  border: `1px solid ${Colors.SKY_BLUE}`,
                  borderRadius: "10px",
                  textTransform: "none",
                  color:
                    activePayment === item?._id ? Colors.WHITE : Colors.BLACK,
                  fontFamily: "Nunito",
                  mb: "10px",
                  fontSize: FONT_SIZE_LARGE,
                  backgroundColor:
                    activePayment === item?._id ? Colors.SKY_BLUE : "none",
                  "&:hover": {
                    background:
                      activePayment === item?._id
                        ? Colors.SKY_BLUE
                        : Colors.lIGHT_PURPLE,
                    color:
                      activePayment === item?._id ? Colors.WHITE : Colors.BLACK,
                  },
                }}
                onClick={() => {
                  setActivePayment(item?._id);
                  setActiveIndex(index - 1);
                }}
              >
                {item?._id !== 1 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor:
                        activePayment === item?._id
                          ? Colors.WHITE
                          : Colors.SKY_BLUE,
                      color:
                        activePayment === item?._id
                          ? Colors.SKY_BLUE
                          : Colors.WHITE,
                      fontSize: "12px",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `2px solid ${Colors.SKY_BLUE}`,
                      zIndex: 1,
                    }}
                  >
                    {priorityBitMap[index - 1] || "-"}
                  </Box>
                )}
                {item?.creditor?.businessInformation?.companyName}
              </Button>
            ))}
          </Grid>
          <Grid
            xs={9.8}
            sx={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              borderRadius: "10px",
              padding: "1rem",
              height: "100%",
              overflowY: "auto",
              ...ScrollbarStyles,
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: 600,
                  fontSize: FONT_SIZE_XL,
                }}
              >
                {activePayment === 1
                  ? "Client Payment plan"
                  : "Creditor Payment plan"}
              </Typography>
              <div>
                {((activePayment === 1 &&
                  data?.debtor?.intervals?.length > 0) ||
                  (activePayment !== 1 &&
                    tabs?.[activeIndex]?.intervals?.length > 0)) && (
                  <TextButton
                    buttonText="Renegotiate"
                    height="2rem"
                    width="8rem"
                    onClick={() => setOpenRenegotiate(true)}
                    backgroundColor={Colors.ORANGE_COLOR}
                    hoverColor={Colors.ORANGE_COLOR}
                    marginRight="10px"
                  />
                )}
                <TextButton
                  buttonText="Save"
                  height="2rem"
                  width="6rem"
                  disabled={
                    activePayment === 1
                      ? isAnyDebtorAmountInvalid
                      : isAnyCreditorAmountInvalid
                  }
                  onClick={handleSave}
                  loading={saveLoading}
                  backgroundColor={Colors.SKY_BLUE}
                  hoverColor={Colors.SKY_BLUE}
                />
              </div>
            </div>
            <div
              style={{
                backgroundColor: Colors.WHITE,
                padding: "1rem",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            >
              <Typography
                sx={{
                  fontSize: FONT_SIZE_MEDIUM,
                  fontFamily: "Nunito",
                }}
              >
                Total Amount:
                <b>
                  {" "}
                  $
                  {activePayment === 1
                    ? data?.debtor?.totalCommission
                    : tabs?.[activeIndex]?.settledAmount &&
                      tabs?.[activeIndex]?.settledAmount > 0
                    ? tabs?.[activeIndex]?.settledAmount
                    : tabs?.[activeIndex]?.remaining}
                </b>
              </Typography>
              {activePayment === 1 && (
                <>
                  <div
                    style={{
                      fontSize: FONT_SIZE_MEDIUM,
                      fontFamily: "Nunito",
                      marginTop: "10px",
                    }}
                  >
                    Commission Percentage:
                    <b> {data?.debtor?.commissionPercentage}%</b>
                    <Tooltip title="Edit Commission" placement="top">
                      <IconButton onClick={() => setOpenDialogue(true)}>
                        <Edit sx={{ fontSize: FONT_SIZE_LARGE }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div
                    style={{
                      fontSize: FONT_SIZE_MEDIUM,
                      fontFamily: "Nunito",
                      marginTop: "10px",
                    }}
                  >
                    Service Fee:
                    <b> ${data?.debtor?.serviceFee || 0}</b>
                    <Tooltip title="Edit Service Fee" placement="top">
                      <IconButton onClick={() => setOpenServiceDialogue(true)}>
                        <Edit sx={{ fontSize: FONT_SIZE_LARGE }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </>
              )}
              {activePayment !== 1 && (
                <div
                  style={{
                    fontSize: FONT_SIZE_MEDIUM,
                    fontFamily: "Nunito",
                    marginTop: "10px",
                  }}
                >
                  Legal Fee:
                  <b> ${tabs?.[activeIndex]?.legalFee || 0}</b>
                  <Tooltip title="Edit Legal Fee" placement="top">
                    <IconButton
                      onClick={() => {
                        setOpenLegalDialogue(true),
                          setLegalFee(tabs?.[activeIndex]?.legalFee);
                      }}
                    >
                      <Edit sx={{ fontSize: FONT_SIZE_LARGE }} />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
              <Typography
                sx={{
                  fontSize: FONT_SIZE_MEDIUM,
                  fontFamily: "Nunito",
                  mt: "10px",
                }}
              >
                Total amount after given interval:
                <b> ${isNaN(totalAmount) ? 0 : totalAmount}</b>
              </Typography>
              {activePayment !== 1 &&
                activeIndex !== null &&
                (() => {
                  const currentItem = tabs[activeIndex];

                  return (
                    <Typography
                      sx={{
                        fontSize: FONT_SIZE_MEDIUM,
                        fontFamily: "Nunito",
                        mt: "10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Priority Bit:
                      <Select
                        value={priorityBitMap[activeIndex] || ""}
                        onChange={(e) => {
                          const newPriority = Number(e.target.value);
                          const duplicateIndex = Object.entries(
                            priorityBitMap
                          ).find(
                            ([key, value]) =>
                              Number(key) !== activeIndex &&
                              value === newPriority
                          )?.[0];

                          if (duplicateIndex !== undefined) {
                            const duplicateItem =
                              tabs[Number(duplicateIndex)]?.creditor
                                ?.businessInformation?.companyName ||
                              "another creditor";
                            setPriorityError(
                              `This priority is already assigned to ${duplicateItem}`
                            );
                            setTimeout(() => setPriorityError(""), 3000);
                            return;
                          }

                          setPriorityBitMap((prev) => ({
                            ...prev,
                            [activeIndex]: newPriority,
                          }));

                          handleUpdatePriorityBit(newPriority, activeIndex);
                        }}
                        displayEmpty
                        sx={{
                          ml: 1,
                          minWidth: 80,
                          height: "32px",
                          fontSize: "14px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: priorityBitMap[activeIndex]
                              ? "#7353F0"
                              : "rgba(0,0,0,0.23)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#7353F0",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#7353F0",
                          },
                        }}
                      >
                        {tabs?.length === 1 && activePayment !== 1 ? (
                          <MenuItem
                            key={1}
                            value={1}
                            sx={{
                              color: "#000000",
                              "&:hover": {
                                backgroundColor: "rgba(115, 83, 240, 0.1)",
                              },
                              "&.Mui-selected": {
                                backgroundColor: "rgba(115, 83, 240, 0.2)",
                                color: "#7353F0",
                              },
                            }}
                          >
                            1
                          </MenuItem>
                        ) : (
                          [...Array(tabs.length)]?.map((_, i) => {
                            const priorityValue = i + 1;
                            const isUsed =
                              Object.values(priorityBitMap).includes(
                                priorityValue
                              ) &&
                              priorityBitMap[activeIndex] !== priorityValue;

                            return (
                              <MenuItem
                                key={priorityValue}
                                value={priorityValue}
                                sx={{
                                  color: isUsed ? "#9e9e9e" : "#000000",
                                  fontStyle: isUsed ? "italic" : "normal",
                                  "&:hover": {
                                    backgroundColor: "rgba(115, 83, 240, 0.1)",
                                  },
                                  "&.Mui-selected": {
                                    backgroundColor: "rgba(115, 83, 240, 0.2)",
                                    color: "#7353F0",
                                  },
                                }}
                              >
                                {priorityValue} {isUsed ? "(Already Used)" : ""}
                              </MenuItem>
                            );
                          })
                        )}
                      </Select>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          onClick={() =>
                            priorityBitMap[activeIndex] &&
                            handleDeletePriorityBit(activeIndex)
                          }
                          sx={{
                            color: Colors.ORANGE_COLOR,
                            fontSize: "12px",
                            fontWeight: "600",
                            fontFamily: "Nunito",
                            marginLeft: ".5rem",
                            cursor: priorityBitMap[activeIndex]
                              ? "pointer"
                              : "not-allowed",
                            opacity: priorityBitMap[activeIndex] ? 1 : 0.5,
                            textDecoration: "underline",
                          }}
                        >
                          Delete Priority
                        </Typography>

                        <span
                          style={{
                            color: Colors.ORANGE_COLOR,
                            marginLeft: ".5rem",
                            fontFamily: "Nunito",
                            fontSize: "12px",
                          }}
                        >
                          {priorityError
                            ? priorityError
                            : "Must Be Unique For Each Creditor"}
                        </span>
                      </div>
                    </Typography>
                  );
                })()}
            </div>
            {activePayment === 1 ? (
              <DebtorPaymentPlan
                intervalCommission={intervalCommission}
                remainingAmount={data?.debtor?.totalCommission}
                newDataList={debtorDataList}
                setNewDataList={setDebtorDataList}
                totalAmount={calculateTotalAmount(debtorDataList)}
                isExempt={isExempt}
                setIsExempt={setIsExempt}
                planExists={false}
              />
            ) : (
              <CreditorPaymentPlan
                remainingAmount={
                  tabs?.[activeIndex]?.settledAmount &&
                  tabs?.[activeIndex]?.settledAmount > 0
                    ? tabs?.[activeIndex]?.settledAmount
                    : tabs?.[activeIndex]?.remaining
                }
                newDataList={creditorDataList}
                setNewDataList={setCreditorDataList}
                totalAmount={calculateTotalAmount(creditorDataList)}
                isExempt={isExempt}
                setIsExempt={setIsExempt}
                planExists={
                  tabs?.[activeIndex]?.intervals?.length > 0 ? true : false
                }
              />
            )}
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: 600,
                fontSize: FONT_SIZE_XL,
                m: "1rem 0px",
              }}
            >
              Payment plan
            </Typography>

            <TransactionDetails
              debtor={activePayment === 1 ? true : false}
              loading={isPaymentLoading}
              paymentDetails={paymentDetails}
              GetCasePaymentDetails={
                activePayment === 1
                  ? getClientPaymentDetails
                  : getCasePaymentDetails
              }
              caseData={caseData}
              currentPaymentPage={currentPaymentPage}
              setCurrentPaymentPage={setCurrentPaymentPage}
              totalPaymentPage={totalPaymentPage}
              getPaymentPlan={getPaymentPlan}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}
