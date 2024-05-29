import React from "react";
import { Close } from "@mui/icons-material";
import { Box } from "@mui/material";
import HorizontalLinearStepper from "./stepper";

export default function CaseModel({ handleClose, caseData }) {
  return (
    <>
      <Box
        onClick={handleClose}
        sx={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <Close />
      </Box>
      <HorizontalLinearStepper hide={true} caseData={caseData} />
    </>
  );
}
