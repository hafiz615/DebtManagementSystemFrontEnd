import * as React from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Table, Typography, IconButton, CircularProgress } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import BasicModal from "./customPopup";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { Colors } from "../config/default";
import Prompt from "./prompt";
import { isEmpty } from "lodash";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_SMALL,
  FONT_SIZE_XL,
} from "../constants/appConstants";
import Dropdown from "./dropdown";

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
    position: "sticky",
    top: 0,
    backgroundColor: Colors.WHITE,
    zIndex: 1000,
  },
  "&.emailCell": {
    maxWidth: 200,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  "&.addressCell": {
    maxWidth: 200,
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
  },
  "&:last-child td, &:last-child th": {
    border: "none",
  },
}));

export default function UserListTable({
  rows,
  columns,
  requiredCustomFieldIcons,
  GetUsers,
  handleUserDelete,
  apiPagination,
  currentPage,
  setCurrentPage,
  totalPages,
  loading,
  setPaginationRows,
  paginationRows,
}) {
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const generalPermissions = useSelector(
    (state) => state?.permissions?.permissions?.generalPermissions
  );
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(paginationRows);

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

  const rowsOptions = [
    { label: "5", value: "5" },
    { label: "15", value: "15" },
    { label: "30", value: "30" },
  ];

  return (
    <Paper
      sx={{
        backgroundColor: Colors.WHITE,
        borderRadius: "10px ",
        width: { xs: "65vw", sm: "100%" },
        height: "55vh",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <TableContainer
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: Colors.WHITE,
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#E5E5E5",
              borderRadius: "8px",
            },
          }}
        >
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
                {requiredCustomFieldIcons &&
                  (role === "Admin" || role === "Super User") && (
                    <StyledTableCell align="left" sx={{ fontWeight: "700" }}>
                      Actions
                    </StyledTableCell>
                  )}
              </TableRow>
            </TableHead>
            {loading ? (
              <StyledTableRow>
                <StyledTableCell colSpan={columns?.length + 1} align="center">
                  <CircularProgress size={20} sx={{ color: Colors.SKY_BLUE }} />
                </StyledTableCell>
              </StyledTableRow>
            ) : isEmpty(rows) ? (
              <StyledTableRow>
                <StyledTableCell colSpan={columns?.length + 1} align="center">
                  No data available
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              <TableBody>
                {rows?.map((row) => (
                  <StyledTableRow key={row.id}>
                    {columns?.map((column, colIndex) => (
                      <StyledTableCell key={colIndex}>
                        {column?.field === "email" &&
                        row[column?.field]?.length > 10
                          ? row[column.field]?.substring(0, 15) + "..."
                          : column?.field === "address" &&
                            row[column?.field]?.length > 15
                          ? row[column?.field]?.substring(0, 10) + "..."
                          : row[column?.field]}
                      </StyledTableCell>
                    ))}

                    <StyledTableCell
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "3rem",
                      }}
                    >
                      {(requiredCustomFieldIcons && role === "Admin") ||
                      role === "Super User" ? (
                        <BasicModal
                          modelButton="ADD USERS"
                          modalType="edit"
                          GetUsers={GetUsers}
                          id={row?.id}
                        />
                      ) : null}
                      {requiredCustomFieldIcons &&
                        generalPermissions?.deleteUser && (
                          <Prompt
                            heading="Delete User"
                            text={`Are you sure you want to delete ${row?.email} ?`}
                            id={row?.id}
                            handleUserDelete={handleUserDelete}
                            GetUsers={GetUsers}
                            deleting="Delete User"
                          />
                        )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        {apiPagination ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                margin: "10px 0px",
                gap: "20px",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
                }}
              >
                Rows Per Page:
              </Typography>
              <Dropdown
                menuWidth="3rem"
                menuItems={rowsOptions}
                placeholder="Type"
                backgroundColor={Colors.BG_LIGHT_GRAY}
                hoverColor={Colors.BG_LIGHT_GRAY}
                width="3rem"
                selectedValue={paginationRows}
                setSelectedValue={setPaginationRows}
              />
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
                }}
              >
                {totalPages === 0 ? 0 : isNaN(totalPages) ? 0 : currentPage} of{" "}
                {isNaN(totalPages) ? 0 : totalPages}
              </Typography>
              <IconButton
                onClick={backward}
                disabled={currentPage === 1 || currentPage === 0}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: FONT_SIZE_XL }} />
              </IconButton>
              <IconButton
                onClick={forward}
                disabled={
                  currentPage === totalPages ||
                  totalPages === 0 ||
                  isNaN(totalPages)
                }
              >
                <ArrowForwardIosIcon sx={{ fontSize: FONT_SIZE_XL }} />
              </IconButton>
            </div>
          </>
        ) : (
          <TablePagination
            rowsPerPageOptions={[5, 10, 30]}
            component="div"
            count={rows?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{ alignSelf: "flex-end", mb: "3rem" }}
          />
        )}
      </div>
    </Paper>
  );
}
