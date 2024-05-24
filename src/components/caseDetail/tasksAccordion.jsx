import React from "react";

import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Colors } from "../../config/default";
import MuiModels from "../models";

export default function TaskAccordion() {
  return (
    <Accordion
      sx={{
        boxShadow: "none",
        marginBottom: "10px",
      }}
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
          borderRadius: "10px",
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
          <Typography sx={{ color: Colors.WHITE }}>Tasks</Typography>
          <div onClick={(e) => e.stopPropagation()}>
            <MuiModels buttonName="Add Task" show="addTask" button="icon" />
          </div>
        </div>
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
