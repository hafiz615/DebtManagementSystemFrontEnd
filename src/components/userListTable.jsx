import * as React from "react";
import { styled } from "@mui/material/styles";
import { Table, IconButton } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import CloseIcon from "@mui/icons-material/Close";
import CreateIcon from "@mui/icons-material/Create";

import { Colors } from "../config/default";

const StyledTableCell = styled(TableCell)(() => ({
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
    width: "200px",
  },
  "&.emailCell": {
    maxWidth: 200, // Adjust as needed
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  "&.addressCell": {
    maxWidth: 200, // Adjust as needed
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
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
    "&:not(:first-child)": {
      opacity: 0.7,
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: Colors.LIGHT_BLUE_COLOR,
    paddingLeft: "1rem",
  },
  padding: "0.5rem",
  position: "relative",
  "&:hover": {
    backgroundColor: "#DADADA",
    cursor: "pointer",
  },
  "&:last-child td, &:last-child th": {
    border: "none",
  },
}));

export default function UserListTable({
  rows,
  columns,
  requiredCustomFieldIcons,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper
      sx={{
        backgroundColor: Colors.WHITE,
        borderRadius: "10px ",
        width: "100%",
        height: "55vh",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <TableContainer style={{ flexGrow: 1 }}>
          <Table aria-label="customized table">
            <TableHead sx={{ fontFamily: "Nunito" }}>
              <TableRow sx={{ fontFamily: "Nunito" }}>
                {columns?.map((column, index) => (
                  <StyledTableCell
                    align="left"
                    sx={{ fontWeight: "700" }}
                    key={index}
                    className={
                      column.field === "email"
                        ? "emailCell"
                        : column.field === "address"
                        ? "addressCell"
                        : ""
                    }
                  >
                    {column?.headerName}
                  </StyledTableCell>
                ))}
                {requiredCustomFieldIcons && (
                  <StyledTableCell align="left" sx={{ fontWeight: "700" }}>
                    Actions
                  </StyledTableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rows
              ).map((row, index) => (
                <StyledTableRow key={row.id}>
                  {columns?.map((column, colIndex) => (
                    <StyledTableCell key={colIndex}>
                      {column.field === "email" && row[column.field].length > 10
                        ? row[column.field].substring(0, 15) + "..."
                        : column.field === "address" &&
                          row[column.field].length > 15
                        ? row[column.field].substring(0, 10) + "..."
                        : row[column.field]}
                    </StyledTableCell>
                  ))}
                  {requiredCustomFieldIcons && (
                    <StyledTableCell
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <IconButton>
                        <CreateIcon
                          sx={{
                            color: Colors.BLACK,
                            cursor: "pointer",
                            fontSize: "16px",
                          }}
                        />
                      </IconButton>
                      <IconButton>
                        <CloseIcon
                          sx={{
                            color: Colors.ORANGE_COLOR,
                            cursor: "pointer",
                            fontSize: "16px",
                            marginLeft: "0.5rem",
                          }}
                        />
                      </IconButton>
                    </StyledTableCell>
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ alignSelf: "flex-end" }}
        />
      </div>
    </Paper>
  );
}
