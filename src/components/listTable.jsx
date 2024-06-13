import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Paper, IconButton, Typography } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import CreateIcon from "@mui/icons-material/Create";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Colors } from "../config/default";
import MuiModels from "./models";
import { isEmpty } from "lodash";

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

export default function ListTable({
  data,
  headerData,
  onRowClick,
  requiredIcons,
  requiredCustomFieldIcons,
  showFailureReason,
  accordionHeight,
  apiPagination,
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const backward = () => {
    setCurrentPage(currentPage - 1);
  };

  const forward = () => {
    setCurrentPage(currentPage + 1);
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
        height: accordionHeight,
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
                {headerData
                  ?.filter(
                    (header) => showFailureReason || header !== "Failure Reason"
                  )
                  ?.map((header, index) => (
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
            {isEmpty(data) ? (
              <StyledTableRow>
                <StyledTableCell
                  colSpan={headerData?.length + 1}
                  align="center"
                >
                  No data available
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? data?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : data
                )?.map((row) => (
                  <StyledTableRow
                    key={row?.id}
                    onClick={() =>
                      onRowClick ? onRowClick(row?.id) : undefined
                    }
                  >
                    {Object.entries(row)
                      ?.filter(
                        ([key]) =>
                          key !== "id" &&
                          (showFailureReason || key !== "failureReason")
                      )
                      ?.map(([key, value], i) => (
                        <StyledTableCell key={i}>{value}</StyledTableCell>
                      ))}
                    {requiredIcons && (
                      <StyledTableCell
                        sx={{
                          display: "flex",
                          alignItems: "center",
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

                        <DeleteForeverOutlinedIcon
                          sx={{
                            color: Colors.DARK_GRAY,
                            cursor: "pointer",
                            fontSize: "20px",
                            marginLeft: "0.5rem",
                          }}
                        />

                        <MoreHorizOutlinedIcon
                          sx={{
                            color: Colors.DARK_GRAY,
                            cursor: "pointer",
                            fontSize: "20px",
                            marginLeft: "0.5rem",
                          }}
                        />
                      </StyledTableCell>
                    )}
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        {apiPagination ? (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              margin: "10px 0px",
              gap: "20px",
            }}
          >
            <Typography sx={{ fontFamily: "Nunito", fontSize: "14px" }}>
              Rows Per Page: 5
            </Typography>
            <Typography sx={{ fontFamily: "Nunito", fontSize: "14px" }}>
              {totalPages === 0 ? 0 : currentPage} of {totalPages}
            </Typography>
            <IconButton onClick={backward} disabled={currentPage === 1}>
              <ArrowBackIosNewIcon sx={{ fontSize: "16px" }} />
            </IconButton>

            <IconButton onClick={forward} disabled={currentPage === totalPages}>
              <ArrowForwardIosIcon sx={{ fontSize: "16px" }} />
            </IconButton>
          </div>
        ) : (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{
              alignSelf: "flex-end",
              marginBottom: "1rem",
            }}
          />
        )}
      </div>
    </Paper>
  );
}
