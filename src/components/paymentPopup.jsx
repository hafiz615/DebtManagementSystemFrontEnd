import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Grid, Typography } from "@mui/material";

import PaymentDetails from "./caseCreation/paymentDetails";
import PaymentProcess from "./radioPayment";
import TextButton from "./button";
import { Colors } from "../config/default";
import { UpdateCase } from "../services/services";
import { useToast } from "../toast/toastContext";
import { calculateNextWeek } from "../common";
import { FONT_SIZE_LARGE } from "../constants/appConstants";

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
}) {
  const [feePayment, setFeePayment] = useState(data?.feePayment || "toPay");
  const [totalAmount, setTotalAmount] = useState();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { id } = useParams();
  const nextWeekDate = useState(calculateNextWeek());
  const today = new Date().toISOString().split("T")[0];
  const [isExempt, setIsExempt] = useState(data?.isExempt || false);
  const [newDataList, setNewDataList] = useState([
    {
      amount: settlementRange || "",
      startDate: weeksTillPaid ? nextWeekDate : today,
      timePeriod: settlementRange ? "Weekly" : "Custom",
      frequency: weeksTillPaid || 1,
    },
  ]);

  const calculateTotalAmount = (data) => {
    let total = 0;
    data.forEach((item) => {
      const frequency = item.frequency || 1;
      total += item.amount * frequency;
    });
    return total;
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

  const handleUpdate = async () => {
    setLoading(true);
    const params = {
      intervals: newDataList,
      feePayment: feePayment,
      isExempt: isExempt,
    };
    const updateCaseId = caseId || data?._id;
    const resCaseUpdate = await UpdateCase(params, updateCaseId);
    if (resCaseUpdate?.status === 200) {
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

  let remaining =
    remainingAmount && remainingAmount.replace("$", "").replace(",", "");

  return (
    <div>
      <PaymentDetails
        remainingAmount={remaining || data?.remaining}
        newDataList={newDataList}
        setNewDataList={setNewDataList}
        totalAmount={totalAmount}
        isExempt={isExempt}
      />
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <input
          type="checkbox"
          checked={isExempt}
          onChange={() => setIsExempt(!isExempt)}
          style={{ appearance: "radio" }}
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

      <Grid container sx={{ mt: "1rem", justifyContent: "right" }}>
        <TextButton
          buttonText="Save"
          height="2rem"
          width="8rem"
          onClick={handleUpdate}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={loading}
        />
      </Grid>
    </div>
  );
}
