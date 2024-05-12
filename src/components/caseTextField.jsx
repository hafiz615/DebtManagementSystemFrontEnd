import * as React from "react";
import { Typography, Grid } from "@mui/material";
// import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../config/default";

function PaymentsTextFields({
  label,
  placeHolderValue,
  width,
  marginBottom,
  marginRight,
  marginLeft,
  onChange,
  type,
  value,
}) {
  //   const smallScreen = useMediaQuery("(min-width:300px) and (max-width:760px)");

  //   const largeScreen = useMediaQuery(
  //     "(min-width:1600px) and (max-width:3000px)"
  //   );
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
        onChange={onChange}
        value={value}
        style={{
          backgroundColor: Colors.BG_LIGHT_GRAY,
          height: "2.5rem",
          color: Colors.DIM_LIGHT_GRAY,
          paddingLeft: "1rem",
          border: "none",
          outline: "none",
          borderRadius: "5px",
          marginBottom: marginBottom,
          width: width,
          marginRight: marginRight,
          marginLeft: marginLeft,
        }}
      />
    </Grid>
  );
}

export default PaymentsTextFields;
