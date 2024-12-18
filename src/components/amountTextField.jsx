import * as React from "react";
import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";
import { NumericFormat } from "react-number-format";
import TextField from "@mui/material/TextField";
import { Colors } from "../config/default";
import { Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

// Custom percentage formatting function
const parsePercentage = (value) => {
  if (!value) return "";
  const percentage = value.replace("%", "").trim();
  const parsedValue = parseFloat(percentage);
  // Ensure parsedValue is handled correctly
  return !isNaN(parsedValue) ? parsedValue.toFixed(2) : value;
};

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

const PercentageFormatCustom = React.forwardRef(function PercentageFormatCustom(
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
      decimalSeparator="."
      decimalScale={2}
      fixedDecimalScale
      valueIsNumericString
      suffix="%"
    />
  );
});

PercentageFormatCustom.propTypes = {
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
  type,
  border,
  disabled,
  readonly,
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
          outline: "none",
          justifyContent: "center",
          border: border || "none !important",

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
        disabled={disabled}
        placeholder={value ? "" : type === "percentage" ? "%" : "$"}
        onChange={onChange}
        value={type === "percentage" ? parsePercentage(value) : value || ""}
        onKeyDown={onKeyDown}
        name="numberformat"
        id="formatted-numberformat-input"
        InputProps={{
          readOnly: readonly || false,
          inputComponent:
            type === "percentage"
              ? PercentageFormatCustom
              : NumericFormatCustom,
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
