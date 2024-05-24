import React from "react";

import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";

import { Colors } from "../../config/default";
import MuiModels from "../models";

export default function CustomFieldsAccordion() {
  return (
    <Accordion
      sx={{
        boxShadow: "none",
        marginBottom: "10px",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography sx={{ color: Colors.WHITE }}>Custom Fields</Typography>
          <div style={{ display: "flex" }} onClick={(e) => e.stopPropagation()}>
            <IconButton>
              <EditIcon sx={{ color: Colors.WHITE, fontSize: "16px" }} />
            </IconButton>
            <MuiModels
              buttonName="Add Custom Fields"
              show="addCustomField"
              button="icon"
            />
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
