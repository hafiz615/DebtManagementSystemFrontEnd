import React, { useEffect, useState } from "react";
import {
  Dialog,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
} from "@mui/material";
import {
  baseUrl,
  FONT_SIZE_LARGE,
  FONT_SIZE_XL,
} from "../constants/appConstants";
import { useNavigate, useParams } from "react-router-dom";
import { GetCheckoutToken } from "../services/services";
import { useToast } from "../toast/toastContext";
import axios from "axios";
import { Colors } from "../config/default";

const PaymentCheckout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [provider, setProvider] = useState("Seamless Chex Merchant");
  const [type, setType] = useState();
  const debtorId = useParams();
  const { showToast } = useToast();
  const BASE_URL = baseUrl();
  const navigate = useNavigate();

  const handleSubmit = async (paymentToken, paymentType, platform) => {
    try {
      const res = await GetCheckoutToken(debtorId?.id);
      if (res?.status === 200) {
        const token = res?.data?.data?.token;
        try {
          const payload = {
            paymentToken: paymentToken,
            paymentType: paymentType,
            platform: platform,
          };
          const response = await axios.post(
            `${BASE_URL}/v1/debtor/add-debtor-account/${debtorId?.id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response?.status === 200) {
            showToast(response?.data?.message, "success");
            navigate("/thankyou");
          }
        } catch (err) {
          const errorMessage = err?.response?.data?.message;
          showToast(errorMessage, "error");
        }
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      showToast(errorMessage, "error");
    } finally {
    }
  };

  useEffect(() => {
    if (provider !== "") {
      const scriptSrc =
        provider === "Easy Pay"
          ? "https://secure.easypaydirectgateway.com/token/Collect.js"
          : "https://seamlesschex.transactiongateway.com/token/Collect.js";
      const dataKey =
        provider === "Easy Pay"
          ? "Qsugrp-m7EZre-Em45Cy-Gm7mH5"
          : "r4G87X-gVM2Pg-wj64h7-yB7EtR";

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
              handleSubmit(
                token?.token,
                type === "cc" ? "cc" : "ck",
                provider === "Seamless Chex Merchant"
                  ? "Seamlesschex merchant"
                  : "Easypay direct"
              );
            },
          });
        }
      };
      script.onerror = () => {
        console.error(`Failed to load ${scriptSrc}.`);
      };
      document.body.appendChild(script);
      return () => {
        if (window.CollectJS) {
          delete window.CollectJS;
        }
      };
    }
  }, [provider, type]);

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

  return (
    <Dialog
      open={isOpen}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          px: { xs: 3, sm: 4 },
          py: { xs: 4, sm: 5 },
          overflowX: "hidden",
          border: "3px solid",
          borderColor: Colors.SKY_BLUE,
        },
      }}
      sx={{ zIndex: 100 }}
    >
      <Stack spacing={4}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontSize: FONT_SIZE_LARGE,
              fontWeight: 700,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Please select CC or ACH to enter payment information
          </Typography>

          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={handleChange}
            size="small"
            sx={{
              backgroundColor: "#f0f0f5",
              borderRadius: "12px",
              "& .MuiToggleButton-root": {
                fontFamily: "Nunito",
                px: 2,
                py: 0.5,
                fontSize: FONT_SIZE_XL,
                textTransform: "uppercase",
              },
              "& .Mui-selected": {
                backgroundColor: Colors.SKY_BLUE,
                color: "#fff",
                "&:hover": {
                  backgroundColor: Colors.SKY_BLUE,
                },
              },
            }}
          >
            <ToggleButton value="cc">CC</ToggleButton>
            <ToggleButton value="ach">ACH</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontSize: FONT_SIZE_LARGE,
              fontWeight: 700,
            }}
          >
            Please select payment gateway
          </Typography>

          <RadioGroup
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <FormControlLabel
              value="Seamless Chex Merchant"
              control={
                <Radio
                  sx={{
                    color: "#9D71FA",
                    "&.Mui-checked": { color: "#9D71FA" },
                  }}
                />
              }
              label={
                <Typography
                  sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_XL }}
                >
                  Seamless Chex Merchant
                </Typography>
              }
            />
            <FormControlLabel
              value="easypay"
              control={
                <Radio
                  sx={{
                    color: "#9D71FA",
                    "&.Mui-checked": { color: "#9D71FA" },
                  }}
                />
              }
              label={
                <Typography
                  sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_XL }}
                >
                  Easy Pay
                </Typography>
              }
            />
          </RadioGroup>
        </Stack>

        <Divider />
      </Stack>
    </Dialog>
  );
};

export default PaymentCheckout;
