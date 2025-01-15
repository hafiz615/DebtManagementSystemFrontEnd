import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../config/default";
import ScrollbarStyles from "./customScroll";

const styles = {
  accordionSummary: {
    backgroundColor: Colors.SKY_BLUE,
    borderRadius: "10px",
    color: Colors.WHITE,
  },
  gridContainer: {
    backgroundColor: Colors.WHITE,
    width: "100%",
    maxHeight: "40vh",
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

const formatAsDollar = (value) => (value ? `$${value}` : "--");

export default function StatementSummaryAccordion({ data, loading }) {
  const renderTable = (value) => (
    <Table sx={styles.table} size="small">
      <TableHead>
        <TableRow>
          {[
            "Statement Month",
            "Starting Balance",
            "True Credits",
            "Ending Balance",
            "MCA Number",
            "MCA Withhold Percent",
            "WithDrawal Total",
          ]?.map((header, index) => (
            <TableCell key={index} sx={styles.tableHeaderCell}>
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {value?.map((item, rowIndex) => (
          <TableRow key={rowIndex}>
            {[
              item?.statement_month,
              formatAsDollar(item?.startingBalance),
              formatAsDollar(item?.trueCredits),
              formatAsDollar(item?.endingBalance),
              item?.mcaNumber,
              item?.mcaWithholdPercent ? `${item?.mcaWithholdPercent}` : "--",
              formatAsDollar(item?.withdrawalTotal),
            ]?.map((cellData, cellIndex) => (
              <TableCell key={cellIndex} sx={styles.tableCell}>
                {cellData}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Accordion>
      <AccordionSummary
        sx={styles.accordionSummary}
        expandIcon={<ExpandMoreIcon sx={{ color: Colors.WHITE }} />}
      >
        Statement Summary
      </AccordionSummary>
      <AccordionDetails>
        {loading ? (
          <Grid sx={styles.loaderContainer}>
            <CircularProgress sx={{ color: Colors.SKY_BLUE }} />
          </Grid>
        ) : (
          <Grid sx={styles.gridContainer}>
            {data ? (
              Object.entries(data)?.map(([key, value], index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <Typography sx={styles.sectionTitle}>
                    Account No: {key}
                  </Typography>
                  {renderTable(value)}
                </div>
              ))
            ) : (
              <Typography
                sx={{
                  backgroundColor: Colors.WHITE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "5vh",
                  borderRadius: "1rem",
                  fontFamily: "Nunito",
                  textAlign: "center",
                  marginTop: "2rem",
                }}
              >
                No Statement Summary Data.
              </Typography>
            )}
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
