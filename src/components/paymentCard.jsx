import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Colors } from "../config/default";

function PaymentCardDetails({ paymentGateway, setConnectPayment }) {
  const [type, setType] = useState("cc");

  // Dynamically load the script for the selected payment gateway
  const loadScript = (src, dataKey) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      console.log(`${src} is already loaded.`);
      return;
    }

    // Check if 'apple-spinner' is already defined
    if (customElements.get("apple-spinner")) {
      console.log("'apple-spinner' is already defined.");
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.setAttribute("data-tokenization-key", dataKey);
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log(`${src} loaded successfully.`);
    };

    script.onerror = () => {
      console.error(`Failed to load ${src}.`);
    };
  };

  useEffect(() => {
    if (paymentGateway === "Easy Pay") {
      loadScript(
        "https://secure.easypaydirectgateway.com/token/Collect.js",
        "Qsugrp-m7EZre-Em45Cy-Gm7mH5"
      );
    } else if (paymentGateway === "Seamless Chex") {
      loadScript(
        "https://seamlesschex.transactiongateway.com/token/Collect.js",
        "r4G87X-gVM2Pg-wj64h7-yB7EtR"
      );
    }

    return () => {
      console.log("Cleaning up effects for payment gateway.");
    };
  }, [paymentGateway]);

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
    if (window?.CollectJS) {
      window.CollectJS.configure({
        variant: "lightbox",
        paymentType: type,
        callback: (token) => {
          setConnectPayment({
            paymentToken: token?.token,
            paymentType: type,
            platform:
              paymentGateway === "Seamless Chex"
                ? "Seamlesschex"
                : "Easypay direct",
          });
        },
      });
    }
  }, [type, paymentGateway]);

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
          onClick={() => window.CollectJS?.startPaymentRequest()}
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
          onClick={() => window.CollectJS?.startPaymentRequest()}
        >
          ACH
        </ToggleButton>
      </ToggleButtonGroup>
      <div id="paymentTokenInfo"></div>
    </Grid>
  );
}

export default PaymentCardDetails;
