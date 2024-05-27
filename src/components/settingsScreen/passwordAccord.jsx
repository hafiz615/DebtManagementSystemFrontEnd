import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";

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
        <div>Hello</div>
      </AccordionDetails>
    </Accordion>
  );
}
