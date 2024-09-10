import * as React from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";

import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { Colors } from "../config/default";
import MuiModels from "./models";
import Prompt from "./prompt";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CircularProgress } from "@mui/material";
import { isEmpty } from "lodash";
import ScrollbarStyles from "././customScroll";
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
    position: "sticky",
    top: 0,
    backgroundColor: Colors.WHITE,
    zIndex: theme.zIndex.appBar,
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

export default function ListTableDynamic({
  data,
  headerData,
  onRowClick,
  requiredIcons,
  requiredCustomFieldIcons,
  handleModalClose,
  froalaEditor,
  setFroalaEditor,
  templateType,
  getSettings,
  loading,
  setLoading,
  show,
}) {
  const smallScreen = useMediaQuery("(min-width:300px) and (max-width:900px)");
  const settings = useSelector(
    (state) => state?.permissions?.permissions?.settings
  );
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
        overflowY: !show ? "auto" : "visible",
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
            overflowY: !show ? "auto" : "visible",
            maxHeight: !show ? "calc(100% - 48px)" : "none",
            ...ScrollbarStyles,
          }}
        >
          <Table aria-label="customized table">
            <TableHead sx={{ fontFamily: "Nunito" }}>
              <TableRow sx={{ fontFamily: "Nunito" }}>
                {headerData?.map((header, index) => (
                  <StyledTableCell
                    align="left"
                    sx={{ fontWeight: "700", width: header.width }}
                    key={index}
                  >
                    {header?.heading}
                  </StyledTableCell>
                ))}

                {(requiredIcons || requiredCustomFieldIcons) && (
                  <StyledTableCell
                    align="left"
                    sx={{ fontWeight: "700", width: "10%" }}
                  >
                    Actions
                  </StyledTableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <StyledTableRow>
                  <StyledTableCell
                    colSpan={headerData?.length + 1}
                    align="center"
                  >
                    <CircularProgress
                      size={30}
                      sx={{ color: Colors.SKY_BLUE }}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ) : isEmpty(data) ? (
                <StyledTableRow>
                  <StyledTableCell
                    colSpan={headerData?.length + 1}
                    align="center"
                  >
                    No data available
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                (rowsPerPage > 0
                  ? data?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : data
                )?.map((row, i) => (
                  <StyledTableRow
                    key={i}
                    onClick={() =>
                      onRowClick
                        ? onRowClick(row?.templateId, row?.content)
                        : undefined
                    }
                  >
                    {headerData?.map(({ key, width }, i) => (
                      <StyledTableCell key={i} sx={{ width }}>
                        {row[key]}
                      </StyledTableCell>
                    ))}

                    {requiredIcons && (
                      <StyledTableCell
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {settings?.editNotificationTemplate ? (
                          <MuiModels
                            show="textEditor"
                            froalaEditor={froalaEditor}
                            setFroalaEditor={setFroalaEditor}
                            getSettings={getSettings}
                            row={row}
                            templateType={templateType}
                            button="create"
                            buttonText="EDIT"
                            loading={loading}
                            setLoading={setLoading}
                          />
                        ) : null}
                        {settings?.deleteNotificationTemplate ? (
                          <Prompt
                            heading="Delete Template"
                            deleting="delete template"
                            text={`Are you sure you want to delete ${row?.name} ?`}
                            templateType={templateType}
                            getSettings={getSettings}
                            row={row}
                            iconSize="16px"
                          />
                        ) : null}
                        {!settings?.editNotificationTemplate &&
                          !settings?.deleteNotificationTemplate && (
                            <span>--</span>
                          )}
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
                        {settings?.editCustomFields && (
                          <MuiModels
                            show="editField"
                            data={row}
                            handleModalClose={handleModalClose}
                          />
                        )}
                        {settings?.deleteCustomFields && (
                          <Prompt
                            deleting="Custom Field"
                            heading="Delete Custom Field"
                            text={`Are you sure you want to delete ${row?.name} ?`}
                            id={row?._id}
                            handleModalClose={handleModalClose}
                          />
                        )}

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
                ))
              )}
            </TableBody>
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
            alignSelf: smallScreen ? "center" : "flex-end",
            minHeight: "5rem",
            width: smallScreen ? "70%" : "auto",
          }}
        />
      </div>
    </Paper>
  );
}
