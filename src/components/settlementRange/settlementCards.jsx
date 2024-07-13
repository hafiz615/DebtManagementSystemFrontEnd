import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { Colors } from "../../config/default";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";

export default function SettlementCards({ title, data }) {
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
  };

  const lineStyle = {
    width: "100%",
    height: "1px",
    backgroundColor: "#EAEBEB",
    margin: "8px 0",
  };

  const hasData = data && Object.values(data).some((array) => array.length > 0);

  return (
    <Grid xs={12} sm={5.8} md={3.8} lg={2.8} container sx={commonStyles}>
      <div
        style={{
          marginLeft: "8%",
          marginTop: "1rem",
        }}
      >
        <Typography sx={commonTextStyles}>{title}</Typography>
      </div>
      <Box sx={lineStyle} />
      {hasData ? (
        Object.entries(data).map(
          ([key, values]) =>
            values.length > 0 && (
              <div style={{ margin: "0% 8%" }} key={key}>
                <Typography sx={commonTextStyles}>{key}</Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "2%",
                  }}
                >
                  <Typography
                    sx={{ ...textStyles, color: Colors.ORANGE_COLOR }}
                  >
                    Minimum:
                  </Typography>
                  <Typography sx={{ ...textStyles, color: Colors.DARK_GRAY }}>
                    {values[0]}
                  </Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography sx={{ ...textStyles, color: Colors.SKY_BLUE }}>
                    Maximum:
                  </Typography>
                  <Typography sx={{ ...textStyles, color: Colors.DARK_GRAY }}>
                    {values[1]}
                  </Typography>
                </div>
              </div>
            )
        )
      ) : (
        <div style={{ margin: "0% 8%" }}>
          <Typography sx={commonTextStyles}>No Data</Typography>
        </div>
      )}
    </Grid>
  );
}
