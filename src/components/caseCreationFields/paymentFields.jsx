import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { Colors } from "../../config/default";

export default function PaymentFields() {
  return (
    <>
      <Typography
        sx={{
          fontFamily: "Nunito",
          fontWeight: "600",
        }}
        gutterBottom
      >
        Debt Details
      </Typography>

      <Grid
        container
        item
        xs={12}
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Grid
          item
          xs={12}
          lg={3.9}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginRight: "2rem",
            }}
          >
            Total Receivable
          </Typography>

          <input
            type="text"
            placeholder="$$10,000"
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border: "none",
              outline: "none",
              borderRadius: "5px",
              width: "60%",
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={3.9}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginRight: "1rem",
              marginLeft: "2rem",
            }}
          >
            Paid
          </Typography>
          <input
            type="text"
            placeholder="$$10,000"
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border: "none",
              outline: "none",
              borderRadius: "5px",
              width: "60%",
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={3.9}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginRight: "1rem",
            }}
          >
            Remaining
          </Typography>
          <input
            type="text"
            placeholder="$$10,000"
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border: "none",
              outline: "none",
              borderRadius: "5px",
              width: "60%",
            }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          marginTop: "1rem",
        }}
      >
        <Grid
          item
          xs={12}
          lg={3.9}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginRight: "1rem",
            }}
          >
            Last Payment Date
          </Typography>

          <input
            type="text"
            placeholder="$$10,000"
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border: "none",
              outline: "none",
              borderRadius: "5px",
              width: "60%",
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={3.9}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginRight: "1rem",
              marginLeft: "2rem",
            }}
          >
            Status
          </Typography>
          <input
            type="text"
            placeholder="$$10,000"
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border: "none",
              outline: "none",
              borderRadius: "5px",
              width: "60%",
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
