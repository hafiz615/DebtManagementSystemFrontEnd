import React, { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

import { Colors } from "../../config/default";
import Button from "../button";
import { UpdateContractDetails } from "../../services/services";
import { useToast } from "../../toast/toastContext.jsx";
import AmountTextField from "../amountTextField";

function EditContractInformation({
  handleClose,
  creditorDetails,
  caseId,
  selectedCreditorDetailsKey,
  getAllRanges,
}) {
  const { showToast } = useToast();
  const [value, setValue] = useState(creditorDetails || 0);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const regex = /^\d*\.?\d{0,2}$/;

    if (inputValue === "" || regex.test(inputValue)) {
      setValue(inputValue);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    const params = {
      label: selectedCreditorDetailsKey || "",
      value: value.toString() ?? "0",
    };
    const UpdateContract = await UpdateContractDetails(params, caseId);
    if (UpdateContract?.status === 200) {
      showToast(UpdateContract?.data?.message, "success");
      handleClose();
      getAllRanges && getAllRanges([], false);
    } else if (UpdateContract?.response?.status === 400) {
      const errorMessage = UpdateContract?.response?.data?.message;
      showToast(errorMessage, "error");
    }

    setLoading(false);
  };

  const isButtonDisabled =
    selectedCreditorDetailsKey === "purchased_percentage"
      ? value === "" || isNaN(parseFloat(value)) || parseFloat(value) > 100
      : value === "";

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
          Edit Field
        </Typography>

        <Close onClick={handleClose} />
      </Box>
      <Grid container sx={{ justifyContent: "space-between" }}>
        <Grid item xs={9}>
          {selectedCreditorDetailsKey === "purchased_percentage" ? (
            <input
              type="text"
              value={value}
              onChange={handleChange}
              placeholder="%"
              style={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                height: "2.5rem",
                color: Colors.DIM_LIGHT_GRAY,
                paddingLeft: "1rem",
                outline: "none",
                border: "1px solid transparent",
                borderRadius: "5px",
                marginBottom: "1rem",
                width: "100%",
                fontFamily: "Nunito",
              }}
            />
          ) : (
            <AmountTextField
              value={value}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (
                  !/[0-9]|Backspace|Tab|Enter|ArrowLeft|ArrowRight|Delete/.test(
                    e.key
                  )
                ) {
                  e.preventDefault();
                }
              }}
              border={value === 0 ? "2px solid red" : "auto"}
            />
          )}
        </Grid>
        <Grid item xs={2.5}>
          <Button
            buttonText="UPDATE"
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            height="2.5rem"
            width="8rem"
            marginLeft="1rem"
            onClick={handleUpdate}
            loading={loading}
            disabled={isButtonDisabled}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default EditContractInformation;
