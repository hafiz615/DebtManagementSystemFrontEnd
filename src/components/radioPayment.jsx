import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Colors } from "../config/default";
import { Grid } from "@mui/material";

// Custom Radio button with sky blue color when checked
const SkyBlueRadio = (props) => (
  <Radio
    {...props}
    sx={{
      color: Colors.DIM_LIGHT_GRAY,
      "& .MuiSvgIcon-root": {
        fontSize: "1rem", // Adjust the radio button size
      },
      "&.Mui-checked": {
        color: Colors.SKY_BLUE,
      },
    }}
  />
);

// PaymentProcess component
export default function PaymentProcess({ feePayment, setFeePayment, border }) {
  const handleRadioChange = (event) => {
    setFeePayment(event.target.value);
  };

  return (
    <Grid item xs={12} md={12} lg={12}>
      <FormControl>
        <RadioGroup
          value={feePayment}
          onChange={handleRadioChange}
          sx={{
            color: border ? "red" : Colors.DIM_LIGHT_GRAY,
            fontFamily: "Nunito !important",
            flexDirection: "row",
          }}
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        >
          <FormControlLabel
            value="paidViaCash"
            label="Via Cash"
            control={<SkyBlueRadio />}
            sx={{
              marginRight: ".5rem",
            }}
          />
          <FormControlLabel
            value="toPay"
            label="To Pay"
            control={<SkyBlueRadio />}
            sx={{
              marginRight: ".5rem",
            }}
          />
          <FormControlLabel
            value="paidViaThirdParty"
            label="Third Party"
            control={<SkyBlueRadio />}
            sx={{
              marginRight: ".5rem",
            }}
          />
        </RadioGroup>
      </FormControl>
    </Grid>
  );
}
