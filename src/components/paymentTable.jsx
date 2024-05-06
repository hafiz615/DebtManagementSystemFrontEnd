import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Colors } from "../config/default";

// Import icons from MUI Icons library
import {
  LocalPhone,
  Textsms,
  Mail,
  EditCalendar,
  OpenInNew,
  Sync,
} from "@mui/icons-material";

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
  position: "relative", // Added position relative for proper icon positioning
  "&:hover": {
    backgroundColor: "#DADADA",
    cursor: "pointer",
    // Show icons on hover
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

export default function CustomizedTables({ data, headerData, showTableData }) {
  return (
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
        <TableBody>
          {data?.map((row, index) => (
            <StyledTableRow key={index}>
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
      </Table>
    </TableContainer>
  );
}
