import React, { useState } from "react";
import { Colors } from "../config/default";
import { GetInstantPayment } from "../services/services";
import TextButton from "./button";
import { Typography } from "@mui/material";
import { FONT_SIZE_LARGE, FONT_SIZE_XXL } from "../constants/appConstants";
import { useToast } from "../toast/toastContext";

export default function InstantPayment({
  handleClose,
  transactionId,
  GetCasePaymentDetails,
}) {
  const [loading, setLoading] = useState();
  const { showToast } = useToast();

  const handleConfirm = async (e) => {
    setLoading(true);
    e.stopPropagation();
    const res = await GetInstantPayment(transactionId);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      GetCasePaymentDetails("default", 1, 5, true, true);
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };
  return (
    <div>
      <Typography
        sx={{ fontSize: FONT_SIZE_XXL, fontFamily: "Nunito", fontWeight: 600 }}
      >
        Acquire funds
      </Typography>
      <Typography
        sx={{ fontSize: FONT_SIZE_LARGE, fontFamily: "Nunito", m: "10px 0px" }}
      >
        Are you sure you want to capture this amount?
      </Typography>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <TextButton
          buttonText="Cancel"
          height="2rem"
          width="8rem"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          backgroundColor={Colors.ORANGE_COLOR}
          hoverColor={Colors.ORANGE_COLOR}
        />
        <TextButton
          buttonText="Confirm"
          height="2rem"
          width="8rem"
          loading={loading}
          onClick={(e) => handleConfirm(e)}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      </div>
    </div>
  );
}
