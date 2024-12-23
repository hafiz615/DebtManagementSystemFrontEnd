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
} from "@mui/material";
import ScrollbarStyles from "../customScroll";
import { Colors } from "../../config/default";

const McaByMonthTable = ({ mcaByMonth }) => {
  const cellStyleHeader = {
    fontFamily: "Nunito",
    fontWeight: "600",
  };
  const cellStyleBody = {
    fontFamily: "Nunito",
  };

  // Function to format amounts with dollar sign
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "--";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

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
        No data available.
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

        return (
          <Paper elevation={3} key={month}>
            <Typography
              sx={{
                fontFamily: "Nunito",
                backgroundColor: "#CCCCCC",
                height: "8vh",
                display: "flex",
                alignItems: "center",
                paddingLeft: "1rem",
                fontWeight: "600",
              }}
            >
              Month: {month} ({work_days || "--"} work days)
            </Typography>
            <Typography
              sx={{
                fontFamily: "Nunito",
                backgroundColor: "#EEEEEE",
                height: "8vh",
                display: "flex",
                alignItems: "center",
                paddingLeft: "1rem",
              }}
            >
              Account: {account || "--"}
            </Typography>
            <TableContainer>
              <Table>
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
                      <TableCell sx={cellStyleBody}>
                        {record?.lender || "--"}
                      </TableCell>
                      <TableCell sx={cellStyleBody}>
                        {record?.withdrawal_count || "--"}
                      </TableCell>
                      <TableCell sx={cellStyleBody}>
                        {formatCurrency(record?.withdrawal_total)}
                      </TableCell>
                      <TableCell sx={cellStyleBody}>
                        {formatCurrency(record?.deposit_total)}
                      </TableCell>
                      <TableCell sx={cellStyleBody}>
                        {record?.deposit_dates || "--"}
                      </TableCell>
                      <TableCell sx={cellStyleBody}>
                        {formatCurrency(record?.latest_withdrawal_amount)}
                      </TableCell>
                    </TableRow>
                  ))}
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
