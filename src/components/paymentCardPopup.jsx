import React, { useState } from "react";
import { Grid, Typography, TextField, MenuItem } from "@mui/material";
import Button from "./button";
import { Colors } from "../config/default";
import Dropdown from "./dropdown";
import { useToast } from "../toast/toastContext";
import { AddManualPayment } from "../services/services";
import AmountTextField from "./amountTextField";

function PaymentCardPopup({ amountValue, paymentId, caseId, handleClose }) {
  const { showToast } = useToast();

  const menuItems = [
    { label: "Wire", value: "Wire" },
    { label: "Check", value: "Check" },
    { label: "Cash", value: "Cash" },
  ];
  const [selectedValue, setSelectedValue] = useState("");
  const [amount, setAmount] = useState(amountValue);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [referenceId, SetReferenceId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAmountChange = (e) => setAmount(parseFloat(e.target.value) || "");
  const handleDateChange = (e) => setDate(e.target.value);
  const handleReferenceId = (e) => SetReferenceId(e.target.value) || "";

  const handleSubmit = async () => {
    setLoading(true);
    const params = {
      caseId: caseId,
      transactionId: paymentId,
      amount: amount,
      transactionDate: date,
      referenceId: referenceId,
      transactionType: selectedValue,
    };
    const AddManualPaymentRes = await AddManualPayment(params);
    if (AddManualPaymentRes?.status === 200) {
      showToast(AddManualPaymentRes?.data?.message, "success");
      handleClose();
    } else if (AddManualPaymentRes?.response?.status === 400) {
      const errorMessage = AddManualPaymentRes?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  return (
    <Grid
      container
      direction="column"
      spacing={2}
      className="payment-card-popup"
    >
      <Grid item>
        <Typography variant="h6">Payment Details</Typography>
      </Grid>

      <Grid
        item
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <AmountTextField
          width="100%"
          value={amount}
          onChange={(e) => handleAmountChange(e)}
          disabled={true}
        />
        <input
          type="text"
          value={referenceId}
          onChange={handleReferenceId}
          placeholder="Enter Reference Id"
          style={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            height: "2.5rem",
            color: Colors.DIM_LIGHT_GRAY,
            paddingLeft: "1rem",
            outline: "none",
            border: "1px solid transparent",
            borderRadius: "5px",
            marginBottom: "1rem",
            width: "100%",
            fontFamily: "Nunito",
          }}
        />
      </Grid>

      <Grid
        item
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          placeholder="Enter Date"
          style={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            height: "2.5rem",
            color: Colors.DIM_LIGHT_GRAY,
            paddingLeft: "1rem",
            outline: "none",
            border: "1px solid transparent",
            borderRadius: "5px",
            marginBottom: "1rem",
            width: "100%",
            fontFamily: "Nunito",
          }}
        />

        <Dropdown
          menuWidth="22rem"
          height="2.5rem"
          menuItems={menuItems}
          placeholder="Select Payment Type"
          backgroundColor={Colors.BG_LIGHT_GRAY}
          hoverColor={Colors.BG_LIGHT_GRAY}
          width="100%"
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
      </Grid>

      <Grid item sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          buttonText="Add Payment"
          onClick={handleSubmit}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
}

export default PaymentCardPopup;
