import React from "react";

import {
  Grid,
  CircularProgress,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TransactionRow from "../transactionRow";

import { Colors } from "../../config/default";
import { isEmpty } from "lodash";
import ScrollbarStyles from "./../customScroll";

export default function TransactionAccordion({
  paymentDetails,
  loading,
  GetCasePaymentDetails,
}) {
  return (
    <Accordion
      sx={{
        height: "auto",
        marginBottom: "1rem",
        boxShadow: "none",
        // marginBottom: "10px",
        borderRadius: "1rem !important",
        backgroundColor: Colors.WHITE,
      }}
      defaultExpanded
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: Colors.WHITE }} />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          height: "20px",
          backgroundColor: Colors.SKY_BLUE,
          borderRadius: "1rem",
        }}
      >
        <Typography
          sx={{
            color: Colors.WHITE,
            fontFamily: "Nunito",
            fontWeight: "700",
          }}
        >
          TRANSACTIONS
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          height: "35vh",
          backgroundColor: Colors.WHITE,
          boxShadow: " 0 2px 5px -3px rgba(0, 0, 0, 0.5)",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      >
        {loading || isEmpty(paymentDetails) ? (
          <Grid
            container
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "35vh",
            }}
          >
            <CircularProgress size={60} sx={{ color: Colors.SKY_BLUE }} />
          </Grid>
        ) : (
          <Grid
            container
            item
            xs={12}
            sx={{ overflow: "auto", ...ScrollbarStyles }}
          >
            <TransactionRow
              data={paymentDetails?.transactions?.previous}
              GetCasePaymentDetails={GetCasePaymentDetails}
            />
            <TransactionRow
              data={paymentDetails?.transactions?.upcomingPayments}
              heading="Upcoming"
              GetCasePaymentDetails={GetCasePaymentDetails}
            />
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
