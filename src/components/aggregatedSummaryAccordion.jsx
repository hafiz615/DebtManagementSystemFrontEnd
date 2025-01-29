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

const formatAsDollar = (value) => {
  if (value === undefined || value === null) {
    return "--";
  }
  const fixedValue = Number(value).toFixed(2);
  return `$${Number(fixedValue).toLocaleString()}`;
};

export default function AggregatedSummaryAccordion({ data, loading }) {
  const drawerOpen = useSelector((state) => state.drawer.open);

  const widthStyling = drawerOpen
    ? "calc(100vw - 250px - 4rem)"
    : "calc(100vw - 70px - 4rem)";

  const renderTable = (value) => {
    const totals =
      value &&
      value?.reduce(
        (acc, item) => ({
          startingBalance:
            acc.startingBalance + (Number(item?.startingBalance) || 0),
          trueCredits: acc.trueCredits + (Number(item?.trueCredits) || 0),
          totalDebits: acc.totalDebits + (Number(item?.totalDebits) || 0),
          endingBalance: acc.endingBalance + (Number(item?.endingBalance) || 0),
          mca: acc.mca + (Number(item?.mca) || 0),
          mcaWithholdPercent: parseFloat(
            (
              acc.mcaWithholdPercent +
              (parseFloat(item.mcaWithholdPercent?.replace("%", "")) || 0)
            )?.toFixed(2)
          ),
          withdrawalTotal:
            acc.withdrawalTotal + (Number(item?.withdrawalTotal) || 0),
          profitMargin: acc.profitMargin + (Number(item?.profitMargin) || 0),
        }),
        {
          startingBalance: 0,
          trueCredits: 0,
          totalDebits: 0,
          endingBalance: 0,
          mca: 0,
          mcaWithholdPercent: 0,
          withdrawalTotal: 0,
          profitMargin: 0,
        }
      );

    return (
      <Table sx={styles.table} size="small">
        <TableHead>
          <TableRow>
            {[
              "Statement Month",
              "Starting Balance",
              "True Credits",
              "Total Debits",
              "Ending Balance",
              "# Mcas",
              "Mca Withhold Percent",
              "Withdrawal Total",
              "Profit Margin",
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
                item?.statementMonthAndYear || "--",
                formatAsDollar(item?.startingBalance) || "--",
                formatAsDollar(item?.trueCredits) || "--",
                formatAsDollar(item?.totalDebits) || "--",
                formatAsDollar(item?.endingBalance) || "--",
                item?.mca || "--",
                item?.mcaWithholdPercent || "--",
                formatAsDollar(item?.withdrawalTotal) || "--",
                formatAsDollar(item?.profitMargin) || "--",
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
              {formatAsDollar(totals?.trueCredits) || "--"}
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
              {formatAsDollar(totals?.endingBalance) || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {totals?.mca || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {`${totals?.mcaWithholdPercent / data?.length}%` || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {formatAsDollar(totals?.withdrawalTotal) || "--"}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                fontFamily: "Nunito",
              }}
            >
              {formatAsDollar(totals?.profitMargin) || "--"}
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
        Aggregated Statement Summary
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
            {data && data?.length > 0 ? (
              <div
                style={{
                  marginBottom: "20px",
                }}
              >
                {renderTable(data)}
              </div>
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
                No Aggregated Statement Summary Data.
              </Typography>
            )}
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
