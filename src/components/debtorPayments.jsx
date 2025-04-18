import React, { useEffect, useState } from "react";
import { Colors } from "../config/default";
import TextButton from "./button";
import {
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
} from "@mui/material";
import {
  Close,
  DateRangeOutlined,
  Edit,
  KeyboardDoubleArrowDown,
} from "@mui/icons-material";
import { GetDebtorPayments, PauseDebtorPayments } from "../services/services";
import { formatDateString } from "../common";
import { FONT_SIZE_LARGE } from "../constants/appConstants";
import ScrollbarStyles from "./customScroll";
import { useToast } from "../toast/toastContext";

export default function DebtorPayments({
  handleClose,
  caseData,
  GetCaseDetails,
}) {
  const [data, setData] = useState();
  const [amount, setAmount] = useState();
  const [date, setDate] = useState();
  const [paymentId, setPaymentId] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amountLoading, setAmountLoading] = useState(false);
  const [openAmountModal, setOpenAmountModal] = useState(false);
  const [openDateModal, setOpenDateModal] = useState(false);

  const { showToast } = useToast();

  const handleAmountModalOpen = (item) => {
    setOpenAmountModal(true);
    setAmount(item?.amount);
    setPaymentId(item?._id);
  };

  const handleDateModalOpen = (item) => {
    setOpenDateModal(true);
    setDate(item?.dueDate?.slice(0, 10));
    setPaymentId(item?._id);
  };

  const handleAmountModalClose = () => setOpenAmountModal(false);
  const handleDateModalClose = () => setOpenDateModal(false);

  const getDebtorPayments = async (noLoading) => {
    if (!noLoading) {
      setLoading(true);
    }
    const res = await GetDebtorPayments(caseData?.debtor?._id);
    if (res?.status === 200) {
      setData(res?.data?.data);
    }
    setLoading(false);
  };

  const moveToLast = async (id) => {
    const payload = {
      paymentId: id,
    };
    const res = await PauseDebtorPayments(caseData?.debtor?._id, payload);
    if (res?.status === 200) {
      getDebtorPayments(true);
      showToast(res?.data?.message, "success");
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  const handleAmountUpdate = async () => {
    setAmountLoading(true);
    const payload = {
      paymentId: paymentId,
      amount: amount,
    };
    const res = await PauseDebtorPayments(caseData?.debtor?._id, payload);
    if (res?.status === 200) {
      setOpenAmountModal(false);
      getDebtorPayments(true);
      showToast(res?.data?.message, "success");
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setAmountLoading(false);
  };

  const handleDateUpdate = async () => {
    setAmountLoading(true);
    const payload = {
      endDate: date,
    };
    if (!isChecked) {
      payload.paymentId = paymentId;
    }
    const res = await PauseDebtorPayments(caseData?.debtor?._id, payload);
    if (res?.status === 200) {
      setOpenDateModal(false);
      getDebtorPayments(true);
      showToast(res?.data?.message, "success");
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setAmountLoading(false);
  };

  useEffect(() => {
    getDebtorPayments();
  }, []);

  return (
    <div>
      <Dialog
        open={openAmountModal}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "5px",
            width: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
          Update Amount
        </DialogTitle>
        <DialogContent>
          <input
            min={0}
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
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
              onClick={handleAmountModalClose}
              backgroundColor={Colors.ORANGE_COLOR}
              hoverColor={Colors.ORANGE_COLOR}
            />
            <TextButton
              buttonText="Update"
              height="2rem"
              width="8rem"
              onClick={handleAmountUpdate}
              loading={amountLoading}
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
            />
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDateModal}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "5px",
            width: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
          Update Date
        </DialogTitle>
        <DialogContent>
          <input
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
            placeholder="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontSize: FONT_SIZE_LARGE,
              mt: "10px",
            }}
          >
            Do you want to move all the payments
          </Typography>
          <Switch
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: Colors.SKY_BLUE,
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: Colors.SKY_BLUE,
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <div
            style={{
              marginTop: "1rem",
              gap: "1em",
              display: "flex",
              justifyContent: "right",
            }}
          >
            <TextButton
              buttonText="Cancel"
              height="2rem"
              width="8rem"
              onClick={handleDateModalClose}
              backgroundColor={Colors.ORANGE_COLOR}
              hoverColor={Colors.ORANGE_COLOR}
            />
            <TextButton
              buttonText="Update"
              height="2rem"
              width="8rem"
              onClick={handleDateUpdate}
              loading={amountLoading}
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
            />
          </div>
        </DialogActions>
      </Dialog>
      {loading ? (
        <Grid
          container
          sx={{
            justifyContent: "center",
            alignItems: "center",
            height: "35vh",
          }}
        >
          <CircularProgress sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : data?.payments?.length === 0 ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: 600, fontFamily: "Nunito" }}>
              Pause Payments
            </Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
          <Grid
            container
            sx={{
              justifyContent: "center",
              alignItems: "center",
              height: "32vh",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
              }}
            >
              No client payment exist
            </Typography>
          </Grid>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: 600, fontFamily: "Nunito" }}>
              Pause Payments
            </Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "2.5rem",
              alignItems: "center",
              marginBottom: "10px",
              padding: "0px 10px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
                width: "30%",
                fontWeight: "600",
              }}
            >
              Amount
            </Typography>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
                width: "25%",
                fontWeight: "600",
              }}
            >
              Date
            </Typography>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
                width: "32%",
                fontWeight: "600",
              }}
            >
              Time Period
            </Typography>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
                fontWeight: "600",
              }}
            >
              Actions
            </Typography>
          </div>
          <Grid
            sx={{
              height: "30vh",
              overflowY: "auto",
              ...ScrollbarStyles,
              p: "0px 10px",
            }}
          >
            {data?.payments?.map((item, index) => (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "2.5rem",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                  border: `1px solid ${Colors.SKY_BLUE}`,
                  borderRadius: "10px",
                  padding: "5px 1rem",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                  }}
                >
                  ${item?.amount?.toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                  }}
                >
                  {formatDateString(item?.dueDate)}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                  }}
                >
                  {item?.timePeriod}
                </Typography>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title="Update Amount" placement="top">
                    <IconButton onClick={() => handleAmountModalOpen(item)}>
                      <Edit sx={{ fontSize: "20px" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Update Date" placement="top">
                    <IconButton onClick={() => handleDateModalOpen(item)}>
                      <DateRangeOutlined sx={{ fontSize: "20px" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title="Move this payment to the last"
                    placement="top"
                  >
                    <IconButton
                      disabled={index === data?.payments?.length - 1}
                      onClick={() => moveToLast(item?._id)}
                    >
                      <KeyboardDoubleArrowDown sx={{ fontSize: "20px" }} />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
}
