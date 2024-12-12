import * as React from "react";
import {
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
  Tooltip,
} from "@mui/material/";
import { Colors } from "../../config/default";
import { FONT_SIZE_LARGE, FONT_SIZE_SMALL } from "../../constants/appConstants";
import { isEmpty } from "lodash";
import ScrollbarStyles from "./../customScroll";
import Dropdown from "../dropdown";

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

export default function PipelineListTable({
  data,
  headerData,
  onRowClick,
  showFailureReason,
  showDueDate,
  loading,
  page,
  setPage,
  orders,
  order,
  setOrder,
}) {
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
        borderRadius: "10px",
        width: { xs: "65vw", sm: "100%" },
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
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {headerData?.map((header, index) => (
                  <StyledTableCell
                    align="left"
                    sx={{
                      fontWeight: "700",
                      fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
                    }}
                    key={index}
                  >
                    {header === "Business Name" ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {header}
                        <Tooltip
                          title="Sort By Client Business"
                          placement="top-start"
                        >
                          <div>
                            <Dropdown
                              width="8rem"
                              menuItems={orders}
                              selectedValue={order}
                              setSelectedValue={setOrder}
                              backgroundColor={Colors.BG_LIGHT_GRAY}
                              hoverColor={Colors.BG_LIGHT_GRAY}
                            />
                          </div>
                        </Tooltip>
                      </div>
                    ) : (
                      header
                    )}
                  </StyledTableCell>
                ))}
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
                {data
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((row) => (
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
                            {typeof value === "object" && value !== null
                              ? JSON.stringify(value)
                              : value}
                          </StyledTableCell>
                        ))}
                    </StyledTableRow>
                  ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 15, 30]}
          component="div"
          count={data?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{
            alignSelf: "flex-end",
            minHeight: "3rem",
          }}
        />
      </div>
    </Paper>
  );
}
