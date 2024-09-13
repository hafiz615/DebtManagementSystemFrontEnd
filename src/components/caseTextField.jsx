import * as React from "react";
import { Typography, Grid, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { parse, format } from "date-fns";
import { Colors } from "../config/default";
import { formatDate } from "../common";

function PaymentsTextFields({
  label,
  placeHolderValue,
  width,
  marginBottom,
  marginRight,
  marginLeft,
  onChangeFunction,
  type,
  error,
  value,
  max,
  onKeyDown,
}) {
  const smallScreen = useMediaQuery("(min-width:300px) and (max-width:760px)");

  const handleDateChange = (e) => {
    const inputValue = e.target.value;
    let formattedDate = inputValue;

    if (type === "date") {
      const dateFormats = ["MMM-dd-yyyy", "MM/dd/yyyy", "MMMM dd, yyyy"];
      for (const dateFormat of dateFormats) {
        try {
          const parsedDate = parse(inputValue, dateFormat, new Date());
          if (!isNaN(parsedDate)) {
            formattedDate = format(parsedDate, "yyyy-MM-dd");
            break;
          }
        } catch (error) {
          // Continue to the next format
        }
      }
    }

    onChangeFunction({ target: { value: formattedDate } });
  };

  return (
    <Grid item xs={12} md={3.9}>
      <Typography
        sx={{
          fontWeight: "500",
          fontFamily: "Nunito",
          marginLeft: "1rem",
          color: Colors.DARK_GRAY,
        }}
      >
        {label}
      </Typography>
      <input
        type={type}
        placeholder={placeHolderValue}
        onKeyDown={onKeyDown}
        onChange={type === "date" ? handleDateChange : onChangeFunction}
        value={type === "date" ? formatDate(value) : value}
        max={max}
        style={{
          backgroundColor: Colors.BG_LIGHT_GRAY,
          height: "2.5rem",
          color: Colors.DIM_LIGHT_GRAY,
          paddingLeft: "1rem",
          outline: "none",
          border: error && value ? "1px solid red" : "1px solid transparent",
          borderRadius: "5px",
          marginBottom: marginBottom,
          width: width,
          marginRight: marginRight,
          marginLeft: marginLeft,
          fontFamily: "Nunito",
        }}
        min={type === "number" ? "0" : undefined}
      />
      {error && value ? (
        <Box
          sx={{
            color: "red",
            fontSize: "9.3px",
            height: smallScreen ? "0.5rem" : "0.7rem",
          }}
        >
          {error}
        </Box>
      ) : (
        <Box
          sx={{
            color: "red",
            height: smallScreen ? "0.5rem" : "0.7rem",
          }}
        ></Box>
      )}
    </Grid>
  );
}

export default PaymentsTextFields;
