import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

export default function TransactionHistoryTable({ data }) {
  const headers = ["Date", "Description", "Amount", "Memo", "Number"];
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: "50vh",
        boxShadow: "none",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {headers?.map((header, index) => (
              <TableCell
                key={index}
                align="center"
                sx={{
                  fontWeight: "600",
                  fontFamily: "Nunito",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length > 0 ? (
            data?.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center" sx={{ fontFamily: "Nunito" }}>
                  {row?.date || "--"}
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: "Nunito" }}>
                  {row?.description || "--"}
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: "Nunito" }}>
                  {row?.amount || "--"}
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: "Nunito" }}>
                  {row?.memo || "--"}
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: "Nunito" }}>
                  {row?.number || "--"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers?.length} align="center">
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ fontFamily: "Nunito" }}
                >
                  No data available
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
