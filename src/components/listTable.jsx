import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import IconButton from "@mui/material/IconButton";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import CreateIcon from "@mui/icons-material/Create";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { Colors } from "../config/default";
import { Box } from "@mui/material";
import MuiModels from "./models";

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
    ".icons": {
      display: "flex",
    },
  },
  "&:last-child td, &:last-child th": {
    border: "none",
  },
}));

export default function ListTable({
  data,
  headerData,
  onRowClick,
  requiredIcons,
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <TableContainer style={{ flexGrow: 1 }}>
          <Table aria-label="customized table">
            <TableHead sx={{ fontFamily: "Nunito" }}>
              <TableRow sx={{ fontFamily: "Nunito" }}>
                {headerData?.map((header, index) => (
                  <StyledTableCell
                    align="left"
                    sx={{ fontWeight: "700" }}
                    key={index}
                  >
                    {header}
                  </StyledTableCell>
                ))}
                {requiredIcons && (
                  <StyledTableCell align="left" sx={{ fontWeight: "700" }}>
                    Actions
                  </StyledTableCell>
                )}
                {requiredCustomFieldIcons && (
                  <StyledTableCell align="left" sx={{ fontWeight: "700" }}>
                    Actions
                  </StyledTableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? data?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : data
              )?.map((row, index) => (
                <StyledTableRow
                  key={index}
                  onClick={() => (onRowClick ? onRowClick(index) : undefined)}
                >
                  {Object?.values(row)?.map((value, i) => (
                    <StyledTableCell key={i}>{value}</StyledTableCell>
                  ))}
                  {requiredIcons && (
                    <StyledTableCell
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CreateIcon
                          sx={{
                            color: Colors.DARK_GRAY,
                            cursor: "pointer",
                            fontSize: "20px",
                          }}
                        />

                        <CloseIcon
                          sx={{
                            color: Colors.ORANGE_COLOR,
                            cursor: "pointer",
                            fontSize: "20px",
                            marginLeft: "0.5rem",
                          }}
                        />
                        <VisibilityIcon
                          sx={{
                            color: Colors.DARK_GRAY,
                            cursor: "pointer",
                            fontSize: "20px",
                            marginLeft: "0.5rem",
                          }}
                        />
                      </Box>
                    </StyledTableCell>
                  )}
                  {requiredCustomFieldIcons && (
                    <StyledTableCell
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "3rem",
                      }}
                    >
                      <MuiModels show="editField" />
                      <IconButton>
                        <DeleteForeverOutlinedIcon
                          sx={{
                            color: Colors.DARK_GRAY,
                            cursor: "pointer",
                            fontSize: "16px",
                            marginLeft: "0.5rem",
                          }}
                        />
                      </IconButton>
                      <IconButton>
                        <MoreHorizOutlinedIcon
                          sx={{
                            color: Colors.DARK_GRAY,
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
          count={data?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ alignSelf: "flex-end", marginBottom: "1rem" }}
        />
      </div>
    </Paper>
  );
}
