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

export default function TransactionHistory({ data }) {
  const headers = [
    "Description",
    "DT_RowId",
    "Accountidx",
    "Amount",
    "Date",
    "Memo",
    "Number",
  ];

  return (
    <>
      <Typography
        sx={{
          textAlign: "center",
          width: "100%",
          fontFamily: "Nunito",
          m: "1rem 0px",
          fontWeight: "700",
        }}
      >
        Transaction History
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "85%",
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
                  <TableCell
                    align="center"
                    sx={{
                      width: "25%",
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                    }}
                  >
                    {row?.description || "--"}
                  </TableCell>
                  <TableCell align="center">{row?.DT_RowId || "--"}</TableCell>
                  <TableCell align="center">
                    {row?.accountidx || "--"}
                  </TableCell>
                  <TableCell align="center">{row?.amount || "--"}</TableCell>
                  <TableCell align="center">{row?.date || "--"}</TableCell>
                  <TableCell align="center">{row?.memo || "--"}</TableCell>
                  <TableCell align="center">{row?.number || "--"}</TableCell>
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
    </>
  );
}
