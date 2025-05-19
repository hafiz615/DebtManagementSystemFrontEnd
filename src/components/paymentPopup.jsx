import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import PaymentProcess from "./radioPayment";
import TextButton from "./button";
import { Colors } from "../config/default";
import { CancelPaymentPlan, CreatePaymentPlan } from "../services/services";
import { useToast } from "../toast/toastContext";
import { calculateNextWeek } from "../common";
import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../constants/appConstants";
import DeletePrompt from "./deletePrompt";
import { Close } from "@mui/icons-material";
import CreditorPaymentPlan from "./paymentPlan/creditorPaymentPlan";

const lineStyle = {
  width: "100%",
  height: "1px",
  backgroundColor: "#EAEBEB",
  margin: "1rem 0",
};

export default function PaymentPopup({
  data,
  handleClose,
  GetCaseDetails,
  GetCasePaymentDetails,
  settlementRange,
  weeksTillPaid,
  caseId,
  remainingAmount,
  closePopup,
  commission,
  setPaymentChanged,
  getAttorneyData,
}) {
  const [feePayment, setFeePayment] = useState(data?.feePayment || "toPay");
  const [totalAmount, setTotalAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showToast } = useToast();
  const { id } = useParams();
  const today = new Date().toISOString().split("T")[0];
  const [isExempt, setIsExempt] = useState(data?.isExempt || false);

  const [newDataList, setNewDataList] = useState([
    {
      amount: settlementRange || "",
      startDate: weeksTillPaid ? calculateNextWeek() : today,
      timePeriod: weeksTillPaid ? "Weekly" : "Custom",
      frequency: weeksTillPaid || 1,
    },
  ]);
  const prevFrequenciesRef = useRef(
    newDataList?.map((item) => item?.frequency)
  );
  const prevAmountsRef = useRef(newDataList?.map((item) => item?.amount));
  let remaining = remainingAmount;

  const calculateTotalAmount = (data) => {
    let total = 0;
    data.forEach((item) => {
      const frequency = item.frequency || 1;
      total += item.amount * frequency;
    });
    return total;
  };

  const handleUpdate = async () => {
    setLoading(true);
    const params = {
      intervals: newDataList?.map((data) => ({
        ...data,
        frequency: data?.frequency === "" ? 1 : data?.frequency,
      })),
      feePayment: feePayment,
      isExempt: isExempt,
      commission: commission,
    };
    const updateCaseId = caseId || data?._id;
    const resCaseUpdate = await CreatePaymentPlan(params, updateCaseId);
    if (resCaseUpdate?.status === 200) {
      setPaymentChanged && setPaymentChanged(true);
      showToast(resCaseUpdate?.data?.message, "success");
      GetCaseDetails && GetCaseDetails(id);
      GetCasePaymentDetails && GetCasePaymentDetails(id);
      getAttorneyData && getAttorneyData();
      handleClose();
      closePopup && closePopup();
    } else {
      const errorMessage = resCaseUpdate?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    const newTotal = calculateTotalAmount(newDataList);
    setTotalAmount(newTotal);
  }, [newDataList]);

  useEffect(() => {
    if (data && data?.intervals?.length !== 0) {
      const filteredData = data.intervals.map(({ _id, ...rest }) => rest);
      setNewDataList(filteredData);
    }
  }, [data]);

  useEffect(() => {
    if (!isExempt) {
      const currentFrequencies = newDataList?.map((item) => item.frequency);
      const prevFrequencies = prevFrequenciesRef.current;
      const hasLengthChanged =
        currentFrequencies?.length !== prevFrequencies?.length;
      const hasFrequencyChanged = currentFrequencies?.some(
        (freq, index) => freq !== prevFrequencies?.[index]
      );
      const totalFrequency = currentFrequencies.reduce(
        (acc, freq) => acc + freq,
        0
      );
      if (hasFrequencyChanged || hasLengthChanged) {
        const newAmount = totalFrequency ? remaining / totalFrequency : 0;
        const updatedDataList = newDataList.map((item) => ({
          ...item,
          amount: item.frequency ? newAmount : item.amount,
        }));
        setNewDataList(updatedDataList);
      }
      prevFrequenciesRef.current = currentFrequencies;
    }
  }, [newDataList, remaining]);

  useEffect(() => {
    if (!isExempt) {
      const currentAmounts = newDataList?.map((item) => item.amount);
      const prevAmounts = prevAmountsRef.current;
      const hasLengthChanged = currentAmounts?.length !== prevAmounts?.length;
      const hasAmountChanged = currentAmounts?.some(
        (amount, index) => amount !== prevAmounts?.[index]
      );
      const totalAmount = currentAmounts.reduce((acc, amo) => acc + amo, 0);
      if (hasAmountChanged || hasLengthChanged) {
        const newFrequency = totalAmount ? remaining / totalAmount : 0;
        const updatedDataList = newDataList.map((item) => ({
          ...item,
          frequency: item.amount ? Math.round(newFrequency) : item.frequency,
        }));
        setNewDataList(updatedDataList);
      }
      prevAmountsRef.current = currentAmounts;
    }
  }, [newDataList, remaining]);

  const handleDeletePayment = async () => {
    setDeleteLoading(true);
    const updateCaseId = caseId || data?._id;
    const res = await CancelPaymentPlan(updateCaseId);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      GetCaseDetails && GetCaseDetails(id);
      GetCasePaymentDetails && GetCasePaymentDetails(id);
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setDeleteLoading(false);
  };

  return (
    <div>
      <Box
        sx={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "600",
            fontSize: FONT_SIZE_XL,
          }}
        >
          Settlement Plan Automation{" "}
          {data?.intervals?.length > 0 && (
            <span
              style={{
                fontFamily: "Nunito",
                fontWeight: "600",
                fontSize: FONT_SIZE_XL,
                color: Colors.SKY_BLUE,
              }}
            >
              (Plan Already In Progress)
            </span>
          )}
        </Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>
      <Box sx={lineStyle} />

      <Typography
        sx={{
          fontSize: FONT_SIZE_LARGE,
          fontFamily: "Nunito",
          margin: "10px 0px",
        }}
      >
        Remaining Amount:
        <b> ${isNaN(remaining) ? 0 : remaining}</b>
      </Typography>
      <Typography
        sx={{
          fontSize: FONT_SIZE_LARGE,
          fontFamily: "Nunito",
          margin: "10px 0px",
        }}
      >
        Total amount after given interval:
        <b> ${isNaN(totalAmount) ? 0 : totalAmount?.toFixed(2)}</b>
      </Typography>

      <CreditorPaymentPlan
        remainingAmount={remaining || data?.remaining}
        newDataList={newDataList}
        setNewDataList={setNewDataList}
        totalAmount={totalAmount}
        isExempt={isExempt}
        planExists={data?.intervals?.length}
      />

      <div style={{ display: "flex", margin: "1rem 0rem" }}>
        <input
          type="checkbox"
          checked={isExempt}
          onChange={() => setIsExempt(!isExempt)}
          style={{
            appearance: "radio",
            accentColor: Colors.SKY_BLUE,
          }}
        />
        <Typography
          sx={{
            fontSize: FONT_SIZE_LARGE,
            fontFamily: "Nunito",
            fontWeight: "700",
          }}
        >
          Exempt
        </Typography>
      </div>

      <PaymentProcess feePayment={feePayment} setFeePayment={setFeePayment} />

      <Grid container sx={{ mt: "1rem", justifyContent: "right", gap: "10px" }}>
        {data?.intervals?.length > 0 && (
          <DeletePrompt
            buttonName="Renegotiate"
            heading="Cancel Payment Plan"
            text="Are you sure want to Cancel this payment plan?"
            handleConfirm={handleDeletePayment}
            loading={deleteLoading}
          />
        )}

        <TextButton
          buttonText="Save"
          height="2rem"
          width="8rem"
          onClick={handleUpdate}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={loading}
          disabled={!newDataList[0]?.amount}
        />
      </Grid>
    </div>
  );
}
