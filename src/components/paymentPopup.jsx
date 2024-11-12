import React, { useEffect, useRef, useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { useParams } from "react-router-dom";

import { Box, Grid, Typography } from "@mui/material";

import PaymentDetails from "./caseCreation/paymentDetails";
import PaymentProcess from "./radioPayment";
import TextButton from "./button";
import { Colors } from "../config/default";
import { GetWeeklyAndTotalCommission, UpdateCase } from "../services/services";
import { useToast } from "../toast/toastContext";
import { calculateNextWeek } from "../common";
import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../constants/appConstants";

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
}) {
  const [feePayment, setFeePayment] = useState(data?.feePayment || "toPay");
  const [totalAmount, setTotalAmount] = useState();
  const [loading, setLoading] = useState(false);
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
    const resCaseUpdate = await UpdateCase(params, updateCaseId);
    if (resCaseUpdate?.status === 200) {
      setPaymentChanged && setPaymentChanged(true);
      showToast(resCaseUpdate?.data?.message, "success");
      GetCaseDetails && GetCaseDetails(id);
      GetCasePaymentDetails && GetCasePaymentDetails(id);
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

  return (
    <div>
      <Typography
        sx={{
          fontFamily: "Nunito",
          fontWeight: "600",
          fontSize: FONT_SIZE_XL,
        }}
      >
        Settlement Plan Automation
      </Typography>
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

      <PaymentDetails
        remainingAmount={remaining || data?.remaining}
        newDataList={newDataList}
        setNewDataList={setNewDataList}
        totalAmount={totalAmount}
        isExempt={isExempt}
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
