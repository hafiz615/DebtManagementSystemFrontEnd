import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Colors } from "../config/default";

function PaymentCardDetails({
  paymentGateway,
  setConnectPayment,
  type,
  setType,
}) {
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  useEffect(() => {
    if (paymentGateway !== "") {
      setButtonsDisabled(true);
      const timeout = setTimeout(() => {
        setButtonsDisabled(false);
      }, 3000);

      const scriptSrc =
        paymentGateway === "Easy Pay"
          ? "https://secure.easypaydirectgateway.com/token/Collect.js"
          : "https://seamlesschex.transactiongateway.com/token/Collect.js";
      const dataKey =
        paymentGateway === "Easy Pay"
          ? "Qsugrp-m7EZre-Em45Cy-Gm7mH5"
          : "r4G87X-gVM2Pg-wj64h7-yB7EtR";

      // Remove any existing script
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

      const script = document.createElement("script");
      script.src = scriptSrc;
      script.setAttribute("data-tokenization-key", dataKey);
      script.async = true;

      script.onload = () => {
        if (window?.CollectJS) {
          window.CollectJS.configure({
            variant: "lightbox",
            callback: (token) => {
              setConnectPayment({
                paymentToken: token?.token,
                paymentType: type,
                platform:
                  paymentGateway === "Seamless Chex Merchant"
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
        clearTimeout(timeout);
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
      setType(type);
      window?.CollectJS?.startPaymentRequest();
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    window?.CollectJS?.startPaymentRequest();
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
              paymentGateway === "Seamless Chex Merchant"
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
            backgroundColor: buttonsDisabled
              ? Colors.BG_LIGHT_GRAY
              : Colors.VIOLET,
            color: buttonsDisabled ? "#888" : Colors.SKY_BLUE,
            fontSize: "10px",
            cursor: buttonsDisabled ? "not-allowed" : "pointer",
          }}
          value="cc"
          disabled={buttonsDisabled}
        >
          CC
        </ToggleButton>

        <ToggleButton
          style={{
            fontFamily: "Nunito",
            backgroundColor: buttonsDisabled
              ? Colors.BG_LIGHT_GRAY
              : "transparent",
            color: buttonsDisabled ? "#888" : Colors.SKY_BLUE,
            fontSize: "10px",
            cursor: buttonsDisabled ? "not-allowed" : "pointer",
          }}
          value="ck"
          disabled={buttonsDisabled}
        >
          ACH
        </ToggleButton>
      </ToggleButtonGroup>
      <div id="paymentTokenInfo"></div>
    </Grid>
  );
}

export default PaymentCardDetails;
