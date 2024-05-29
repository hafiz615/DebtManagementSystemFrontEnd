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

import { Colors } from "../../config/default";
import { isEmpty } from "lodash";

export default function TransactionAccordion({ paymentDetails, loading }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };
  return (
    <Accordion
      sx={{
        boxShadow: "none",
        marginBottom: "10px",
        backgroundColor: Colors.BG_LIGHT_GRAY,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: Colors.WHITE }} />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          height: "20px",
          backgroundColor: Colors.SKY_BLUE,
          borderRadius: "10px",
        }}
      >
        <Typography sx={{ color: Colors.WHITE, fontFamily: "Nunito" }}>
          Transactions
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: Colors.BG_LIGHT_GRAY,
          boxShadow: " 0 2px 5px -3px rgba(0, 0, 0, 0.5)",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      >
        {loading || isEmpty(paymentDetails) ? (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "90vh",
            }}
          >
            <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
          </Grid>
        ) : (
          <>
            {!isEmpty(paymentDetails?.transactions?.successAuthorizations) && (
              <strong>Success Authorization</strong>
            )}
            {paymentDetails?.transactions?.successAuthorizations?.map(
              (item, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        fontFamily: "Nunito",
                        color: Colors.DIM_LIGHT_GRAY,
                      }}
                    >
                      {formatDate(item?.dueDate)}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: Colors.DIM_LIGHT_GRAY,
                        fontFamily: "Nunito",
                      }}
                    >
                      {item?.totalDebt}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: Colors.DIM_LIGHT_GRAY,
                        fontFamily: "Nunito",
                      }}
                    >
                      {item?.status}
                    </p>
                  </div>
                );
              }
            )}
            {!isEmpty(paymentDetails?.transactions?.failedAuthorizations) && (
              <strong>Failed Authorization</strong>
            )}
            {paymentDetails?.transactions?.failedAuthorizations?.map(
              (item, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        fontFamily: "Nunito",
                        color: Colors.DIM_LIGHT_GRAY,
                      }}
                    >
                      {formatDate(item?.dueDate)}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: Colors.DIM_LIGHT_GRAY,
                        fontFamily: "Nunito",
                      }}
                    >
                      {item?.totalDebt}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: Colors.DIM_LIGHT_GRAY,
                        fontFamily: "Nunito",
                      }}
                    >
                      {item?.status}
                    </p>
                  </div>
                );
              }
            )}
            {!isEmpty(paymentDetails?.transactions?.failedPayments) && (
              <strong>Failed Payments</strong>
            )}
            {paymentDetails?.transactions?.failedPayments?.map(
              (item, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        fontFamily: "Nunito",
                        color: Colors.DIM_LIGHT_GRAY,
                      }}
                    >
                      {formatDate(item?.dueDate)}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: Colors.DIM_LIGHT_GRAY,
                        fontFamily: "Nunito",
                      }}
                    >
                      {item?.totalDebt}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: Colors.DIM_LIGHT_GRAY,
                        fontFamily: "Nunito",
                      }}
                    >
                      {item?.status}
                    </p>
                  </div>
                );
              }
            )}
            {!isEmpty(paymentDetails?.transactions?.successPayments) && (
              <strong>Success Payments</strong>
            )}
            {paymentDetails?.transactions?.successPayments?.map(
              (item, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        fontFamily: "Nunito",
                        color: Colors.DIM_LIGHT_GRAY,
                      }}
                    >
                      {formatDate(item?.dueDate)}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: Colors.DIM_LIGHT_GRAY,
                        fontFamily: "Nunito",
                      }}
                    >
                      {item?.totalDebt}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: Colors.DIM_LIGHT_GRAY,
                        fontFamily: "Nunito",
                      }}
                    >
                      {item?.status}
                    </p>
                  </div>
                );
              }
            )}
            {!isEmpty(paymentDetails?.transactions?.upcomingPayments) && (
              <strong>Upcoming</strong>
            )}
            {paymentDetails?.transactions?.upcomingPayments?.map(
              (item, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        fontFamily: "Nunito",
                        color: Colors.DIM_LIGHT_GRAY,
                      }}
                    >
                      {formatDate(item?.dueDate)}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: Colors.DIM_LIGHT_GRAY,
                        fontFamily: "Nunito",
                      }}
                    >
                      {item?.totalDebt}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: Colors.DIM_LIGHT_GRAY,
                        fontFamily: "Nunito",
                      }}
                    >
                      {item?.status}
                    </p>
                  </div>
                );
              }
            )}
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
