import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import { Typography, Grid } from "@mui/material";
import PasswordField from "./passwordField";

export default function PasswordAccordion() {
  return (
    <Accordion
      sx={{
        width: "100%",
        borderRadius: "1rem !important",
        backgroundColor: Colors.WHITE,
        marginBottom: "1rem",
        boxShadow: "none",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          fontFamily: "Nunito",
          fontWeight: "600",
          borderBottomLeftRadius: "1rem",
          borderBottomRightRadius: "1rem",
          borderBottom: "1px solid #6D6D6D",
        }}
      >
        Password
      </AccordionSummary>
      <AccordionDetails>
        <Grid
          container
          sx={{
            paddingLeft: "2rem",
            paddingRight: "2rem",
          }}
        >
          <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
            Reset Password
          </Typography>
          <Grid
            container
            item
            xs={12}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                width: "15%",
                color: Colors.DARK_GRAY,
              }}
            >
              Current Password
            </Typography>
            <PasswordField />
          </Grid>
          <Grid
            container
            item
            xs={12}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                width: "15%",
                color: Colors.DARK_GRAY,
              }}
            >
              New Password
            </Typography>
            <PasswordField />
          </Grid>
          <Grid
            container
            item
            xs={12}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                width: "15%",
                color: Colors.DARK_GRAY,
              }}
            >
              Confirm Password
            </Typography>
            <PasswordField />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
