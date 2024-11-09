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

export default function Strategy3choices({
  title,
  settlementRange,
  weeksTillPaid,
  caseId,
  handleClose,
  remainingAmount,
  commissionRange,
  setPaymentChanged,
  commission,
  scoresBackend,
}) {
  const [selectedField, setSelectedField] = useState(
    "percentageReceivableAmount"
  );

  const textStyling = {
    fontSize: FONT_SIZE_LARGE,
    fontFamily: "Nunito",
    color: Colors.BLACK,
    fontWeight: "700",
  };
  return (
    <div>
      <Typography sx={textStyling}>
        Payment Plan According to Recommended Strategy
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
            value="percentageReceivableAmount"
            control={
              <Radio
                sx={{
                  color: Colors.SKY_BLUE,
                  "&.Mui-checked": {
                    color: Colors.SKY_BLUE,
                  },
                }}
              />
            }
            label={`Percentage Receivable Amount: ${
              settlementRange ? `$${settlementRange}` : "--"
            }`}
          />
          {!scoresBackend && (
            <FormControlLabel
              value="weeklyTrueRevenueAmount"
              control={
                <Radio
                  sx={{
                    color: Colors.SKY_BLUE,
                    "&.Mui-checked": {
                      color: Colors.SKY_BLUE,
                    },
                  }}
                />
              }
              label={`Weekly True Revenue Amount: ${
                weeksTillPaid ? `$${weeksTillPaid}` : "--"
              }`}
            />
          )}
        </RadioGroup>
      </FormControl>
      <Grid container xs={12} sx={{ mt: "1rem", justifyContent: "right" }}>
        <MuiModels
          buttonName="setPaymentPlan"
          width="70vw"
          show="payments"
          caseId={caseId}
          settlementRange={
            selectedField === "percentageReceivableAmount"
              ? settlementRange
              : weeksTillPaid
          }
          remainingAmount={remainingAmount}
          closePopup={handleClose}
          setPaymentChanged={setPaymentChanged}
          commission={commission}
        />
      </Grid>
    </div>
  );
}
