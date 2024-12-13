import React, { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Colors } from "../../config/default";
import Button from "../button";
import { UpdateContractDetails } from "../../services/services";
import { useToast } from "../../toast/toastContext.jsx";

function EditContractInformation({
  handleClose,
  creditorDetails,
  caseId,
  selectedCreditorDetailsKey,
  getAllRanges,
}) {
  const { showToast } = useToast();
  const [value, setValue] = useState(creditorDetails || "");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleUpdate = async () => {
    setLoading(true);
    const params = {
      label: selectedCreditorDetailsKey || "",
      value: value ?? "",
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

  return (
    <div>
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
      <Grid
        container
        sx={{
          display: "flex",
        }}
      >
        <Grid item xs={10}>
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Edit"
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
        </Grid>
        <Grid item xs={2}>
          <Button
            buttonText="UPDATE"
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            height="2.5rem"
            marginLeft="1rem"
            onClick={handleUpdate}
            loading={loading}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default EditContractInformation;
