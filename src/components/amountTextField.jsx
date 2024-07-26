import * as React from "react";
import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";
import { NumericFormat } from "react-number-format";
import TextField from "@mui/material/TextField";
import { Colors } from "../config/default";
import { Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const USPhoneMaskCustom = React.forwardRef(function USPhoneMaskCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(000) 000-0000"
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

USPhoneMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      decimalSeparator="."
      decimalScale={2}
      fixedDecimalScale
      valueIsNumericString
      prefix="$"
    />
  );
});

NumericFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function AmountTextField({
  onChange,
  error,
  value,
  onKeyDown,
  width,
  marginRight,
  marginTop,
  marginLeft,
  label,
}) {
  const smallScreen = useMediaQuery("(min-width:300px) and (max-width:760px)");

  return (
    <>
      <TextField
        sx={{
          marginRight: marginRight,
          backgroundColor: Colors.BG_LIGHT_GRAY,
          color: Colors.DIM_LIGHT_GRAY,
          height: "2.5rem",
          width: width,
          marginTop: marginTop,
          marginLeft: marginLeft,
          paddingLeft: "1rem",
          borderRadius: "5px",
          display: "flex",
          fontFamily: "Nunito",
          justifyContent: "center",
          border: "none !important",
          "& .MuiInputBase-input": {
            color: Colors.DIM_LIGHT_GRAY,
            fontSize: ".8rem",
            fontFamily: "Nunito",
            "&::placeholder": {
              color: "#6D6D6D",
            },
          },
          "& .MuiInput-underline:before": {
            borderBottom: "none",
          },
          "& .MuiInput-underline:after": {
            borderBottom: "none",
          },
          "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
            borderBottom: "none",
          },
        }}
        placeholder={value ? "" : "$"} // Show placeholder only if value is empty
        onChange={onChange}
        value={value || ""} // Ensure value is never null or undefined
        onKeyDown={onKeyDown}
        name="numberformat"
        id="formatted-numberformat-input"
        InputProps={{
          inputComponent: NumericFormatCustom,
        }}
        variant="standard"
      />
      {error && (
        <Box
          sx={{
            color: "red",
            fontSize: "9.3px",
            height: smallScreen ? "0.5rem" : "0.7rem",
          }}
        >
          {error}
        </Box>
      )}
    </>
  );
}
