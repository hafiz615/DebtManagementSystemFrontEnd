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
    color: Colors.DARK_GRAY,
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

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

export default function CustomizedTables({ data, headerData }) {
  return (
    <TableContainer>
      <Table sx={{ border: "none" }} aria-label="customized table">
        <TableHead sx={{ fontFamily: "Nunito" }}>
          <TableRow sx={{ fontFamily: "Nunito" }}>
            {headerData?.map((header, index) => (
              <StyledTableCell
                align="left"
                sx={{
                  fontWeight: "700",
                }}
                key={index}
              >
                {header}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {row}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {row}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {row}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {row}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {row}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
