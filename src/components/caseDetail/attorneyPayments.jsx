import { Close, ArrowLeft, ArrowRight } from "@mui/icons-material";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { GetCaseAttorneyPayments } from "../../services/services";
import ScrollbarStyles from "../customScroll";
import { formatAsDollarOnTable } from "../../common";

function AttorneyPayments({ handleClose, caseId }) {
  const [attorneyPayments, setGetAttorneyPayments] = useState({
    payments: [],
    paymentsUpcoming: [],
  });
  const [currentPaymentPage, setCurrentPaymentPage] = useState(1);
  const [totalPaymentPage, setTotalPaymentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const getAttorneyPayments = async (page) => {
    setLoading(true);
    const casePayment = await GetCaseAttorneyPayments(caseId, page);

    if (casePayment?.status === 200) {
      const data = casePayment?.data?.data || {};

      const previousCount = data?.paymentsCount || 0;
      const upcomingCount = data?.paymentsUpcomingCount || 0;

      const totalPreviousPage = Math.ceil(previousCount / 10) || 0;
      const totalUpcomingPage = Math.ceil(upcomingCount / 10) || 0;

      const maxPages = Math.max(totalPreviousPage, totalUpcomingPage);
      setTotalPaymentPage(maxPages > 0 ? maxPages : 1);

      setGetAttorneyPayments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAttorneyPayments(currentPaymentPage);
  }, [currentPaymentPage]);

  const getColor = (status) => {
    if (status === "Success") return "#7353F0";
    if (status === "Failed") return "#EA6A47";
    return "black";
  };

  const renderTableHead = () => (
    <TableHead>
      <TableRow>
        {[
          "Creditor",
          "Debtor",
          "Amount",
          "Due Date",
          "Authorized",
          "Captured",
          "Status",
        ].map((header) => (
          <TableCell key={header} sx={{ fontWeight: 600 }}>
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const renderTable = (title, data) => (
    <>
      <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 700 }}>
        {title}
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 173,
          overflowY: "auto",
          ...ScrollbarStyles,
        }}
      >
        <Table size="small" stickyHeader>
          {renderTableHead()}
          <TableBody>
            {data?.length > 0 ? (
              data.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{payment?.creditorName || "-"}</TableCell>
                  <TableCell>{payment?.debtorName || "-"}</TableCell>
                  <TableCell>
                    {formatAsDollarOnTable(payment?.amount || "-")}
                  </TableCell>
                  <TableCell>
                    {new Date(payment?.dueDate).toLocaleDateString() || "-"}
                  </TableCell>
                  <TableCell>{payment?.authorized || "-"}</TableCell>
                  <TableCell>{payment?.captured || "-"}</TableCell>
                  <TableCell sx={{ color: getColor(payment?.sendViaPaynote) }}>
                    {payment?.sendViaPaynote || "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No payments to display
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  const renderPagination = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        mt: 2,
      }}
    >
      <Typography sx={{ fontFamily: "Nunito", mr: 1 }}>
        {currentPaymentPage} of {totalPaymentPage || 1}
      </Typography>
      <IconButton
        onClick={() => setCurrentPaymentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPaymentPage === 1}
      >
        <ArrowLeft />
      </IconButton>
      <IconButton
        onClick={() =>
          setCurrentPaymentPage((prev) => Math.min(totalPaymentPage, prev + 1))
        }
        disabled={currentPaymentPage >= totalPaymentPage}
      >
        <ArrowRight />
      </IconButton>
    </Box>
  );

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        onClick={handleClose}
        sx={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "right",
          mb: 2,
        }}
      >
        <Close />
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {renderTable("Success Payments", attorneyPayments?.payments || [])}
          {renderTable(
            "Upcoming Payments",
            attorneyPayments?.paymentsUpcoming || []
          )}
          {renderPagination()}
        </>
      )}
    </Box>
  );
}

export default AttorneyPayments;
