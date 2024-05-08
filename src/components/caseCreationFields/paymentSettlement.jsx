import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import { Colors } from "../../config/default";

export default function PaymentSettlement() {
  return (
    <>
      <Typography
        sx={{
          fontFamily: "Nunito",
          fontWeight: "600",
        }}
        gutterBottom
      >
        Settlement Plan Automation
      </Typography>
      <Grid container item>
        <Grid
          container
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              marginRight: ".5rem",
              color: Colors.DARK_GRAY,
            }}
            gutterBottom
          >
            Debt
          </Typography>
          <input
            type="text"
            placeholder="$2000"
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
          container
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              marginRight: ".5rem",
              color: Colors.DARK_GRAY,
            }}
            gutterBottom
          >
            Time Period
          </Typography>
          <input
            type="text"
            placeholder="Custom"
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
          container
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              marginRight: ".5rem",
              color: Colors.DARK_GRAY,
            }}
            gutterBottom
          >
            Date
          </Typography>
          <input
            type="text"
            placeholder="4/1/2024"
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
          container
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <AddCircleIcon sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      </Grid>
      <Grid container item sx={{ marginTop: "1rem" }}>
        <Grid
          container
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              marginRight: ".5rem",
              color: Colors.DARK_GRAY,
            }}
            gutterBottom
          >
            Debt
          </Typography>
          <input
            type="text"
            placeholder="$2000"
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
          container
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              marginRight: ".5rem",
              color: Colors.DARK_GRAY,
            }}
            gutterBottom
          >
            Time Period
          </Typography>
          <input
            type="text"
            placeholder="Custom"
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
          container
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              marginRight: ".5rem",
              color: Colors.DARK_GRAY,
            }}
            gutterBottom
          >
            Date
          </Typography>
          <input
            type="text"
            placeholder="4/1/2024"
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
          container
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              marginRight: ".5rem",
              color: Colors.DARK_GRAY,
            }}
            gutterBottom
          >
            Frequency
          </Typography>
          <input
            type="text"
            placeholder="5"
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border: "none",
              outline: "none",
              borderRadius: "5px",
              width: "20%",
              marginRight: "0.5rem",
            }}
          />
          <AddCircleIcon sx={{ color: Colors.SKY_BLUE }} />
          <RemoveCircleIcon sx={{ color: Colors.ORANGE_COLOR }} />
        </Grid>
      </Grid>
      <Grid container item sx={{ marginTop: "1rem" }}>
        <Grid
          container
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              marginRight: ".5rem",
              color: Colors.DARK_GRAY,
            }}
            gutterBottom
          >
            Debt
          </Typography>
          <input
            type="text"
            placeholder="$2000"
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
          container
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              marginRight: ".5rem",
              color: Colors.DARK_GRAY,
            }}
            gutterBottom
          >
            Time Period
          </Typography>
          <input
            type="text"
            placeholder="Custom"
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
          container
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              marginRight: ".5rem",
              color: Colors.DARK_GRAY,
            }}
            gutterBottom
          >
            Date
          </Typography>
          <input
            type="text"
            placeholder="4/1/2024"
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
          container
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              marginRight: ".5rem",
              color: Colors.DARK_GRAY,
            }}
            gutterBottom
          >
            Frequency
          </Typography>
          <input
            type="text"
            placeholder="5"
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border: "none",
              outline: "none",
              borderRadius: "5px",
              width: "20%",
              marginRight: "0.5rem",
            }}
          />
          <AddCircleIcon sx={{ color: Colors.SKY_BLUE }} />
          <RemoveCircleIcon sx={{ color: Colors.ORANGE_COLOR }} />
        </Grid>
      </Grid>
    </>
  );
}
