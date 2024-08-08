import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Grid } from "@mui/material";

import PaymentDetails from "./caseCreation/paymentDetails";
import PaymentProcess from "./radioPayment";
import TextButton from "./button";
import { Colors } from "../config/default";
import { UpdateCase } from "../services/services";
import { useToast } from "../toast/toastContext";

export default function PaymentPopup({
  data,
  handleClose,
  GetCaseDetails,
  GetCasePaymentDetails,
}) {
  const [feePayment, setFeePayment] = useState("toPay");
  const [totalAmount, setTotalAmount] = useState();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { id } = useParams();

  const today = new Date().toISOString().split("T")[0];
  const [newDataList, setNewDataList] = useState([
    {
      amount: "",
      startDate: today,
      timePeriod: "Custom",
      frequency: 1,
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
    if (data?.intervals?.length !== 0) {
      const filteredData = data.intervals.map(({ _id, ...rest }) => rest);
      setNewDataList(filteredData);
    }
  }, [data]);

  const handleUpdate = async () => {
    setLoading(true);
    const params = {
      intervals: newDataList,
      feePayment: feePayment,
    };
    const caseId = data?._id;
    const resCaseUpdate = await UpdateCase(params, caseId);
    if (resCaseUpdate?.status === 200) {
      showToast(resCaseUpdate?.data?.message, "success");
      GetCaseDetails(id);
      GetCasePaymentDetails(id);
      handleClose();
    } else {
      const errorMessage = resCaseUpdate?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  return (
    <div>
      {/* <Typography>{data?.remaining}</Typography> */}
      <PaymentDetails
        remainingAmount={data?.remaining}
        newDataList={newDataList}
        setNewDataList={setNewDataList}
        totalAmount={totalAmount}
      />
      <PaymentProcess
        feePayment={data?.feePayment || feePayment}
        setFeePayment={setFeePayment}
      />
      <Grid container xs={12} sx={{ mt: "1rem", justifyContent: "right" }}>
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
