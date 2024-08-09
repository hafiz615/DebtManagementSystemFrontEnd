import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

function PaymentCardDetails({ setConnectPayment }) {
  const [type, setType] = useState("cc");

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      handleTypeChange(newAlignment);
    } else {
      window.CollectJS.startPaymentRequest();
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
  };

  useEffect(() => {
    window.CollectJS.configure({
      variant: "lightbox",
      paymentType: type,
      callback: (token) => {
        setConnectPayment({
          paymentToken: token?.token,
          paymentType: type,
        });
      },
    });
  }, [type]);

  return (
    <Grid item sx={{ zIndex: "9999" }}>
      <ToggleButtonGroup
        style={{ height: "2.5rem", fontFamily: "Nunito" }}
        color="primary"
        value={type}
        exclusive
        onChange={handleChange}
        aria-label="Payment Type"
      >
        <ToggleButton
          style={{ fontFamily: "Nunito" }}
          value="cc"
          onClick={() => window.CollectJS.startPaymentRequest()}
        >
          CC
        </ToggleButton>
        <ToggleButton
          style={{ fontFamily: "Nunito" }}
          value="ck"
          onClick={() => window.CollectJS.startPaymentRequest()}
        >
          ACH
        </ToggleButton>
      </ToggleButtonGroup>
      <div id="paymentTokenInfo"></div>
    </Grid>
  );
}

export default PaymentCardDetails;
