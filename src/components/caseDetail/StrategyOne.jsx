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
function StrategyOne({
  selectedOption,
  setSelectedOption,
  customValue,
  setCustomValue,
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
    setSelectedOption(event.target.value);
  };

  const handleCustomValueChange = (event) => {
    setCustomValue(event.target.value);
  };
  return (
    <FormControl component="fieldset">
      <RadioGroup value={selectedOption} onChange={handleOptionChange}>
        <FormControlLabel
          value="strategy1Profit"
          control={<Radio sx={radioStyle} />}
          label={`67% of maximum profit: ${
            data?.debtor?.strategy1MaxProfit
              ? `$${data.debtor.strategy1MaxProfit}`
              : popUpDebtorData?.strategy1MaxProfit
              ? `$${popUpDebtorData.strategy1MaxProfit}`
              : "Max Profit was not found in Bank Statement"
          }`}
        />
        <FormControlLabel
          value="strategy1Weekly"
          control={<Radio sx={radioStyle} />}
          label={`Budget debtor signed up for: ${
            data?.debtor?.basicInformation?.weeklyBudget
              ? `$${data.debtor.basicInformation.weeklyBudget}`
              : popUpDebtorData?.basicInformation?.weeklyBudget
              ? `$${popUpDebtorData.basicInformation.weeklyBudget}`
              : "Weekly Budget not entered when case was created"
          }`}
        />
        <FormControlLabel
          value="strategy1Custom"
          control={<Radio sx={radioStyle} />}
          label="Choose one or create your own"
        />
      </RadioGroup>

      {selectedOption === "strategy1Custom" && (
        <Grid container item xs={12}>
          <AmountTextField
            width="50%"
            marginLeft=".2rem"
            value={customValue}
            onChange={(e) => {
              setCustomValue(e.target.value);
            }}
            onKeyDown={handleNumberInput}
          />
        </Grid>
      )}
    </FormControl>
  );
}

export default StrategyOne;
