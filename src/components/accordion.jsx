import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isEqual } from "lodash";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { ExpandMore, Launch } from "@mui/icons-material";
import { Grid, Typography, Box } from "@mui/material";
import { formatDollarAmount } from "../common";

import { Colors } from "../config/default";

import ListTable from "./listTable";
import {
  FONT_SIZE_MEDIUM,
  FONT_SIZE_SMALL,
  FONT_SIZE_XL,
} from "../constants/appConstants";

const headers = [
  "Name",
  "Due Date",
  "Amount",
  "Payment Type",
  "Failure Reason",
];

export default function AccordionUsage({
  tableHeading,
  arrayName,
  paymentNumber,
  index,
  rowArray,
  showFailureReason,
  showDueDate,
  totalPages,
  currentPage,
  setCurrentPage,
  totalData,
  getHomeData,
  paginationRows,
  setPaginationRows,
  successFulPaymentTrue,
}) {
  const generalPermissions = useSelector(
    (state) => state?.permissions?.permissions?.generalPermissions
  );
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const generatedData = rowArray?.map((item, index) => ({
      caseId: item?.caseId || item?.debtorId,
      id: item?._id,
      name:
        arrayName === "successPayments" ||
        arrayName === "creditorUpcomingPayments"
          ? item?.creditorName
          : item?.debtorName || "-",
      dueDate: new Date(item?.dueDate).toLocaleDateString() || "-",
      amount: formatDollarAmount(item?.amount),
      transactionType: item?.transactionType || "-",
      failureReason:
        arrayName === "failedAuthorizations"
          ? item?.failedReasonAuthorization || "-"
          : item?.failedReasonCaptured || "-",
    }));

    if (!isEqual(generatedData, rowArray)) {
      setRows(generatedData);
    }
  }, [rowArray]);
  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(0),
  }));
  const [expanded, setExpanded] = React.useState([0, 3]);

  const handleChange = (index) => {
    setExpanded((prevExpanded) =>
      prevExpanded.includes(index)
        ? prevExpanded.filter((i) => i !== index)
        : [...prevExpanded, index]
    );
  };
  let backgroundColor;
  if (paymentNumber === "5") {
    backgroundColor = Colors.ORANGE_COLOR; // Reddish color
  } else if (paymentNumber === "4") {
    backgroundColor = Colors.SKY_BLUE; // Bluish color
  } else {
    backgroundColor = "#7E909A"; // Grayish color
  }

  const navigate = useNavigate();

  const handleRowClick = (id) => {
    localStorage.setItem("route", "all-cases");
    navigate(`/all-cases/${id}`);
  };

  const handleDebtorRowClick = (id) => {
    localStorage.setItem("route", "list-details");
    navigate(`/client/list-details/${id}`);
  };

  return (
    <Accordion
      defaultExpanded={index < 1}
      onChange={() => handleChange(index)}
      sx={{
        borderRadius: "1rem !important",
        backgroundColor: Colors.WHITE,
        width: { xs: "65vw", sm: "100%" },
      }}
    >
      <AccordionSummary
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
        expandIcon={<ExpandMore />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <Grid item xs={6}>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                color: Colors.BLACK,
                marginLeft: "0.5rem",
                fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_XL },
              }}
            >
              {tableHeading}
            </Typography>
          </Grid>

          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                backgroundColor,
                borderRadius: "50%",
                height: { xs: "1.5rem", sm: "2.5rem" },
                width: { xs: "1.5rem", sm: "2.5rem" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "0.5rem",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: { xs: FONT_SIZE_MEDIUM, sm: "1rem" },
                  fontFamily: "Nunito",
                  color: Colors.WHITE,
                }}
              >
                {totalData === undefined ? "0" : totalData}
              </Typography>
            </Box>
            {generalPermissions?.viewPaymentsAndAuthorizations && (
              <Launch
                sx={{
                  color: Colors.DIM_LIGHT_GRAY,
                  marginLeft: "0.5rem",
                  marginRight: "0.5rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  localStorage.setItem("route", "authorization-details");
                  navigate("/authorization-details");
                }}
              />
            )}
          </Grid>
        </Grid>
      </AccordionSummary>

      <AccordionDetails>
        <ListTable
          onPaymentRowClick={
            successFulPaymentTrue ? handleRowClick : handleDebtorRowClick
          }
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          apiPagination={true}
          data={rows}
          headerData={headers}
          showFailureReason={showFailureReason}
          showDueDate={showDueDate}
          arrayName={arrayName}
          getHomeData={getHomeData}
          accordionHeight="40vh"
          paginationRows={paginationRows}
          setPaginationRows={setPaginationRows}
        />
      </AccordionDetails>
    </Accordion>
  );
}
