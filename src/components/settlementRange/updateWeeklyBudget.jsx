import React, { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

import { Colors } from "../../config/default";
import Button from "../button";
import { useToast } from "../../toast/toastContext";
import { UpdateWeeklyBudgetSettlement } from "../../services/services";
import AmountTextField from "../amountTextField";

function UpdateWeeklyBudget({
  handleClose,
  data,
  popUpDebtorData,
  getAllRanges,
}) {
  const prevWeeklyBudget = data?.value;
  const { showToast } = useToast();
  const [updateWeeklyBudget, setUpdateWeeklyBudget] = useState(
    prevWeeklyBudget || 0
  );
  const [loading, setloading] = useState(false);
  const handleWeeklyBudgetChange = (e) => {
    const { value } = e.target;
    setUpdateWeeklyBudget(Number(value)); // Ensure the value is always a number
  };

  const SubmitUpdateWeeklyBudget = async () => {
    setloading(true);
    const params = { weeklyBudget: Number(updateWeeklyBudget) || 0 }; // Send number explicitly
    const UpdateWeeklyBudgetRes = await UpdateWeeklyBudgetSettlement(
      params,
      popUpDebtorData?._id
    );
    if (UpdateWeeklyBudgetRes?.status === 200) {
      showToast(UpdateWeeklyBudgetRes?.data?.message, "success");
      getAllRanges && getAllRanges([], false);
      handleClose();
    } else if (UpdateWeeklyBudgetRes?.response?.status === 400) {
      const errorMessage = UpdateWeeklyBudgetRes?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setloading(false);
  };

  return (
    <>
      <Box
        sx={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
          Update Weekly Budget
        </Typography>
        <Close onClick={handleClose} />
      </Box>
      <Grid xs={12} container sx={{ justifyContent: "space-between" }}>
        <Grid item xs={9}>
          <AmountTextField
            value={updateWeeklyBudget}
            onChange={handleWeeklyBudgetChange}
            onKeyDown={(e) => {
              if (
                !/[0-9]|Backspace|Tab|Enter|ArrowLeft|ArrowRight|Delete/.test(
                  e.key
                )
              ) {
                e.preventDefault();
              }
            }}
            border={updateWeeklyBudget === 0 ? "2px solid red" : "auto"}
          />
        </Grid>
        <Grid item xs={2.5}>
          <Button
            onClick={SubmitUpdateWeeklyBudget}
            buttonText="UPDATE"
            height="2.5rem"
            width="100%"
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            loginFont="600"
            loading={loading}
            disabled={!updateWeeklyBudget || updateWeeklyBudget <= 0}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default UpdateWeeklyBudget;
