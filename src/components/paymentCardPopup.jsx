import React, { useState } from "react";
import { Grid, Typography, TextField, MenuItem } from "@mui/material";
import Button from "./button";
import { Colors } from "../config/default";
import Dropdown from "./dropdown";

function PaymentCardPopup({ paymentId }) {
  const menuItems = [
    { label: "Wire", value: "Wire" },
    { label: "Check", value: "Check" },
    { label: "Cash", value: "Cash" },
  ];
  const [selectedValue, setSelectedValue] = useState([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [paymentType, setPaymentType] = useState("Wire"); // Default to 'Wire'

  const handleAmountChange = (e) => setAmount(parseFloat(e.target.value) || "");
  const handleDateChange = (e) => setDate(e.target.value);
  const handlePaymentTypeChange = (e) => setPaymentType(e.target.value);

  const handleSubmit = () => {
    console.log({
      paymentId,
      amount,
      date,
      paymentType,
    });
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

      <Grid item>
        <TextField
          fullWidth
          label="Amount"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          InputProps={{
            inputProps: {
              step: "0.01",
            },
          }}
          placeholder="Enter amount"
          error={!amount && Boolean(amount)}
        />
      </Grid>

      <Grid item>
        <TextField
          fullWidth
          label="Date"
          type="date"
          value={date}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item>
        <Dropdown
          menuWidth="22rem"
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
          buttonText="Pay"
          onClick={handleSubmit}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      </Grid>
    </Grid>
  );
}

export default PaymentCardPopup;
