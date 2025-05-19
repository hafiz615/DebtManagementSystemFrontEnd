import { Grid, Switch, Typography } from "@mui/material";
import React, { useState } from "react";
import { FONT_SIZE_LARGE, FONT_SIZE_MEDIUM } from "../constants/appConstants";
import { Colors } from "../config/default";
import TextButton from "./button";
import { DeletePaymentPlan } from "../services/services";
import { useToast } from "../toast/toastContext";

export default function DeletePayment({
  GetCasePaymentDetails,
  handleClose,
  transactionId,
  getPaymentPlan,
}) {
  const [paymentChecked, setPaymentChecked] = useState(false);
  const [intervalChecked, setIntervalChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    const response = await DeletePaymentPlan(
      transactionId,
      paymentChecked,
      intervalChecked
    );
    if (response?.status === 200) {
      showToast(response?.data?.message, "success");
      handleClose();
      GetCasePaymentDetails();
      getPaymentPlan();
    } else {
      const errorMessage = response?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };
  return (
    <Grid>
      <Typography
        sx={{
          fontFamily: "Nunito",
          fontSize: FONT_SIZE_LARGE,
          fontWeight: 600,
          mb: "10px",
        }}
      >
        Delete Payment
      </Typography>
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
          borderTop: "1px solid #E0E0E0",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontSize: FONT_SIZE_MEDIUM,
            mt: "10px",
          }}
        >
          Delete Whole Payment Plan For This Interval Only
        </Typography>
        <Switch
          size="medium"
          checked={paymentChecked}
          onChange={(e) => setPaymentChecked(e.target.checked)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: Colors.SKY_BLUE,
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: Colors.SKY_BLUE,
            },
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontSize: FONT_SIZE_MEDIUM,
            mt: "10px",
          }}
        >
          Delete All The Intervals
        </Typography>
        <Switch
          size="medium"
          disabled={!paymentChecked}
          checked={intervalChecked}
          onChange={(e) => setIntervalChecked(e.target.checked)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: Colors.SKY_BLUE,
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: Colors.SKY_BLUE,
            },
          }}
        />
      </div>

      <div
        style={{
          marginTop: "1em",
          gap: "1em",
          display: "flex",
          justifyContent: "right",
        }}
      >
        <TextButton
          buttonText="Cancel"
          height="2rem"
          width="8rem"
          onClick={handleClose}
          backgroundColor={Colors.ORANGE_COLOR}
          hoverColor={Colors.ORANGE_COLOR}
        />
        <TextButton
          buttonText="Confirm"
          height="2rem"
          width="8rem"
          onClick={handleSave}
          loading={loading}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      </div>
    </Grid>
  );
}
