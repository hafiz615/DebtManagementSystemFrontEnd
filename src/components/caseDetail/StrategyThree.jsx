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
import PaymentsTextFields from "../caseTextField";

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

  const isMaxProfitAvailable =
    data?.debtor?.strategy3MaxProfit || popUpDebtorData?.strategy3MaxProfit;
  const isProfitMarginAvailable =
    data?.debtor?.profitMargin || popUpDebtorData?.profitMargin;

  return (
    <FormControl component="fieldset">
      <RadioGroup value={selectedOptionThree} onChange={handleOptionChange}>
        <FormControlLabel
          value="strategy3Profit"
          control={<Radio sx={radioStyle} />}
          label={`67% of maximum profit margin: ${
            isMaxProfitAvailable
              ? `${
                  data?.debtor?.strategy3MaxProfit ||
                  popUpDebtorData?.strategy3MaxProfit
                }%`
              : "Max Profit Margin yet to be Calculated"
          }`}
          disabled={!isMaxProfitAvailable} // Disable if max profit is not available
        />
        <FormControlLabel
          value="strategy3ProfitMargin"
          control={<Radio sx={radioStyle} />}
          label={`Stated profit margin of debtor: ${
            isProfitMarginAvailable
              ? `${
                  data?.debtor?.profitMargin || popUpDebtorData?.profitMargin
                }%`
              : "Max Profit Margin was not entered when case was created"
          }`}
          disabled={!isProfitMarginAvailable} // Disable if profit margin is not available
        />
        <FormControlLabel
          value="strategy3Custom"
          control={<Radio sx={radioStyle} />}
          label="Choose one or create your own"
        />
      </RadioGroup>

      {selectedOptionThree === "strategy3Custom" && (
        <Grid container item>
          <PaymentsTextFields
            type="number"
            width="13.5rem"
            placeHolderValue="%"
            value={customValueThree}
            onChangeFunction={(e) => setCustomValueThree(e.target.value)}
          />
        </Grid>
      )}
    </FormControl>
  );
}

export default StrategyThree;
