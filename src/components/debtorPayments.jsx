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
  ArrowBackIosNew,
  ArrowForwardIos,
  Close,
  DateRangeOutlined,
  Edit,
  Info,
  KeyboardDoubleArrowDown,
} from "@mui/icons-material";
import {
  CancelAllDebtorPaymentPlan,
  GetDebtorPayments,
  PauseDebtorPayments,
} from "../services/services";
import { formatDateString } from "../common";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_SMALL,
  FONT_SIZE_XL,
} from "../constants/appConstants";
import ScrollbarStyles from "./customScroll";
import { useToast } from "../toast/toastContext";

const labelStyles = {
  fontFamily: "Nunito",
  fontSize: FONT_SIZE_LARGE,
  fontWeight: 600,
};

const labels = [
  { text: "Amount", width: "12.5%" },
  { text: "Date", width: "12.5%" },
  { text: "Time Period", width: "12.5%" },
  { text: "Service Fee", width: "12.5%" },
  { text: "Legal Fee", width: "12.5%" },
  { text: "Commission", width: "12.5%" },
  { text: "Creditor Payments", width: "15%" },
  { text: "Actions", width: "9%" },
];

export default function DebtorPayments({
  handleClose,
  caseData,
  GetCaseDetails,
}) {
  const [data, setData] = useState();
  const [amount, setAmount] = useState();
  const [total, setTotal] = useState();
  const [date, setDate] = useState();
  const [totalPage, setTotalPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentId, setPaymentId] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amountLoading, setAmountLoading] = useState(false);
  const [moveLoading, setMoveLoading] = useState(false);
  const [openAmountModal, setOpenAmountModal] = useState(false);
  const [openDateModal, setOpenDateModal] = useState(false);
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const [openNegotiateModal, setOpenNegotiateModal] = useState(false);
  const [openCreditor, setOpenCreditor] = useState(false);
  const [creditorData, setCreditorData] = useState(false);
  const [error, setError] = useState(false);
  const totalPages = Math.ceil(totalPage / 5);

  const { showToast } = useToast();

  const handleAmountModalOpen = (item) => {
    setTotal(item?.total);
    setOpenAmountModal(true);
    setAmount(item?.amount);
    setPaymentId(item?._id);
  };

  const handleDateModalOpen = (item) => {
    setOpenDateModal(true);
    setDate(item?.dueDate?.slice(0, 10));
    setPaymentId(item?._id);
  };

  const handleMoveModalOpen = (item) => {
    setOpenMoveModal(true);
    setPaymentId(item?._id);
  };

  const handleCreditorModalOpen = (item) => {
    setCreditorData(item);
    setOpenCreditor(true);
  };

  const handleAmountModalClose = () => setOpenAmountModal(false);
  const handleDateModalClose = () => setOpenDateModal(false);

  const getDebtorPayments = async (noLoading) => {
    if (!noLoading) {
      setLoading(true);
    }
    const res = await GetDebtorPayments(caseData?.debtor?._id, currentPage);
    if (res?.status === 200) {
      setData(res?.data?.data?.payments);
      setTotalPage(res?.data?.data?.totalCount);
    }
    setLoading(false);
  };

  const moveToLast = async () => {
    setMoveLoading(true);
    const payload = {
      paymentId: paymentId,
      endDate: null,
      amount: null,
    };
    const res = await PauseDebtorPayments(caseData?.debtor?._id, payload);
    if (res?.status === 200) {
      getDebtorPayments(true);
      showToast(res?.data?.message, "success");
      setOpenMoveModal(false);
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setMoveLoading(false);
  };

  const handleAmountUpdate = async () => {
    setAmountLoading(true);
    const payload = {
      paymentId: paymentId,
      amount: amount,
      endDate: null,
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
      amount: null,
      paymentId: null,
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

  const handleReNegotiate = async () => {
    const res = await CancelAllDebtorPaymentPlan(caseData?.debtor?._id);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      handleClose();
      GetCaseDetails(caseData?._id);
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  useEffect(() => {
    getDebtorPayments();
  }, []);

  useEffect(() => {
    getDebtorPayments(true);
  }, [currentPage]);

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
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontSize: FONT_SIZE_LARGE,
              color: Colors.SKY_BLUE,
            }}
          >
            Total: {total ? `$${total}` : "$0"}
          </Typography>
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

          {total > amount && (
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_SMALL,
                mt: "10px",
                color: Colors.ORANGE_COLOR,
              }}
            >
              Amount cannot be less than total.
            </Typography>
          )}
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
              disabled={total > amount}
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
            onChange={(e) => {
              const selectedDate = new Date(e.target.value);
              const day = selectedDate.getDay();
              if (day === 0) {
                setError(true);
                setDate("");
              } else {
                setDate(e.target.value);
                setError(false);
              }
            }}
          />
          {error && (
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_SMALL,
                mt: "10px",
                color: Colors.ORANGE_COLOR,
              }}
            >
              Sundays are not allowed. Please select a weekday.
            </Typography>
          )}

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
              disabled={error}
              loading={amountLoading}
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
            />
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openNegotiateModal}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "5px",
            width: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
          Renegotiate
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontSize: FONT_SIZE_LARGE,
            }}
          >
            Are you sure you want to renegotiate?
          </Typography>
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
              onClick={() => setOpenNegotiateModal(false)}
              backgroundColor={Colors.ORANGE_COLOR}
              hoverColor={Colors.ORANGE_COLOR}
            />
            <TextButton
              buttonText="Confirm"
              height="2rem"
              width="8rem"
              onClick={handleReNegotiate}
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
            />
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openMoveModal}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "5px",
            width: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
          Move Payment To The Last
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontSize: FONT_SIZE_LARGE,
            }}
          >
            Are you sure you want to move this payment to the last?
          </Typography>
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
              onClick={() => setOpenMoveModal(false)}
              backgroundColor={Colors.ORANGE_COLOR}
              hoverColor={Colors.ORANGE_COLOR}
            />
            <TextButton
              buttonText="Confirm"
              height="2rem"
              width="8rem"
              onClick={moveToLast}
              loading={moveLoading}
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
            />
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openCreditor}
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontSize: "1.25rem",
              fontWeight: "600",
            }}
          >
            Creditor Payments
          </Typography>
          <IconButton onClick={() => setOpenCreditor(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
                fontWeight: "600",
              }}
            >
              Creditor Name
            </Typography>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
                fontWeight: "600",
              }}
            >
              Amount
            </Typography>
          </div>
          {creditorData?.creditorPayments?.map((item) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontSize: FONT_SIZE_LARGE,
                }}
              >
                {item?.creditorName}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontSize: FONT_SIZE_LARGE,
                }}
              >
                ${item?.amount?.toFixed(2)}
              </Typography>
            </div>
          ))}
        </DialogContent>
      </Dialog>
      {loading ? (
        <Grid
          container
          sx={{
            justifyContent: "center",
            alignItems: "center",
            height: "37vh",
          }}
        >
          <CircularProgress sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : data?.length === 0 ? (
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
              height: "35vh",
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
              justifyContent: "space-between",
              marginBottom: 10,
              padding: "0 1rem",
            }}
          >
            {labels.map(({ text, width }) => (
              <Typography
                key={text}
                sx={{ ...labelStyles, ...(width && { width }) }}
              >
                {text}
              </Typography>
            ))}
          </div>
          <Grid
            sx={{
              height: "35vh",
              overflowY: "auto",
              ...ScrollbarStyles,
              p: "0px 10px",
            }}
          >
            {data?.map((item, index) => (
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
                    width: "14%",
                  }}
                >
                  ${item?.amount?.toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    width: "14%",
                  }}
                >
                  {formatDateString(item?.dueDate)}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    width: "14%",
                  }}
                >
                  {item?.timePeriod}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    width: "14%",
                    color: "#888888",
                  }}
                >
                  ${item?.serviceFee?.toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    width: "14%",
                    color: "#888888",
                  }}
                >
                  ${item?.legalFee?.toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    width: "14%",
                    color: "#888888",
                  }}
                >
                  ${item?.commissionFee?.toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    display: "flex",
                    alignItems: "center",
                    width: "14%",
                  }}
                >
                  ${item?.creditorsAmount?.toFixed(2)}
                  <Tooltip title="Click for more details" placement="top">
                    <IconButton onClick={() => handleCreditorModalOpen(item)}>
                      <Info sx={{ color: Colors.SKY_BLUE }} />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title="Update Amount" placement="top">
                    <IconButton onClick={() => handleAmountModalOpen(item)}>
                      <Edit
                        sx={{ color: Colors.DARK_GRAY, fontSize: "20px" }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Update Date" placement="top">
                    <IconButton onClick={() => handleDateModalOpen(item)}>
                      <DateRangeOutlined
                        sx={{ color: Colors.SKY_BLUE, fontSize: "20px" }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title="Move this payment to the last"
                    placement="top"
                  >
                    <IconButton onClick={() => handleMoveModalOpen(item)}>
                      <KeyboardDoubleArrowDown
                        sx={{
                          color: Colors.ORANGE_COLOR,
                          fontSize: "20px",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            ))}
          </Grid>
          <Grid>
            <Grid
              container
              item
              sx={{ justifyContent: "flex-end", mb: "10px" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ArrowBackIosNew
                    sx={{ fontSize: FONT_SIZE_XL, color: Colors.BLACK }}
                  />
                </IconButton>
                <Typography
                  sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
                >
                  {`${currentPage} of ${totalPages}`}
                </Typography>
                <IconButton
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ArrowForwardIos
                    sx={{ fontSize: FONT_SIZE_XL, color: Colors.BLACK }}
                  />
                </IconButton>
              </div>
            </Grid>
          </Grid>

          <Grid container item sx={{ justifyContent: "flex-end" }}>
            <TextButton
              buttonText="Re Negotiate"
              height="2rem"
              width="8rem"
              onClick={() => setOpenNegotiateModal(true)}
              backgroundColor={Colors.ORANGE_COLOR}
              hoverColor={Colors.ORANGE_COLOR}
            />
          </Grid>
        </>
      )}
    </div>
  );
}
