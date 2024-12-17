import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Colors } from "../config/default";

function PaymentCardDetails({ paymentGateway, setConnectPayment }) {
  const [type, setType] = useState("cc");

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      handleTypeChange(newAlignment);
    } else {
      window?.CollectJS?.startPaymentRequest();
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
  };

  useEffect(() => {
    window?.CollectJS?.configure({
      variant: "lightbox",
      paymentType: type,
      callback: (token) => {
        setConnectPayment({
          paymentToken: token?.token,
          paymentType: type,
          platform: "easypay",
        });
      },
    });
  }, [type]);

  return (
    <Grid item sx={{ zIndex: "1" }}>
      <ToggleButtonGroup
        style={{ height: "2rem", fontFamily: "Nunito" }}
        color="primary"
        value={type}
        exclusive
        onChange={handleChange}
        aria-label="Payment Type"
      >
        <ToggleButton
          style={{
            fontFamily: "Nunito",
            backgroundColor: Colors.VIOLET,
            color: Colors.SKY_BLUE,
            fontSize: "10px",
          }}
          value="cc"
          onClick={() => window.CollectJS.startPaymentRequest()}
        >
          CC
        </ToggleButton>
        <ToggleButton
          style={{
            fontFamily: "Nunito",
            color: Colors.SKY_BLUE,
            fontSize: "10px",
          }}
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
