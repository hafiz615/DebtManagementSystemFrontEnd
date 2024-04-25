import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Colors } from "../config/default";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,

    color: Colors.BLACK,
    border: "none",
    paddingInlineStart: "0",
    paddingInlineEnd: "0",
    paddingTop: "16px",
    paddingBottom: "16px",
    paddingLeft: "1rem",
    fontFamily: "Nunito",
    borderTop: "1px solid #EAEBEB",
  },
  [`&.${tableCellClasses.body}`]: {
    color: Colors.BLACK,
    fontSize: 14,
    border: "none",
    paddingInlineStart: "0",
    paddingInlineEnd: "0",
    paddingTop: "16px",
    paddingBottom: "16px",
    paddingLeft: "1rem",
    fontFamily: "Nunito",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: Colors.LIGHT_BLUE_COLOR,
    paddingLeft: "1rem",
  },
  padding: "0.5rem",
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
        <TableHead sx={{ fontFamily: "Nunito" }}>
          <TableRow sx={{ fontFamily: "Nunito" }}>
            <StyledTableCell
              align="left"
              sx={{
                fontWeight: "700",
              }}
            >
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
