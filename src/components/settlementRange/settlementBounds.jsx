import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
} from "@mui/material";
import { FONT_SIZE_SMALL } from "../../constants/appConstants";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: FONT_SIZE_SMALL,
  padding: theme.spacing(0.75),
  fontFamily: "Nunito",
}));

const StyledTableContainer = styled(TableContainer)({
  boxShadow: "none",
});

export default function SettlementBounds({ data }) {
  // Extract settlement objects from data
  const settlements = [
    data?.settlement_range_1,
    data?.settlement_range_2,
    data?.settlement_range_3,
  ];

  // Ensure settlements are defined and extract unique keys from the first non-null settlement
  const keys = Object.keys(settlements.find((settlement) => settlement) || {});

  return (
    <StyledTableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell></StyledTableCell> {/* Empty header for row labels */}
            {settlements.map((_, index) => (
              <StyledTableCell key={index} align="center">
                {`Settlement ${index + 1}`}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map((key) => (
            <TableRow key={key}>
              <StyledTableCell>{key.replace(/_/g, " ")}</StyledTableCell>
              {settlements.map((settlement, index) => (
                <StyledTableCell key={index} align="center">
                  {settlement ? settlement[key] : "-"}
                </StyledTableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}
