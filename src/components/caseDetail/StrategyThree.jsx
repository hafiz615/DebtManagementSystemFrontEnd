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

function StrategyThree({
  selectedOptionThree,
  setSelectedOptionThree,
  customValueThree,
  setCustomValueThree,
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
          value="profit"
          control={<Radio sx={radioStyle} />}
          label="67% of maximum profit margin %"
        />
        <FormControlLabel
          value="weekly"
          control={<Radio sx={radioStyle} />}
          label="Stated profit margin of debtor"
        />
        <FormControlLabel
          value="choose"
          control={<Radio sx={radioStyle} />}
          label="Choose one or create your own"
        />
      </RadioGroup>

      {selectedOptionThree === "choose" && (
        <Grid container item xs={12}>
          <PaymentsTextFields
            type="text"
            placeHolderValue="Enter Custom Value"
            value={customValueThree}
            onChangeFunction={handleCustomValueChange}
            onKeyDown={handleNumberInput}
          />
        </Grid>
      )}
    </FormControl>
  );
}

export default StrategyThree;
