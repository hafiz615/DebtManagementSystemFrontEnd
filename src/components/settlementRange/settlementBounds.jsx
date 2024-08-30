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
  return (
    <StyledTableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell align="center">Settlement 1</StyledTableCell>
            <StyledTableCell align="center">Settlement 2</StyledTableCell>
            <StyledTableCell align="center">Settlement 3</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <StyledTableCell>Lower Bound</StyledTableCell>
            <StyledTableCell align="center">
              $
              {data?.settlement_range_1?.weekly_payment_range?.[0] ||
                data?.settlement_range_1?.lower_bound}
            </StyledTableCell>
            <StyledTableCell align="center">
              $
              {data?.settlement_range_2?.weekly_payment_range?.[0] ||
                data?.settlement_range_2?.lower_bound}
            </StyledTableCell>
            <StyledTableCell align="center">
              $
              {data?.settlement_range_3?.weekly_payment_range?.[0] ||
                data?.settlement_range_3?.lower_bound}
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Weeks to Pay off Lower</StyledTableCell>
            <StyledTableCell align="center">
              {data?.settlement_range_1?.weeks_to_pay_off_lower_bound ||
                data?.settlement_range_1?.weeks_to_payoff_lower_bound}
            </StyledTableCell>
            <StyledTableCell align="center">
              {data?.settlement_range_2?.weeks_to_pay_off_lower_bound ||
                data?.settlement_range_2?.weeks_to_payoff_lower_bound}
            </StyledTableCell>
            <StyledTableCell align="center">
              {data?.settlement_range_3?.weeks_to_pay_off_lower_bound ||
                data?.settlement_range_3?.weeks_to_payoff_lower_bound}
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Upper Bound</StyledTableCell>
            <StyledTableCell align="center">
              $
              {data?.settlement_range_1?.weekly_payment_range?.[1] ||
                data?.settlement_range_1?.upper_bound}
            </StyledTableCell>
            <StyledTableCell align="center">
              $
              {data?.settlement_range_2?.weekly_payment_range?.[1] ||
                data?.settlement_range_2?.upper_bound}
            </StyledTableCell>
            <StyledTableCell align="center">
              $
              {data?.settlement_range_3?.weekly_payment_range?.[1] ||
                data?.settlement_range_3?.upper_bound}
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Weeks to Pay off Upper</StyledTableCell>
            <StyledTableCell align="center">
              {data?.settlement_range_1?.weeks_to_pay_off_upper_bound ||
                data?.settlement_range_1?.weeks_to_payoff_upper_bound}
            </StyledTableCell>
            <StyledTableCell align="center">
              {data?.settlement_range_2?.weeks_to_pay_off_upper_bound ||
                data?.settlement_range_2?.weeks_to_payoff_upper_bound}
            </StyledTableCell>
            <StyledTableCell align="center">
              {data?.settlement_range_3?.weeks_to_pay_off_upper_bound ||
                data?.settlement_range_3?.weeks_to_payoff_upper_bound}
            </StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}
