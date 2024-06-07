import React from "react";
import MuiPhoneNumber from "material-ui-phone-number";
import Typography from "@mui/material/Typography";
import { Grid, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Colors } from "../config/default";

export default function MuiPhoneTextField({
  onChange,
  error,
  value,
  onKeyDown,
  label,
}) {
  const smallScreen = useMediaQuery("(min-width:300px) and (max-width:760px)");
  const country = ["us"];
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
      <MuiPhoneNumber
        sx={{
          backgroundColor: Colors.BG_LIGHT_GRAY,
          height: "2.5rem",
          paddingLeft: ".4rem",
          borderRadius: "5px",
          display: "flex",
          justifyContent: "center",
          border: "none !important",
          "& .MuiInputBase-input": {
            color: Colors.DIM_LIGHT_GRAY,
            fontSize: ".8rem",
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
        variant="standard"
        fullWidth
        defaultCountry={"us"}
        onlyCountries={country}
        disableDropdown={false}
        onChange={onChange}
        value={value}
        onKeyDown={onKeyDown}
        preferredCountries={["us"]}
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
