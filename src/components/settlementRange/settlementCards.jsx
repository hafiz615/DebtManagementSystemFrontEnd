import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { Colors } from "../../config/default";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";

export default function SettlementCards({
  title,
  settlementRange,
  commissionRange,
  newDefaultRiskScore,
  percentageSettlementOverWeeklyBudget,
  percentageSettlementOverWeeklyTrueRevenue,
}) {
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

  const allRanges = [
    settlementRange,
    commissionRange,
    newDefaultRiskScore,
    percentageSettlementOverWeeklyBudget,
    percentageSettlementOverWeeklyTrueRevenue,
  ];

  const rangeNames = [
    { label: "Settlement Range", tooltip: "Settlement Range" },
    { label: "Commission Range", tooltip: "Commission Range" },
    { label: "New Default Risk", tooltip: "ew Default Risk" },
    { label: "Weekly Budget %", tooltip: "Weekly Budget %" },
    { label: "Weekly True Revenue %", tooltip: "Weekly True Revenue %" },
  ];

  function capitalizeFirstWord(text) {
    if (!text) return text;
    const words = text.split(" ");
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ");
  }

  const noData =
    !settlementRange &&
    !commissionRange &&
    !newDefaultRiskScore &&
    !percentageSettlementOverWeeklyBudget &&
    !percentageSettlementOverWeeklyTrueRevenue;

  return (
    <Grid item xs={12} sm={5.8} md={3.8} lg={3.8} container sx={commonStyles}>
      <div
        style={{
          marginLeft: "8%",
          marginTop: "1rem",
        }}
      >
        <Typography sx={commonTextStyles}>
          {capitalizeFirstWord(title)}
        </Typography>
      </div>
      <Box sx={lineStyle} />
      {noData ? (
        <Typography sx={{ ...commonTextStyles, marginLeft: "8%" }}>
          No Data
        </Typography>
      ) : (
        allRanges?.map((item, index) => (
          <Grid
            container
            sx={{ width: "100%", padding: "10px 8px" }}
            key={index}
          >
            <Grid item xs={6.5} sx={{ paddingLeft: "6%" }}>
              <Typography
                sx={{
                  ...commonTextStyles,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {rangeNames[index]?.label}
                <Tooltip title={rangeNames[index]?.tooltip} placement="top-end">
                  <InfoIcon sx={{ fontSize: "17px", color: Colors.SKY_BLUE }} />
                </Tooltip>
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
                  {rangeNames[index]?.label === "New Default Risk"
                    ? item?.[title]?.[1] || "-"
                    : rangeNames[index]?.label?.includes("%")
                    ? `${item?.[title]?.[0] || "-"}%`
                    : `$${item?.[title]?.[0] || "-"}`}
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
                  {rangeNames[index]?.label === "New Default Risk"
                    ? item?.[title]?.[0] || "-"
                    : rangeNames[index]?.label?.includes("%")
                    ? `${item?.[title]?.[1] || "-"}%`
                    : `$${item?.[title]?.[1] || "-"}`}
                </div>
              </div>
            </Grid>
          </Grid>
        ))
      )}
    </Grid>
  );
}
