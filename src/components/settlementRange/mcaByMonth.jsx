import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Grid,
  Tooltip,
} from "@mui/material";
import ScrollbarStyles from "../customScroll";
import { Colors } from "../../config/default";
import { Divider } from "@mui/material";
const styles = {
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

const McaByMonthTable = ({ mcaByMonth }) => {
  const cellStyleHeader = {
    fontFamily: "Nunito",
    fontWeight: "600",
  };
  const cellStyleBody = {
    fontFamily: "Nunito",
  };

  // Function to format amounts with dollar sign
  const formatAsDollar = (value) =>
    value !== undefined && value !== null
      ? `$${Number(value).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "--";
  if (!mcaByMonth || Object.keys(mcaByMonth).length === 0) {
    return (
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
        No MCA Data.
      </Typography>
    );
  }

  return (
    <Grid
      item
      xs={12}
      sx={{
        height: "60vh",
        overflowY: "auto",
        ...ScrollbarStyles,
      }}
    >
      {Object.entries(mcaByMonth)?.map(([month, records]) => {
        const { work_days, account } = records[0] || {};

        const totalWithdrawal = records?.reduce(
          (sum, record) => sum + (Number(record?.withdrawal_total) || 0),
          0
        );
        const totalDeposit = records?.reduce(
          (sum, record) => sum + (Number(record?.deposit_total) || 0),
          0
        );
        const totalLatestWithdrawal = records?.reduce(
          (sum, record) =>
            sum + (Number(record?.latest_withdrawal_amount) || 0),
          0
        );

        return (
          <Paper elevation={3} key={month}>
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
              Month: {month} ({work_days || "--"} work days)
            </Typography>
            <Divider
              sx={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                height: "1px",
              }}
            />
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
              }}
            >
              Account: {account || "--"}
            </Typography>
            <Divider
              sx={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                height: "1px",
              }}
            />
            <TableContainer>
              <Table sx={styles.table} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={cellStyleHeader}>Lender</TableCell>
                    <TableCell sx={cellStyleHeader}>Withdrawal Count</TableCell>
                    <TableCell sx={cellStyleHeader}>Withdrawal Total</TableCell>
                    <TableCell sx={cellStyleHeader}>Deposit Total</TableCell>
                    <TableCell sx={cellStyleHeader}>Deposit Dates</TableCell>
                    <TableCell sx={cellStyleHeader}>
                      Latest Withdrawal Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records?.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell sx={styles.tableCell}>
                        {record?.lender || "--"}
                      </TableCell>
                      <TableCell sx={styles.tableCell}>
                        {record?.withdrawal_count || "--"}
                      </TableCell>
                      <TableCell sx={styles.tableCell}>
                        {formatAsDollar(record?.withdrawal_total) || "--"}
                      </TableCell>
                      <TableCell sx={styles.tableCell}>
                        {formatAsDollar(record?.deposit_total) || "--"}
                      </TableCell>
                      <TableCell
                        sx={{
                          ...cellStyleBody,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "150px",
                        }}
                      >
                        <Tooltip title={record?.deposit_dates || "--"} arrow>
                          <span>{record?.deposit_dates || "--"}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={styles.tableCell}>
                        {formatAsDollar(record?.latest_withdrawal_amount) ||
                          "--"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Add Totals Row */}
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
                    <TableCell colSpan={1}></TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        textAlign: "left",
                        fontFamily: "Nunito",
                      }}
                    >
                      {formatAsDollar(totalWithdrawal) || "--"}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        textAlign: "left",
                        fontFamily: "Nunito",
                      }}
                    >
                      {formatAsDollar(totalDeposit) || "--"}
                    </TableCell>
                    <TableCell colSpan={1}></TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        textAlign: "left",
                        fontFamily: "Nunito",
                      }}
                    >
                      {formatAsDollar(totalLatestWithdrawal) || "--"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        );
      })}
    </Grid>
  );
};

export default McaByMonthTable;
