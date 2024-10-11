import React from "react";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Grid,
} from "@mui/material";

import { handleNumberInput } from "../../common";
import { Colors } from "../../config/default";
import AmountTextField from "../amountTextField";

function StrategyThree({
  selectedOptionThree,
  setSelectedOptionThree,
  customValueThree,
  setCustomValueThree,
  data,
  popUpDebtorData,
}) {
  const radioStyle = {
    color: Colors.SKY_BLUE,
    "&.Mui-checked": {
      color: Colors.SKY_BLUE,
    },
  };
  const handleOptionChange = (event) => {
    setSelectedOptionThree(event.target.value);
  };

  const handleCustomValueChange = (event) => {
    setCustomValueThree(event.target.value);
  };
  return (
    <FormControl component="fieldset">
      <RadioGroup value={selectedOptionThree} onChange={handleOptionChange}>
        <FormControlLabel
          value="strategy3Profit"
          control={<Radio sx={radioStyle} />}
          label={`67% of maximum profit margin: ${
            data?.debtor?.strategy3MaxProfit
              ? `${data.debtor.strategy3MaxProfit}%`
              : popUpDebtorData?.strategy3MaxProfit
              ? `${popUpDebtorData.strategy3MaxProfit}%`
              : "Max Profit was not found in Bank Statement"
          }`}
        />
        <FormControlLabel
          value="strategy3ProfitMargin"
          control={<Radio sx={radioStyle} />}
          label={`Stated profit margin of debtor: ${
            data?.debtor?.profitMargin
              ? `$${data.debtor.profitMargin}`
              : popUpDebtorData?.profitMargin
              ? `$${popUpDebtorData.profitMargin}`
              : "Max Profit was not found in Bank Statement"
          }`}
        />
        <FormControlLabel
          value="strategy3Custom"
          control={<Radio sx={radioStyle} />}
          label="Choose one or create your own"
        />
      </RadioGroup>

      {selectedOptionThree === "strategy3Custom" && (
        <Grid container item xs={12}>
          <AmountTextField
            width="50%"
            marginLeft=".2rem"
            value={customValueThree}
            onChange={(e) => {
              setCustomValueThree(e.target.value);
            }}
            onKeyDown={handleNumberInput}
          />
        </Grid>
      )}
    </FormControl>
  );
}

export default StrategyThree;
