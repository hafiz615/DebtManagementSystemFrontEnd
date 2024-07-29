import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Grid,
  Box,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import { Colors } from "../config/default";
import useMediaQuery from "@mui/material/useMediaQuery";
import { NumericFormat } from "react-number-format";

const parsePercentage = (value) => {
  if (!value) return "";
  const percentage = value.replace("%", "").trim();
  const parsedValue = parseFloat(percentage);
  return isNaN(parsedValue) ? value : parsedValue;
};

const parseCurrency = (value) => {
  if (!value) return "";
  const parsedValue = parseFloat(value.replace(/[$,]/g, ""));
  return isNaN(parsedValue) ? value : parsedValue;
};

const convertIntervalValue = (value, fromInterval, toInterval) => {
  if (!value) return "";

  const numberValue = parseFloat(value);
  if (isNaN(numberValue)) return value;

  const dailyToWeekly = 7;
  const dailyToMonthly = 30;
  const weeklyToDaily = 1 / 7;
  const weeklyToMonthly = 4;
  const monthlyToDaily = 1 / 30;
  const monthlyToWeekly = 1 / 4;

  let conversionFactor = 1;

  if (fromInterval === "Daily" && toInterval === "Weekly") {
    conversionFactor = dailyToWeekly;
  } else if (fromInterval === "Daily" && toInterval === "Monthly") {
    conversionFactor = dailyToMonthly;
  } else if (fromInterval === "Weekly" && toInterval === "Daily") {
    conversionFactor = weeklyToDaily;
  } else if (fromInterval === "Weekly" && toInterval === "Monthly") {
    conversionFactor = weeklyToMonthly;
  } else if (fromInterval === "Monthly" && toInterval === "Daily") {
    conversionFactor = monthlyToDaily;
  } else if (fromInterval === "Monthly" && toInterval === "Weekly") {
    conversionFactor = monthlyToWeekly;
  }

  return (numberValue * conversionFactor).toFixed(2);
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

const IntervalTextField = ({
  label,
  value,
  onChange,
  type,
  width, // Add width as a prop
}) => {
  const smallScreen = useMediaQuery("(min-width:300px) and (max-width:760px)");
  const [interval, setInterval] = useState("Daily");

  useEffect(() => {
    const match = value.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      setInterval(capitalizeFirstLetter(match[1]));
    } else {
      const intervalMatch = value.split(" ");
      if (intervalMatch.length > 1) {
        setInterval(capitalizeFirstLetter(intervalMatch[1]));
      }
    }
  }, [value]);

  const handleIntervalChange = (event) => {
    const newInterval = event.target.value;
    const newValue = value
      ? convertIntervalValue(
          value.split(" ")[0].replace("$", ""),
          interval,
          newInterval
        )
      : "";
    setInterval(newInterval);
    onChange(`${newValue} (${newInterval})`);
  };

  const getParsedValue = (value, type) => {
    if (type === "percentage") return parsePercentage(value);
    if (type === "currency") return parseCurrency(value);
    return value;
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <Grid item xs={12} md={12}>
      <Typography
        sx={{
          fontWeight: "500",
          fontFamily: "Nunito",
          marginLeft: "1.8rem",
          color: Colors.DARK_GRAY,
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: Colors.BG_LIGHT_GRAY,
          borderRadius: "5px",
          border: "none",
          width: width,
          marginLeft: "1rem",
          "& .MuiOutlinedInput-notchedOutline": { border: 0 },
        }}
      >
        <TextField
          value={getParsedValue(value.split(" ")[0], type)}
          onChange={(e) => onChange(`${e.target.value} (${interval})`)}
          placeholder={type === "percentage" ? "%" : "$"}
          InputProps={{
            inputComponent:
              type === "percentage"
                ? PercentageFormatCustom
                : NumericFormatCustom,
            sx: {
              color: Colors.DIM_LIGHT_GRAY,
              fontSize: ".8rem",
              fontFamily: "Nunito",
              "&::placeholder": {
                color: "#6D6D6D",
              },
            },
          }}
          sx={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            color: Colors.DIM_LIGHT_GRAY,
            height: "2.5rem",
            width: width,
            // marginLeft: "1rem",
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
        />
        <Select
          value={interval}
          onChange={handleIntervalChange}
          displayEmpty
          sx={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            color: Colors.DIM_LIGHT_GRAY,
            height: "2.5rem",
            width: smallScreen ? "60%" : "40%",
            borderRadius: "5px",
            border: "none",
            "& .MuiOutlinedInput-notchedOutline": { border: 0 },
          }}
        >
          <MenuItem value="Daily">Daily</MenuItem>
          <MenuItem value="Weekly">Weekly</MenuItem>
          <MenuItem value="Monthly">Monthly</MenuItem>
        </Select>
      </Box>
    </Grid>
  );
};

IntervalTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["percentage", "currency"]).isRequired,
  width: PropTypes.string, // Add width to PropTypes
};

export default IntervalTextField;
