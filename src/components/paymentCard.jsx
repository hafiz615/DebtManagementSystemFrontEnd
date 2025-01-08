import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Colors } from "../config/default";

function PaymentCardDetails({ paymentGateway, setConnectPayment }) {
  const [type, setType] = useState("cc");

  useEffect(() => {
    if (paymentGateway !== "") {
      const scriptSrc =
        paymentGateway === "Easy Pay"
          ? "https://secure.easypaydirectgateway.com/token/Collect.js"
          : "https://seamlesschex.transactiongateway.com/token/Collect.js";
      const dataKey =
        paymentGateway === "Easy Pay"
          ? "Qsugrp-m7EZre-Em45Cy-Gm7mH5"
          : "r4G87X-gVM2Pg-wj64h7-yB7EtR";

      // Remove any existing script for the payment gateway
      const existingScript = document.querySelector(
        `script[src*="Collect.js"]`
      );
      if (existingScript) {
        existingScript.remove();
      }
      if (customElements.get("apple-spinner")) {
        customElements.defineclone = Object.assign(
          Object.create(Object.getPrototypeOf(customElements)).define,
          customElements
        );
        customElements.define = (name, element) =>
          customElements.get(name) || customElements.defineclone(name, element);
      }
      // Reload the script
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.setAttribute("data-tokenization-key", dataKey);
      script.async = true;

      script.onload = () => {

        // Reinitialize CollectJS after script loads
        if (window?.CollectJS) {
          window.CollectJS.configure({
            variant: "lightbox",
            callback: (token) => {
              setConnectPayment({
                paymentToken: token?.token,
                paymentType: "cc", // default to "cc" or adjust based on type
                platform:
                  paymentGateway === "Seamless Chex"
                    ? "Seamlesschex merchant"
                    : "Easypay direct",
              });
            },
          });
        }
      };

      script.onerror = () => {
        console.error(`Failed to load ${scriptSrc}.`);
      };

      document.body.appendChild(script);

      return () => {
        // Cleanup CollectJS instance, but leave the script to avoid disruption
        if (window.CollectJS) {
          delete window.CollectJS;
        }
      };
    }
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
                ? "Seamlesschex merchant"
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
