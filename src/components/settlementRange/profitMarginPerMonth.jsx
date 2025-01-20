import React from "react";
import PropTypes from "prop-types";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import ScrollbarStyles from "../customScroll";

const styles = {
  accordionSummary: {
    backgroundColor: Colors.SKY_BLUE,
    borderRadius: "10px",
    color: Colors.WHITE,
  },
  gridContainer: {
    backgroundColor: Colors.WHITE,
    width: "100%",
    maxHeight: "60vh",
    overflowY: "auto",
    ...ScrollbarStyles,
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
  title: {
    fontWeight: "bold",
    fontFamily: "Nunito",
    fontSize: "18px",
    marginBottom: "10px",
  },
  noDataText: {
    fontFamily: "Nunito",
    textAlign: "center",
  },
};

export default function ProfitMarginPerMonth({ profitMarginPerMonthData }) {
  const formatAsDollar = (value) =>
    value !== undefined && value !== null
      ? `$${Number(value).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "--";

  // Handle cases where data is null, undefined, or has an unexpected structure
  if (
    !profitMarginPerMonthData ||
    Object?.keys(profitMarginPerMonthData)?.length === 0
  ) {
    return (
      <Accordion>
        <AccordionSummary
          sx={styles.accordionSummary}
          expandIcon={<ExpandMoreIcon sx={{ color: Colors.WHITE }} />}
        >
          Profit Margin Per Month
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={styles.noDataText}>No data available</Typography>
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Accordion>
      <AccordionSummary
        sx={styles.accordionSummary}
        expandIcon={<ExpandMoreIcon sx={{ color: Colors.WHITE }} />}
      >
        Profit Margin Per Month
      </AccordionSummary>
      <AccordionDetails sx={styles.gridContainer}>
        {Object?.keys(profitMarginPerMonthData)?.map((arrayName, idx) => {
          const data = profitMarginPerMonthData[arrayName];

          // Calculate the sum of profit margins
          const totalProfitMargin = data?.reduce(
            (sum, entry) => sum + (entry?.profitMargin || 0),
            0
          );

          return (
            <Grid key={idx}>
              {/* Display the array name */}
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  "&:hover": {
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                  },
                  height: "8vh",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "1rem",
                  fontWeight: "600",
                }}
              >
                {arrayName}
              </Typography>
              {data && data?.length > 0 ? (
                <TableContainer>
                  <Table sx={styles.table} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={styles.tableHeaderCell}>Month</TableCell>
                        <TableCell sx={styles.tableHeaderCell}>
                          Profit Margin
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell sx={styles.tableCell}>
                            {entry?.month || "--"}
                          </TableCell>
                          <TableCell sx={styles.tableCell}>
                            {formatAsDollar(entry?.profitMargin) || "--"}
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Add the total profit margin row */}
                      <TableRow>
                        <TableCell sx={{ ...styles.tableHeaderCell }}>
                          Total
                        </TableCell>
                        <TableCell sx={{ ...styles.tableHeaderCell }}>
                          {formatAsDollar(totalProfitMargin)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography sx={styles.noDataText}>
                  No data available for {arrayName}
                </Typography>
              )}
            </Grid>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
}

ProfitMarginPerMonth.propTypes = {
  profitMarginPerMonthData: PropTypes.object.isRequired,
};

ProfitMarginPerMonth.defaultProps = {
  profitMarginPerMonthData: {},
};
