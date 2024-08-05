import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { Colors } from "../../config/default";
import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../../constants/appConstants";
import { isEmpty } from "lodash";
import ScrollbarStyles from "./../customScroll";
const cardStyles = {
  backgroundColor: Colors.WHITE,
  borderRadius: "10px",
  flexDirection: "column",
  gap: "10px",
  mb: "1rem",
  pb: "1.2rem",
};
const commTextStyles = {
  fontSize: FONT_SIZE_LARGE,
  fontFamily: "Nunito",
  fontWeight: "700",
};

const lineStyle = {
  width: "100%",
  height: "1px",
  backgroundColor: "#EAEBEB",
  margin: "8px 0",
};
const commonTextStyles = {
  fontSize: FONT_SIZE_XL,
  fontFamily: "Nunito",
  fontWeight: "700",
};

function LumpsumpCard({ lumpSumpData }) {
  const { lumpsum_settlement } = lumpSumpData;

  return (
    <Grid container item xs={12} sx={cardStyles}>
      <Grid
        container
        item
        xs={11}
        sx={{
          marginLeft: "1rem",
          marginTop: "1rem",
        }}
      >
        <Typography sx={commTextStyles}>LUMPSUMP</Typography>
        <Box sx={lineStyle} />
        <Grid
          container
          item
          xs={12}
          sx={{ maxHeight: "40vh", overflowY: "auto", ...ScrollbarStyles }}
        >
          <Grid container item xs={12} spacing={2}>
            {Object.keys(lumpsum_settlement).map((settlementName) => {
              const settlementData = lumpsum_settlement[settlementName];
              return (
                <Grid item key={settlementName}>
                  <Typography
                    sx={commonTextStyles}
                    style={{ color: Colors.SKY_BLUE }}
                  >
                    {settlementName}
                  </Typography>
                  <Typography sx={commonTextStyles}>
                    Remaining Principle Amount
                  </Typography>
                  <Typography sx={commonTextStyles}>
                    {settlementData?.remaining_principle_amount !== undefined
                      ? `$${settlementData?.remaining_principle_amount}`
                      : "--"}
                  </Typography>
                  <Typography sx={commonTextStyles}>Repaid Debt</Typography>
                  <Typography sx={commonTextStyles}>
                    {settlementData?.repaid_debt !== undefined
                      ? `$${settlementData?.repaid_debt}`
                      : "--"}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        {lumpSumpData?.warning && (
          <Grid
            container
            item
            xs={8}
            sx={{
              display: "flex",
            }}
          >
            <Typography
              sx={{
                fontSize: FONT_SIZE_LARGE,
                fontFamily: "Nunito",
                fontWeight: "700",
                color: Colors.ORANGE_COLOR,
                marginTop: "2rem",
              }}
            >
              Warning
            </Typography>
            <Typography
              sx={{
                fontSize: FONT_SIZE_LARGE,
                fontFamily: "Nunito",
                fontWeight: "400",
                color: Colors.BLACK,
                marginTop: "2rem",
              }}
            >
              {lumpSumpData?.warning}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default LumpsumpCard;
