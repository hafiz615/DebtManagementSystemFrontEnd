import React, { useEffect, useRef, useState } from "react";

import { Box, Grid, IconButton, Typography } from "@mui/material";

import PaymentDetails from "./caseCreation/paymentDetails";
import TextButton from "./button";
import { Colors } from "../config/default";
import {
  CancelDebtorPaymentPlan,
  DebtorPaymentPlan,
} from "../services/services";
import { useToast } from "../toast/toastContext";
import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../constants/appConstants";
import DeletePrompt from "./deletePrompt";
import { Close } from "@mui/icons-material";

const lineStyle = {
  width: "100%",
  height: "1px",
  backgroundColor: "#EAEBEB",
  margin: "1rem 0",
};

export default function DebtorPlan({ caseData, handleClose, GetCaseDetails }) {
  const [isExempt, setIsExempt] = useState(caseData?.debtor?.isExempt || false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const today = new Date().toISOString().split("T")[0];
  const [newDataList, setNewDataList] = useState([
    {
      amount: "",
      startDate: today,
      timePeriod: "Weekly",
      frequency: 1,
    },
  ]);
  const prevFrequenciesRef = useRef(
    newDataList?.map((item) => item?.frequency)
  );
  const prevAmountsRef = useRef(newDataList?.map((item) => item?.amount));
  let remaining = caseData?.debtor?.totalCommission;

  const calculateTotalAmount = (data) => {
    let total = 0;
    data?.forEach((item) => {
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
        frequency:
          data?.timePeriod === "Custom"
            ? 1
            : data?.frequency === ""
            ? 1
            : data?.frequency,
      })),
      isExempt: isExempt,
    };

    const resCaseUpdate = await DebtorPaymentPlan(
      caseData?.debtor?._id,
      params
    );
    if (resCaseUpdate?.status === 200) {
      showToast(resCaseUpdate?.data?.message, "success");
      GetCaseDetails(caseData?._id);
      handleClose();
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
    if (caseData && caseData?.debtor?.intervals?.length > 0) {
      const filteredData = caseData?.debtor?.intervals?.map(
        ({ _id, ...rest }) => rest
      );
      setNewDataList(filteredData);
    }
  }, [caseData]);

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
    const res = await CancelDebtorPaymentPlan(caseData?.debtor?._id);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      GetCaseDetails(caseData?._id);
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
          Fee Payment Plan{" "}
          {caseData?.debtor?.intervals?.length > 0 && (
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
        Total Commission:
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
        remainingAmount={remaining}
        newDataList={newDataList}
        setNewDataList={setNewDataList}
        totalAmount={totalAmount}
        errorMessage="Payment Amount must be equal to total commission"
        planExists={caseData?.debtor?.intervals?.length}
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

      <Grid container sx={{ mt: "1rem", justifyContent: "right", gap: "10px" }}>
        {caseData?.debtor?.intervals?.length > 0 && (
          <DeletePrompt
            buttonName="Renegotiate"
            heading="Cancel Client Payment Plan"
            text="Are you sure want to Cancel this client payment plan?"
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
