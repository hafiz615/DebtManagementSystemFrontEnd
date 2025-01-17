import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Colors } from "../config/default";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CircularProgress } from "@mui/material";
import { isEmpty } from "lodash";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: Colors.BLACK,
    border: "none",
    paddingInlineStart: "0",
    paddingInlineEnd: "0",
    paddingTop: "8px",
    paddingBottom: "8px",
    paddingLeft: "0.5rem",
    fontFamily: "Nunito",
    borderTop: "1px solid #EAEBEB",
  },
  [`&.${tableCellClasses.body}`]: {
    color: Colors.DARK_GRAY,
    fontSize: 14,
    border: "none",
    paddingInlineStart: "0",
    paddingInlineEnd: "0",
    paddingTop: "4px",
    paddingBottom: "4px",
    paddingLeft: "0.5rem",
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
  padding: "0.25rem",
  position: "relative",
  "&:hover": {
    backgroundColor: "#DADADA",
    cursor: "pointer",
  },
  "&:last-child td, &:last-child th": {
    border: "none",
  },
}));

const StickyTableHead = styled(TableHead)(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: Colors.WHITE,
  zIndex: 1,
}));

const StickySummaryRow = styled(TableRow)(({ theme }) => ({
  position: "sticky",
  bottom: 0,
  backgroundColor: Colors.WHITE,
  borderTop: "1px solid #EAEBEB",
  zIndex: 1,
  "&:last-child td, &:last-child th": {
    border: "none",
  },
  "& td": {
    paddingInlineStart: "0",
    paddingInlineEnd: "0",
    paddingTop: "8px",
    paddingBottom: "8px",
    paddingLeft: "0.5rem",
  },
}));

export default function DataSummaryTable({
  data,
  headerData,
  show,
  summaryDetails,
  loading,
}) {
  console.log(data, "data");
  const formatSummaryDetails = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "--";
    return `$${Number(value)?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  const calculateRepaymentAmountSum = (data) => {
    return data?.reduce((total, row) => {
      let repaymentAmount = row?.repayment_amount;

      if (repaymentAmount?.includes("(monthly)")) {
        // If repayment_amount includes (monthly), convert it to weekly
        repaymentAmount =
          (parseFloat(repaymentAmount?.replace(/[^\d.]/g, "")) / 22) * 5;
      } else if (repaymentAmount?.includes("(daily)")) {
        // If repayment_amount includes (daily), convert it to weekly by multiplying by 5
        repaymentAmount =
          parseFloat(repaymentAmount?.replace(/[^\d.]/g, "")) * 5;
      } else {
        // Otherwise, just parse the repayment amount normally
        repaymentAmount = parseFloat(repaymentAmount?.replace(/[^\d.]/g, ""));
      }

      return total + (isNaN(repaymentAmount) ? 0 : repaymentAmount);
    }, 0);
  };

  const repaymentAmountSum = calculateRepaymentAmountSum(data);

  const updatedSummaryDetails = {
    ...summaryDetails,
    repayment_amount: formatSummaryDetails(repaymentAmountSum),
  };
  return (
    <Paper
      sx={{
        backgroundColor: Colors.WHITE,
        borderRadius: "10px ",
        width: "100%",
        height: show ? "25vh" : "55vh",
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
          style={{
            flexGrow: 1,
            overflowY: "auto", // Enable vertical scrolling
            display: "flex",
            flexDirection: "column",
            maxHeight: !show ? "calc(100% - 48px)" : "none",
            position: "relative",
          }}
        >
          <Table aria-label="customized table" style={{ flexGrow: 1 }}>
            <StickyTableHead>
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
              </TableRow>
            </StickyTableHead>

            <TableBody>
              {loading ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={headerData?.length} align="center">
                    <CircularProgress
                      size={30}
                      sx={{ color: Colors.SKY_BLUE }}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ) : isEmpty(data) ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={headerData?.length} align="center">
                    No data available
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                data?.map((row, i) => (
                  <StyledTableRow key={i}>
                    {headerData?.map(({ key, width }, i) => (
                      <StyledTableCell key={i} sx={{ width }}>
                        {key === "repayment_amount" &&
                        row[key]?.includes("(monthly)")
                          ? `$${(
                              (parseFloat(row[key]?.replace(/[^\d.]/g, "")) /
                                22) *
                              5
                            )?.toFixed(2)} (Weekly)`
                          : key === "repayment_amount" &&
                            row[key]?.includes("(daily)")
                          ? `$${(
                              parseFloat(row[key]?.replace(/[^\d.]/g, "")) * 5
                            )?.toFixed(2)} (Weekly)`
                          : key === "repayment_amount"
                          ? row[key] // Show the value from the backend as-is for other cases
                          : key === "purchased_percentage"
                          ? row[key]?.replace(/\s*\(.*?\)/, "")
                          : row[key]}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                ))
              )}
            </TableBody>
            <StickySummaryRow>
              {headerData?.map((header, i) => (
                <StyledTableCell key={i} sx={{ width: header.width }}>
                  {updatedSummaryDetails[header?.key] || "--"}
                </StyledTableCell>
              ))}
            </StickySummaryRow>
          </Table>
        </TableContainer>
      </div>
    </Paper>
  );
}
