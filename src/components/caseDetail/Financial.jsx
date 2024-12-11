import React, { useEffect, useState } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import ScrollbarStyles from "./../customScroll";

function FinancialAccordion() {
  return (
    <Accordion
      sx={{
        boxShadow: "none",
        marginBottom: "10px",
        borderRadius: "1rem !important",
        backgroundColor: Colors.WHITE,
      }}
      defaultExpanded
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon sx={{ color: Colors.WHITE, fontFamily: "Nunito" }} />
        }
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          height: "20px",
          backgroundColor: Colors.SKY_BLUE,
          borderRadius: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              color: Colors.WHITE,
              fontFamily: "Nunito",
              fontWeight: "700",
            }}
          >
            FINANCIAL ANALYTICS
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: Colors.WHITE,
          boxShadow: " 0 2px 5px -3px rgba(0, 0, 0, 0.5)",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          height: "40vh",
          overflow: "auto",
          ...ScrollbarStyles,
        }}
      >
        <Grid container>Financial Analytics</Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default FinancialAccordion;
