import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Typography, Table, IconButton } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CircularProgress from "@mui/material/CircularProgress";

import {
  LocalPhone,
  Textsms,
  Mail,
  EditCalendar,
  OpenInNew,
  Sync,
  Paid,
} from "@mui/icons-material";
import { Colors } from "../config/default";
import { isEmpty, isEqual } from "lodash";
import { formatDollarAmount } from "../common";
import Prompt from "./prompt";
import { useToast } from "../toast/toastContext";
import { RetryAuth, RetryCapture, SendPayment } from "../services/services";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_SMALL,
  FONT_SIZE_XL,
} from "../constants/appConstants";
import { useSelector } from "react-redux";
import Dropdown from "./dropdown";
import ScrollbarStyles from "././customScroll";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: Colors.BLACK,
    border: "none",
    padding: "16px 1rem",
    fontFamily: "Nunito",
    borderTop: "1px solid #EAEBEB",
    position: "sticky",
    top: 0,
    backgroundColor: Colors.WHITE,
    zIndex: theme.zIndex.appBar,
  },
  [`&.${tableCellClasses.body}`]: {
    color: Colors.DARK_GRAY,
    fontSize: FONT_SIZE_LARGE,
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
    backgroundColor: Colors.VIOLET,
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
  width: "calc(100% - 16%)",
  marginTop: "1rem",
  position: "absolute",
  left: 0,
  top: 5,
  backgroundColor: "transparent",
  zIndex: 1,
});

const IconStyle = styled("div")({
  cursor: "pointer",
  marginLeft: "0.5rem",
  marginRight: "1rem",
});

export default function PaymentTabsTable({
  currentPage,
  setCurrentPage,
  data,
  headerData,
  apiPagination,
  totalPages,
  value,
  getHomeData,
  loading,
  onRowClick,
  paginationRows,
  setPaginationRows,
}) {
  const generalPermissions = useSelector(
    (state) => state?.permissions?.permissions?.generalPermissions
  );
  const { showToast } = useToast();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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

  useEffect(() => {
    const generatedData = data?.map((item) => {
      const formattedItem = {
        caseId: item?.caseId,
        id: item?.id,
        name: item?.fullName || "-",
        tryDate: new Date(item?.tryDate)?.toLocaleDateString() || "-",
        totalDebt: formatDollarAmount(item?.totalDebt) || "-",
        ssid: item?.SSID || "-",
        caseOwner: item?.caseOwner || "-",
      };
      if (value === 4) {
        formattedItem.dueDate =
          new Date(item?.dueDate)?.toLocaleDateString() || "-";
      }
      return formattedItem;
    });

    if (!isEqual(generatedData, rows)) {
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

  const backward = () => {
    setCurrentPage(currentPage - 1);
  };

  const forward = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePayment = async (id) => {
    let result;
    if (value === 0) {
      result = await RetryAuth(id);
    } else if (value === 2) {
      result = await RetryCapture(id);
    }
    if (result?.status === 200) {
      showToast(result?.data?.message, "success");
      getHomeData();
    } else {
      showToast(
        result?.response?.data?.message || result?.response?.data?.message,
        "error"
      );
    }
  };
  const sendPaymentCreditor = async (id) => {
    const sendPaymentRes = await SendPayment(id);
    if (sendPaymentRes?.status === 200) {
      showToast(sendPaymentRes?.data?.message, "success");
    } else {
      const errorMessage = sendPaymentRes?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  return (
    <Paper
      sx={{
        backgroundColor: Colors.WHITE,
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <TableContainer
          sx={{
            flexGrow: 1,
            maxHeight: "55vh",
            overflowY: "auto",
            ...ScrollbarStyles,
          }}
        >
          <Table sx={{ border: "none" }} aria-label="customized table">
            <TableHead sx={{ fontFamily: "Nunito", width: "100vw" }}>
              <TableRow sx={{ fontFamily: "Nunito" }}>
                {headerData?.map((header, index) => (
                  <StyledTableCell
                    align="left"
                    sx={{
                      fontWeight: "700",
                      fontSize: {
                        xs: "10px !important",
                        sm: "14px !important",
                      },
                    }}
                    key={index}
                  >
                    {header}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <StyledTableRow>
                  <StyledTableCell
                    colSpan={headerData?.length + 1}
                    align="center"
                    sx={{ padding: "10px !important" }}
                  >
                    <CircularProgress
                      size={24}
                      sx={{ color: Colors.SKY_BLUE }}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ) : isEmpty(rows) ? (
                <StyledTableRow>
                  <StyledTableCell
                    colSpan={headerData?.length + 1}
                    align="center"
                  >
                    No data available
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                rows?.map((row) => {
                  const { id, ...rowData } = row;
                  return (
                    <StyledTableRow
                      key={id}
                      hover
                      onClick={
                        onRowClick
                          ? () => onRowClick(row?.caseId)
                          : (event) => handleClick(event, id)
                      }
                      role="checkbox"
                      aria-checked={isSelected(id)}
                      tabIndex={-1}
                      selected={isSelected(id)}
                    >
                      {Object.entries(rowData).map(
                        ([key, value], i) =>
                          key !== "caseId" && (
                            <StyledTableCell
                              sx={{
                                fontSize: {
                                  xs: "10px !important",
                                  sm: "14px !important",
                                },
                                paddingRight: {
                                  xs: "0.5rem !important",
                                  sm: "0",
                                },
                              }}
                              key={i}
                            >
                              {value}
                            </StyledTableCell>
                          )
                      )}

                      {(value === 0 || value === 3) && (
                        <StyledTableCell
                          align="left"
                          sx={{
                            fontWeight: "700",
                            padding: "0px !important",
                          }}
                        >
                          {generalPermissions?.retryPayment && (
                            <Prompt
                              heading="Retry"
                              text={`Are you sure you want to Retry?`}
                              handlePayment={handlePayment}
                              item={id}
                              showPayment={true}
                            />
                          )}
                        </StyledTableCell>
                      )}
                      {value === 2 && (
                        <StyledTableCell
                          align="left"
                          sx={{
                            fontWeight: "700",
                            fontSize: {
                              xs: FONT_SIZE_SMALL,
                              sm: FONT_SIZE_LARGE,
                            },
                            paddingLeft: "2rem !important",
                          }}
                        >
                          <IconButton
                            onClick={(e) => {
                              sendPaymentCreditor(id);
                              e.stopPropagation();
                            }}
                          >
                            <Paid
                              sx={{
                                color: Colors.SKY_BLUE,
                              }}
                            />
                          </IconButton>
                        </StyledTableCell>
                      )}
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
                  );
                })
              )}
            </TableBody>
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
              disabled={
                currentPage === 1 || isNaN(totalPages) || totalPages === 0
              }
            >
              <ArrowBackIosNewIcon sx={{ fontSize: FONT_SIZE_XL }} />
            </IconButton>
            <IconButton
              onClick={forward}
              disabled={
                currentPage === totalPages ||
                isNaN(totalPages) ||
                totalPages === 0
              }
            >
              <ArrowForwardIosIcon sx={{ fontSize: FONT_SIZE_XL }} />
            </IconButton>
          </div>
        ) : (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </div>
    </Paper>
  );
}
