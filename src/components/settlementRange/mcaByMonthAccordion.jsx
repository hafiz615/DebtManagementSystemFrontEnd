import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ScrollbarStyles from "../customScroll";
import McaByMonthTable from "./mcaByMonth";
import { Colors } from "../../config/default";

const styles = {
  accordionSummary: {
    backgroundColor: Colors.SKY_BLUE,
    borderRadius: "10px",
    color: Colors.WHITE,
  },
  gridContainer: {
    backgroundColor: Colors.WHITE,
    width: "100%",
    height: "60vh",
    overflowY: "auto",
    ...ScrollbarStyles,
  },
  loaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.WHITE,
    width: "100%",
    height: "40vh",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontFamily: "Nunito",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    border: "1px solid lightgray",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    fontFamily: "Nunito",
  },
  tableCell: {
    fontFamily: "Nunito",
  },
  noDataText: {
    fontFamily: "Nunito",
    textAlign: "center",
  },
};

export default function MCAByMonthAccordion({ mcaByMonth }) {
  return (
    <Accordion>
      <AccordionSummary
        sx={styles.accordionSummary}
        expandIcon={<ExpandMoreIcon sx={{ color: Colors.WHITE }} />}
      >
        MCA By Month
      </AccordionSummary>
      <AccordionDetails>
        <Grid sx={styles.gridContainer}>
          <McaByMonthTable mcaByMonth={mcaByMonth} />
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
