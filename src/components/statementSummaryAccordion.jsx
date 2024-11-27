import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../config/default";

export default function StatementSummaryAccordion({ data }) {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          sx={{ backgroundColor: Colors.SKY_BLUE, borderRadius: "10px" }}
          expandIcon={<ExpandMoreIcon sx={{ color: Colors.WHITE }} />}
        ></AccordionSummary>
        <AccordionDetails>
          <div style={{ backgroundColor: Colors.WHITE, width: "100%" }}>
            {data ? (
              Object.entries(data)?.map(([key, value], index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {key}:
                  </Typography>
                  <Typography variant="body2">{String(value)}</Typography>
                </div>
              ))
            ) : (
              <Typography sx={{ fontFamily: "Nunito", textAlign: "center" }}>
                No Statement Summary Data
              </Typography>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
