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
import { useSelector } from "react-redux";

const styles = {
  accordionSummary: {
    backgroundColor: Colors.SKY_BLUE,
    borderRadius: "10px",
    color: Colors.WHITE,
  },
  gridContainer: {
    backgroundColor: Colors.BG_LIGHT_GRAY,
    width: "100%",
    maxHeight: "40vh",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "7px",
      height: "7px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#E5E5E5",
      borderRadius: "8px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: Colors.WHITE,
      borderRadius: "8px",
    },
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
    backgroundColor: Colors.WHITE,
    border: "1px solid lightgray",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    fontFamily: "Nunito",
    minWidth: "10rem",
  },
  tableCell: {
    fontFamily: "Nunito",
    minWidth: "10rem",
  },
  noDataText: {
    fontFamily: "Nunito",
    textAlign: "center",
  },
};

const formatAsDollar = (value) =>
  value !== undefined && value !== null
    ? `$${Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "--";

export default function StatementSummaryAccordion({ data, loading }) {
  const drawerOpen = useSelector((state) => state.drawer.open);

  const widthStyling = drawerOpen
    ? "calc(100vw - 250px - 4rem)"
    : "calc(100vw - 70px - 4rem)";

  const renderTable = (value) => {
    const totals = value.reduce(
      (acc, item) => ({
        startingBalance:
          acc.startingBalance + (Number(item?.startingBalance) || 0),
        totalCredits: acc.totalCredits + (Number(item?.totalCredits) || 0),
        credits: acc.credits + (Number(item?.credits) || 0),
        trueCredits: acc.trueCredits + (Number(item?.trueCredits) || 0),
        trueCredits1: acc.trueCredits1 + (Number(item?.trueCredits1) || 0),
        totalDebits: acc.totalDebits + (Number(item?.totalDebits) || 0),
        debits: acc.debits + (Number(item?.debits) || 0),
        endingBalance: acc.endingBalance + (Number(item?.endingBalance) || 0),
        avgBalance: acc.avgBalance + (Number(item?.avgBalance) || 0),
        avgTrueBalance:
          acc.avgTrueBalance + (Number(item?.avgTrueBalance) || 0),
        daysNeg: acc.daysNeg + (Number(item?.daysNeg) || 0),
        ods: acc.ods + (Number(item?.ods) || 0),
        nsfs: acc.nsfs + (Number(item?.nsfs) || 0),
        lowDays: acc.lowDays + (Number(item?.lowDays) || 0),
        mcas: acc.mcas + (Number(item?.mcas) || 0),
        mcaWithholdPercent: parseFloat(
          (
            acc.mcaWithholdPercent +
            (parseFloat(item.mcaWithholdPercent?.replace("%", "")) || 0)
          )?.toFixed(2)
        ),
      }),
      {
        startingBalance: 0,
        totalCredits: 0,
        credits: 0,
        trueCredits: 0,
        totalCredits: 0,
        trueCredits1: 0,
        totalDebits: 0,
        debits: 0,
        endingBalance: 0,
        avgBalance: 0,
        avgTrueBalance: 0,
        daysNeg: 0,
        ods: 0,
        nsfs: 0,
        lowDays: 0,
        mcas: 0,
        mcaWithholdPercent: 0,
      }
    );

    return (
      <Table sx={styles.table}>
        <TableHead>
          <TableRow>
            {[
              "Bank Name",
              "Statement Month",
              "Starting Balance",
              "Total Credits",
              "# Credits",
              "True Credits",
              "# True Credits",
              "Total Debits",
              "# Debits",
              "Ending Balance",
              "Avg Balance",
              "Avg True Balance",
              "Days Neg",
              "# Ods",
              "# Nsfs",
              "Low Days",
              "# Mcas",
              "Mca Withhold Percent",
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
                item?.bankName || "--",
                item?.statementMonth || "--",
                formatAsDollar(item?.startingBalance) || "--",
                formatAsDollar(item?.totalCredits) || "--",
                item?.credits || "--",
                formatAsDollar(item?.trueCredits) || "--",
                item?.trueCredits1 || "--",
                formatAsDollar(item?.totalDebits) || "--",
                item?.debits || "--",
                formatAsDollar(item?.endingBalance) || "--",
                formatAsDollar(item?.avgBalance) || "--",
                formatAsDollar(item?.avgTrueBalance) || "--",
                item?.daysNeg || "--",
                item?.ods || "--",
                item?.nsfs || "--",
                item?.lowDays || "--",
                item?.mcas || "--",
                item?.mcaWithholdPercent || "--",
              ]?.map((cellData, cellIndex) => (
                <TableCell key={cellIndex} sx={styles.tableCell}>
                  {cellData}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {/* Add totals row */}
          <TableRow>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              Total:
            </TableCell>
            <TableCell></TableCell>

            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {formatAsDollar(totals?.startingBalance) || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {formatAsDollar(totals?.totalCredits) || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {totals?.credits || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {formatAsDollar(totals?.trueCredits) || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {totals?.trueCredits1 || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {formatAsDollar(totals?.totalDebits) || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {totals?.debits || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {formatAsDollar(totals?.endingBalance) || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {formatAsDollar(totals?.avgBalance) || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {formatAsDollar(totals?.avgTrueBalance) || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {totals?.daysNeg || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {totals?.ods || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {totals?.nsfs || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {totals?.lowDays || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {totals?.mcas || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {`${totals?.mcaWithholdPercent / value?.length}%` || "--"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  return (
    <Accordion
      sx={{
        width: widthStyling,
        overflowX: "auto",
      }}
    >
      <AccordionSummary
        sx={styles.accordionSummary}
        expandIcon={<ExpandMoreIcon sx={{ color: Colors.WHITE }} />}
      >
        Statement Summary
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: Colors.BG_LIGHT_GRAY,
        }}
      >
        {loading ? (
          <Grid sx={styles.loaderContainer}>
            <CircularProgress sx={{ color: Colors.SKY_BLUE }} />
          </Grid>
        ) : (
          <Grid sx={styles.gridContainer}>
            {data && Object.keys(data)?.length > 0 ? (
              Object.entries(data)?.map(([key, value], index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "20px",
                  }}
                >
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
                      fontWeight: "600",
                    }}
                  >
                    Account No: {key}
                  </Typography>
                  {renderTable(value)}
                </div>
              ))
            ) : (
              <Typography
                sx={{
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
