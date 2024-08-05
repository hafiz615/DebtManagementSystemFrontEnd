import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { Colors } from "../../config/default";
import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../../constants/appConstants";
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
  return (
    <Grid container item xs={8} sx={cardStyles}>
      {lumpSumpData ? (
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
          <Grid container item xs={12}>
            <Grid item xs={6}>
              <Typography sx={commonTextStyles}>Lumpsum Settlement</Typography>
              <Grid item>
                <Typography
                  sx={commonTextStyles}
                  style={{ color: Colors.SKY_BLUE }}
                >
                  Remaining Principle Amount
                </Typography>
                <Typography sx={commonTextStyles}>
                  $
                  {
                    lumpSumpData?.lumpsum_settlement["East Shore Equities"]
                      ?.remaining_principle_amount
                  }
                </Typography>
                <Typography
                  sx={commonTextStyles}
                  style={{ color: Colors.SKY_BLUE }}
                >
                  Repaid Debt
                </Typography>
                <Typography sx={commonTextStyles}>
                  $
                  {
                    lumpSumpData?.lumpsum_settlement["East Shore Equities"]
                      ?.repaid_debt
                  }
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid item>
                <Typography sx={commonTextStyles}>LCF Group</Typography>
                <Grid item xs={12}>
                  <Typography
                    sx={commonTextStyles}
                    style={{ color: Colors.SKY_BLUE }}
                  >
                    Remaining Principle Amount
                  </Typography>
                  <Typography sx={commonTextStyles}>
                    $
                    {
                      lumpSumpData?.lumpsum_settlement["LCF Group"]
                        ?.remaining_principle_amount
                    }
                  </Typography>
                  <Typography
                    sx={commonTextStyles}
                    style={{ color: Colors.SKY_BLUE }}
                  >
                    Repaid Debt
                  </Typography>
                  <Typography sx={commonTextStyles}>
                    $
                    {lumpSumpData?.lumpsum_settlement["LCF Group"]?.repaid_debt}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          item
          xs={5}
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
  );
}

export default LumpsumpCard;
