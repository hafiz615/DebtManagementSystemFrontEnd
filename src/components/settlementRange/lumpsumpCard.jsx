import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { Colors } from "../../config/default";
import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../../constants/appConstants";
import { isEmpty } from "lodash";
// import ScrollbarStyles from "./../customScroll";
// const cardStyles = {
//   backgroundColor: Colors.WHITE,
//   borderRadius: "10px",
//   flexDirection: "column",
//   gap: "10px",
//   mb: "1rem",
//   pb: "1.2rem",
// };
// const commTextStyles = {
//   fontSize: FONT_SIZE_LARGE,
//   fontFamily: "Nunito",
//   fontWeight: "700",
// };
const commonStyles = {
  backgroundColor: Colors.WHITE,
  borderRadius: "10px",
  flexDirection: "column",
  gap: "10px",
  mb: "1rem",
  pb: "1.2rem",
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
const commonTextStyles = {
  fontSize: FONT_SIZE_XL,
  fontFamily: "Nunito",
  fontWeight: "700",
};

function LumpsumpCard({ lumpSumpData }) {
  const { lumpsum_settlement } = lumpSumpData;

  return (
    <>
      <Grid item xs={12} sm={5.8} md={3.8} lg={3.8} container sx={commonStyles}>
        <div
          style={{
            marginLeft: "8%",
            marginTop: "1rem",
          }}
        >
          <Typography sx={commonTextStyles}>Lump Sum</Typography>
        </div>
        <Box sx={lineStyle} />
        {isEmpty(lumpSumpData) ? (
          <Typography sx={{ ...commonTextStyles, marginLeft: "8%" }}>
            No Data
          </Typography>
        ) : (
          Object?.keys(lumpsum_settlement)?.map((settlementName) => {
            const settlementData = lumpsum_settlement[settlementName];
            return (
              <Grid
                container
                sx={{ width: "100%", padding: "10px 8px" }}
                key={settlementName}
              >
                {/* <Grid item xs={6.5} sx={{ paddingLeft: "6%" }}> */}
                {/* <Typography
                    sx={{
                      ...commonTextStyles,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {settlementName}
                  </Typography> */}
                {/* </Grid> */}
                <Grid item xs={12} sx={{ paddingLeft: "6%" }}>
                  <div style={{ width: "100%", display: "flex" }}>
                    <div
                      style={{
                        width: "75%",
                        fontFamily: "Nunito",
                        color: Colors.ORANGE_COLOR,
                      }}
                    >
                      Remaining Amount
                    </div>
                    <div style={textStyles}>
                      {settlementData?.remaining_principle_amount !== undefined
                        ? `$${settlementData?.remaining_principle_amount}`
                        : "--"}
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
                      Repaid Debt
                    </div>
                    <div style={textStyles}>
                      {settlementData?.repaid_debt !== undefined
                        ? `$${settlementData?.repaid_debt}`
                        : "--"}
                    </div>
                  </div>
                </Grid>
              </Grid>
            );
          })
        )}
      </Grid>
      {lumpSumpData?.warning !== undefined && (
        <Grid
          item
          xs={12}
          sm={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "10px",
            backgroundColor: Colors.WHITE,
            padding: "0.5rem",
            height: { md: "12rem", lg: "10rem" },
          }}
        >
          <Typography
            sx={{
              fontSize: FONT_SIZE_LARGE,
              fontFamily: "Nunito",
              fontWeight: "700",
              color: Colors.ORANGE_COLOR,
              marginTop: "1rem",
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
            }}
          >
            {lumpSumpData?.warning || "No warning exists"}
          </Typography>
        </Grid>
      )}
    </>
  );
}

export default LumpsumpCard;
