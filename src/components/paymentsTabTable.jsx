import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import {
  LocalPhone,
  Textsms,
  Mail,
  EditCalendar,
  OpenInNew,
  Sync,
} from "@mui/icons-material";
import { Colors } from "../config/default";
import { isEmpty, isEqual } from "lodash";
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
    "&:not(:first-of-type)": {
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
    ".icons": {
      display: "flex",
    },
  },
  "&:last-child td, &:last-child th": {
    border: "none",
  },
}));
const IconsContainer = styled("div")({
  display: "none",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  marginTop: "1rem",
  position: "absolute",
  left: 0,
  top: 0,
  backgroundColor: "transparent",
  zIndex: 1,
});
const IconStyle = styled("div")({
  cursor: "pointer",
  marginLeft: "0.5rem",
  marginRight: "1rem",
});
export default function PaymentTabsTable({ data, headerData }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selected, setSelected] = React.useState([]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const generatedData = data?.map((item, index) => ({
      name: item?.fullName || "-",
      dueDate: item?.dueDate || "-",
      tryDate: item?.tryDate || "-",
      totalDebt: item?.totalDebt || "-",
      ssid: item?.SSID || "-",
      caseOwner: item?.caseOwner || "-",
    }));
    if (!isEqual(generatedData, data)) {
      setRows(generatedData);
    }
  }, [data]);
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  const isSelected = (id) => selected.indexOf(id) !== -1;
  return (
    <Paper>
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
          {isEmpty(rows) ? (
            <StyledTableRow>
              <StyledTableCell colSpan={headerData?.length + 1} align="center">
                No data available
              </StyledTableCell>
            </StyledTableRow>
          ) : (
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rows
              ).map((row, index) => (
                <StyledTableRow
                  key={row.id}
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                  role="checkbox"
                  aria-checked={isSelected(row.id)}
                  tabIndex={-1}
                  selected={isSelected(row.id)}
                >
                  {Object.values(row).map((value, i) => (
                    <StyledTableCell key={i}>{value}</StyledTableCell>
                  ))}
                  <IconsContainer className="icons">
                    <IconStyle
                      onClick={() => {
                        alert("clicked");
                      }}
                    >
                      <LocalPhone />
                    </IconStyle>
                    <IconStyle
                      onClick={() => {
                        alert("clicked");
                      }}
                    >
                      <Textsms />
                    </IconStyle>
                    <IconStyle
                      onClick={() => {
                        alert("clicked");
                      }}
                    >
                      <Mail />
                    </IconStyle>
                    <IconStyle
                      onClick={() => {
                        alert("clicked");
                      }}
                    >
                      <EditCalendar />
                    </IconStyle>
                    <IconStyle
                      onClick={() => {
                        alert("clicked");
                      }}
                    >
                      <OpenInNew />
                    </IconStyle>
                    <IconStyle
                      onClick={() => {
                        alert("clicked");
                      }}
                    >
                      <Sync />
                    </IconStyle>
                  </IconsContainer>
                </StyledTableRow>
              ))}
            </TableBody>
          )}
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
      />
    </Paper>
  );
}
