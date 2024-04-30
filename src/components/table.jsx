import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,

    color: "BLACK",
    border: "none",
    paddingInlineStart: "0", // Setting left padding to 0
    paddingInlineEnd: "0", // Setting right padding to 0
    paddingTop: "16px", // Adjusting vertical padding
    paddingBottom: "16px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: "none",
    paddingInlineStart: "0", // Setting left padding to 0
    paddingInlineEnd: "0", // Setting right padding to 0
    paddingTop: "16px", // Adjusting vertical padding
    paddingBottom: "16px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    // backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: "none",
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData(
    "User Name",
    "4/2/2024",
    "$3,254.00",
    "721-07-4426",
    "Lorium Ipsum"
  ),
  createData(
    "User Name",
    "4/2/2024",
    "$3,254.00",
    "721-07-4426",
    "Lorium Ipsum"
  ),
  createData(
    "User Name",
    "4/2/2024",
    "$3,254.00",
    "721-07-4426",
    "Lorium Ipsum"
  ),
  createData(
    "User Name",
    "4/2/2024",
    "$3,254.00",
    "721-07-4426",
    "Lorium Ipsum"
  ),
  createData(
    "User Name",
    "4/2/2024",
    "$3,254.00",
    "721-07-4426",
    "Lorium Ipsum"
  ),
];

export default function CustomizedTables() {
  return (
    <TableContainer>
      <Table sx={{ border: "none" }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left" sx={{ fontWeight: "700" }}>
              Name{" "}
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ fontWeight: "700" }}>
              Due Date
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ fontWeight: "700" }}>
              Amount
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ fontWeight: "700" }}>
              SSID
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ fontWeight: "700" }}>
              Failure Reason
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="left">{row.calories}</StyledTableCell>
              <StyledTableCell align="left">{row.fat}</StyledTableCell>
              <StyledTableCell align="left">{row.carbs}</StyledTableCell>
              <StyledTableCell align="left">{row.protein}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
