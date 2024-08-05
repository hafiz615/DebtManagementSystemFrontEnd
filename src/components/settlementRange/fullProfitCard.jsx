import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { Colors } from "../../config/default";
import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../../constants/appConstants";
const commonStyles = {
  backgroundColor: Colors.WHITE,
  borderRadius: "10px",
  flexDirection: "column",
  gap: "10px",
  mb: "1rem",
  pb: "1.2rem",
};

const commonTextStyles = {
  fontSize: FONT_SIZE_LARGE,
  fontFamily: "Nunito",
  fontWeight: "700",
};

const textStyles = {
  fontSize: FONT_SIZE_LARGE,
  fontFamily: "Nunito",
  color: Colors.DARK_GRAY,
};

const lineStyle = {
  width: "100%",
  height: "1px",
  backgroundColor: "#EAEBEB",
  margin: "8px 0",
};
function FullProfitCard({ fullProfit }) {
  return (
    <Grid item xs={12} sm={5.8} md={3.8} lg={3.8} container sx={commonStyles}>
      <div
        style={{
          marginLeft: "8%",
          marginTop: "1rem",
        }}
      >
        <Typography sx={commonTextStyles}>Full Profit</Typography>
        <Typography
          sx={{
            ...commonTextStyles,
            display: "flex",
            alignItems: "center",
          }}
        >
          Commission Range
        </Typography>
      </div>
      <Box sx={lineStyle} />
      <Grid container sx={{ width: "100%", padding: "10px 8px" }}>
        <Grid item xs={6.5} sx={{ paddingLeft: "6%" }}>
          <Typography
            sx={{
              ...commonTextStyles,
              display: "flex",
              alignItems: "center",
            }}
          >
            East Shore Equities
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <div style={{ width: "100%", display: "flex" }}>
            <div
              style={{
                width: "75%",
                fontFamily: "Nunito",
                color: Colors.ORANGE_COLOR,
              }}
            >
              Minimum
            </div>
            <div style={textStyles}>
              $
              {
                fullProfit?.commission_range["East Shore Equities"][
                  "recommendation 1"
                ][0]
              }
            </div>
          </div>
          <div style={{ width: "100%", display: "flex" }}>
            <div
              style={{
                width: "75%",
                fontFamily: "Nunito",
                color: Colors.SKY_BLUE,
              }}
            >
              Maximum
            </div>
            <div style={textStyles}>
              {/* {rangeNames[index]?.label === "Weeks Till Paid"
                ? rangeNames[index]?.label === "Weeks Till Paid"
                  ? item?.[weeksTillPaidTitle]?.["min"]
                  : ""
                : rangeNames[index]?.label === "New Default Risk"
                ? item?.[title]?.["min"] || "-"
                : rangeNames[index]?.label?.includes("%")
                ? `${parseFloat(item?.[title]?.["min"].toFixed(2)) || "-"}%`
                : `$${parseFloat(item?.[title]?.["min"].toFixed(2)) || "-"}`} */}
              $
              {
                fullProfit?.commission_range["East Shore Equities"][
                  "recommendation 1"
                ][1]
              }
            </div>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default FullProfitCard;
