import React from "react";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Grid,
} from "@mui/material";
import PaymentsTextFields from "../caseTextField";
import { handleNumberInput } from "../../common";
import { Colors } from "../../config/default";
function StrategyOne({
  selectedOption,
  setSelectedOption,
  customValue,
  setCustomValue,
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
          value="profit"
          control={<Radio sx={radioStyle} />}
          label="67% of maximum profit"
        />
        <FormControlLabel
          value="weekly"
          control={<Radio sx={radioStyle} />}
          label="Budget debtor signed up for"
        />
        <FormControlLabel
          value="choose"
          control={<Radio sx={radioStyle} />}
          label="Choose one or create your own"
        />
      </RadioGroup>

      {selectedOption === "choose" && (
        <Grid container item xs={12}>
          <PaymentsTextFields
            type="text"
            placeHolderValue="Enter Custom Value"
            value={customValue}
            onChangeFunction={handleCustomValueChange}
            onKeyDown={handleNumberInput}
          />
        </Grid>
      )}
    </FormControl>
  );
}

export default StrategyOne;
