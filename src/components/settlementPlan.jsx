import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { FONT_SIZE_LARGE } from "../constants/appConstants";
import { Colors } from "../config/default";
import MuiModels from "./models";

export default function SettlementPayment({
  title,
  settlementRange,
  weeksTillPaid,
  caseId,
  handleClose,
  remainingAmount,
}) {
  const [selectedField, setSelectedField] = useState("Minimum");

  const textStyling = {
    fontSize: FONT_SIZE_LARGE,
    fontFamily: "Nunito",
    color: Colors.BLACK,
    fontWeight: "700",
  };
  return (
    <div>
      <Typography sx={textStyling}>
        Payment Plan According to {title}
      </Typography>
      <FormControl component="fieldset">
        <p style={{ ...textStyling, marginTop: "1rem" }}>
          Select Range You Want To Choose
        </p>
        <RadioGroup
          aria-label="format"
          name="format"
          value={selectedField}
          onChange={(e) => {
            setSelectedField(e.target.value);
          }}
        >
          <FormControlLabel
            value="Minimum"
            control={<Radio />}
            label="Minimum"
          />
          <FormControlLabel
            value="Maximum"
            control={<Radio />}
            label="Maximum"
          />
        </RadioGroup>
      </FormControl>
      <Grid container xs={12} sx={{ mt: "1rem", justifyContent: "right" }}>
        <MuiModels
          buttonName="setPaymentPlan"
          width="70vw"
          show="payments"
          caseId={caseId}
          settlementRange={
            selectedField === "Minimum"
              ? settlementRange?.min
              : settlementRange?.max
          }
          weeksTillPaid={
            selectedField === "Minimum"
              ? weeksTillPaid?.min
              : weeksTillPaid?.max
          }
          remainingAmount={remainingAmount}
          closePopup={handleClose}
        />
      </Grid>
    </div>
  );
}
