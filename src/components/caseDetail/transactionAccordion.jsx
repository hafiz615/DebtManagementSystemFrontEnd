import React from "react";

import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Colors } from "../../config/default";

export default function TransactionAccordion() {
  return (
    <Accordion
      sx={{
        boxShadow: "none",
        marginBottom: "10px",
        backgroundColor: Colors.BG_LIGHT_GRAY,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: Colors.WHITE }} />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          height: "20px",
          backgroundColor: Colors.SKY_BLUE,
          borderRadius: "10px",
        }}
      >
        <Typography sx={{ color: Colors.WHITE, fontFamily: "Nunito" }}>
          Transactions
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: Colors.BG_LIGHT_GRAY,
          boxShadow: " 0 2px 5px -3px rgba(0, 0, 0, 0.5)",

          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      ></AccordionDetails>
    </Accordion>
  );
}
