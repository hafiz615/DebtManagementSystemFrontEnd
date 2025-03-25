import * as React from "react";
import { useNavigate } from "react-router";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import useMediaQuery from "@mui/material/useMediaQuery";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CreateIcon from "@mui/icons-material/Create";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Colors } from "../config/default";
import MuiModels from "./models";
import Prompt from "./prompt";
import { useToast } from "../toast/toastContext";
import { RetryAuth, RetryCapture, SendPayment } from "../services/services";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_SMALL,
  FONT_SIZE_XL,
} from "../constants/appConstants";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
import Dropdown from "./dropdown";
import ScrollbarStyles from "././customScroll";
import { AddIcCallOutlined, Paid } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

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
    padding: "16px 1rem",
    fontFamily: "Nunito",
    "&:not(:first-of-type)": {
      opacity: 0.7,
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: Colors.VIOLET,
  },
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
  showDueDate,
  accordionHeight,
  apiPagination,
  currentPage,
  setCurrentPage,
  totalPages,
  arrayName,
  getHomeData,
  loading,
  onPaymentRowClick,
  defaultHeight,
  setPaginationRows,
  paginationRows,
  requiredLinkIcons,
  getLinks,
  handleModalClose,
  homeData,
}) {
  const mediumScreen = useMediaQuery(
    "(min-width:300px) and (max-width:1150px)"
  );
  const smallScreen = useMediaQuery("(min-width:300px) and (max-width:620px)");
  const navigate = useNavigate();
  const generalPermissions = useSelector(
    (state) => state?.permissions?.permissions?.generalPermissions
  );
  const { showToast } = useToast();
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

  const handlePayment = async (id) => {
    let result;
    if (arrayName === "failedAuthorizations") {
      result = await RetryAuth(id);
    } else if (arrayName === "failedPayments") {
      result = await RetryCapture(id);
    }
    if (result?.status === 200) {
      showToast(result?.data?.message, "success");
      getHomeData(arrayName, 1);
    } else if (
      result?.response?.status === 401 ||
      result?.response?.status === 403
    ) {
      localStorage.clear();
      navigate("/");
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
  const rowsOptions = [
    { label: "5", value: "5" },
    { label: "15", value: "15" },
    { label: "30", value: "30" },
  ];

  return (
    <Paper
      sx={{
        backgroundColor: Colors.WHITE,
        borderRadius: "10px",
        width: { xs: "65vw", sm: "100%" },
        height: defaultHeight || accordionHeight,
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
            overflowY: "auto",
            ...ScrollbarStyles,
          }}
        >
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {headerData
                  ?.filter(
                    (header) =>
                      (showFailureReason || header !== "Failure Reason") &&
                      (showDueDate || header !== "Due Date") &&
                      (arrayName === "upcomingPayments" ||
                      arrayName === "creditorUpcomingPayments"
                        ? header !== "Payment Type"
                        : "auto")
                  )
                  ?.map((header, index) => (
                    <StyledTableCell
                      align="left"
                      sx={{
                        fontWeight: "700",
                        fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
                      }}
                      key={index}
                    >
                      {header}
                    </StyledTableCell>
                  ))}
                {(requiredIcons || requiredCustomFieldIcons) && (
                  <StyledTableCell
                    align="left"
                    sx={{
                      fontWeight: "700",
                      fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
                    }}
                  >
                    Actions
                  </StyledTableCell>
                )}
                {generalPermissions?.retryPayment &&
                  (arrayName === "failedAuthorizations" ||
                    arrayName === "failedPayments") && (
                    <StyledTableCell
                      align="left"
                      sx={{
                        fontWeight: "700",
                        fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
                        paddingRight: "0.5rem !important",
                      }}
                    >
                      Retry
                    </StyledTableCell>
                  )}
                {/* {arrayName === "successCaptures" && (
                  <StyledTableCell
                    align="left"
                    sx={{
                      fontWeight: "700",
                      fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
                      paddingRight: "0.5rem !important",
                    }}
                  >
                    Send Payment
                  </StyledTableCell>
                )} */}
              </TableRow>
            </TableHead>
            {loading ? (
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell
                    colSpan={headerData?.length + 1}
                    align="center"
                  >
                    <CircularProgress
                      size={20}
                      sx={{ color: Colors.SKY_BLUE }}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            ) : isEmpty(data) ? (
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell
                    colSpan={headerData?.length + 1}
                    align="center"
                  >
                    No data available
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            ) : (
              <TableBody>
                {(apiPagination
                  ? data
                  : data?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                )?.map((row) => (
                  <StyledTableRow
                    key={row?.id}
                    onClick={() =>
                      onRowClick
                        ? onRowClick(row?.id)
                        : onPaymentRowClick
                        ? onPaymentRowClick(row?.caseId)
                        : undefined
                    }
                  >
                    {Object.entries(row)
                      ?.filter(
                        ([key]) =>
                          key !== "id" &&
                          key !== "caseId" &&
                          (arrayName === "creditorUpcomingPayments" ||
                          arrayName === "failedAuthorizations" ||
                          arrayName === "failedCaptures" ||
                          arrayName === "successAuthorizations" ||
                          arrayName === "successCaptures" ||
                          arrayName === "successPayments" ||
                          arrayName === "upcomingPayments"
                            ? key !== "status"
                            : true) &&
                          (arrayName === "upcomingPayments" ||
                          arrayName === "creditorUpcomingPayments"
                            ? key !== "transactionType"
                            : true) &&
                          (showFailureReason || key !== "failureReason") &&
                          (showDueDate || key !== "dueDate")
                      )
                      ?.map(([key, value], i) => (
                        <StyledTableCell
                          sx={{
                            fontSize: {
                              xs: "10px !important",
                              sm: "14px !important",
                            },
                            paddingRight: "0.5rem !important",
                          }}
                          key={i}
                        >
                          {/* Truncate link if key is 'link', otherwise render value normally */}
                          {key === "link" && typeof value === "string" ? (
                            value?.length > 20 ? (
                              <span title={value}>{`${value?.slice(
                                0,
                                mediumScreen ? 50 : 120
                              )}...`}</span>
                            ) : (
                              value
                            )
                          ) : typeof value === "object" && value !== null ? (
                            JSON.stringify(value)
                          ) : (
                            value
                          )}
                        </StyledTableCell>
                      ))}

                    {/* Display requiredLinkIcons if available */}
                    {requiredLinkIcons && (
                      <StyledTableCell
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          height: "3rem",
                          marginRight: "4rem",
                        }}
                      >
                        <Prompt
                          deleting="Url's"
                          heading="Delete Url's"
                          text={`Are you sure you want to delete this link ?`}
                          id={row?.id}
                          getLinks={getLinks}
                          handleModalClose={handleModalClose}
                        />
                      </StyledTableCell>
                    )}
                    {/* Display other icons like requiredIcons */}
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

                    {/* Display requiredCustomFieldIcons */}
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

                    {(arrayName === "failedAuthorizations" ||
                      arrayName === "failedPayments") && (
                      <StyledTableCell
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          zIndex: 999,
                        }}
                      >
                        {generalPermissions?.retryPayment && (
                          <Prompt
                            heading="Retry"
                            text={`Are you sure you want to Retry?`}
                            handlePayment={handlePayment}
                            item={row?.id}
                            showPayment={true}
                          />
                        )}
                      </StyledTableCell>
                    )}

                    {/* Handle special case for successCaptures */}
                    {/* {arrayName === "successCaptures" && (
                      <StyledTableCell
                        align="left"
                        sx={{
                          fontWeight: "700",
                          fontSize: {
                            xs: FONT_SIZE_SMALL,
                            sm: FONT_SIZE_LARGE,
                          },
                          paddingRight: "0.5rem !important",
                        }}
                      >
                        <Tooltip
                          title={row?.status || "No status available"}
                          arrow
                        >
                          <span>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                sendPaymentCreditor(row?.id);
                              }}
                              disabled={
                                arrayName === "successCaptures" &&
                                row?.status === "Success"
                              }
                            >
                              <Paid
                                sx={{
                                  color:
                                    arrayName === "successCaptures" &&
                                    row?.status === "Success"
                                      ? "gray"
                                      : Colors.SKY_BLUE,
                                }}
                              />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </StyledTableCell>
                    )} */}
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
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
              }}
            >
              {!smallScreen && "Rows Per Page"}
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
            rowsPerPageOptions={[5, 10, 30]}
            component="div"
            count={data?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={smallScreen ? "" : "Rows per page:"}
            style={{
              alignSelf: "flex-end",
              minHeight: "3rem",
            }}
          />
        )}
      </div>
    </Paper>
  );
}
