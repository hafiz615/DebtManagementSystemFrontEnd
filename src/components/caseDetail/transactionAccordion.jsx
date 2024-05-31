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
          backgroundColor: Colors.WHITE,
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
              <Typography
                sx={{
                  color: Colors.BLACK,
                  fontWeight: "700",
                  fontFamily: "Nunito",
                }}
              >
                Success Authorization
              </Typography>
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
                        color: Colors.SKY_BLUE,
                        fontWeight: "500",
                      }}
                    >
                      {formatDate(item?.dueDate)}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        fontFamily: "Nunito",
                        color: Colors.SKY_BLUE,
                        fontWeight: "500",
                      }}
                    >
                      {item?.totalDebt}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        fontFamily: "Nunito",
                        color: Colors.SKY_BLUE,
                        fontWeight: "500",
                      }}
                    >
                      {item?.status}
                    </p>
                  </div>
                );
              }
            )}
            {!isEmpty(paymentDetails?.transactions?.failedAuthorizations) && (
              <Typography
                sx={{
                  color: Colors.BLACK,
                  fontWeight: "700",
                  fontFamily: "Nunito",
                }}
              >
                Failed Authorization
              </Typography>
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
                        color: Colors.ORANGE_COLOR,
                        fontWeight: "500",
                      }}
                    >
                      {formatDate(item?.dueDate)}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        fontFamily: "Nunito",
                        color: Colors.ORANGE_COLOR,
                        fontWeight: "500",
                      }}
                    >
                      {item?.totalDebt}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        fontFamily: "Nunito",
                        color: Colors.ORANGE_COLOR,
                        fontWeight: "500",
                      }}
                    >
                      {item?.status}
                    </p>
                  </div>
                );
              }
            )}
            {!isEmpty(paymentDetails?.transactions?.failedPayments) && (
              <Typography
                sx={{
                  color: Colors.BLACK,
                  fontWeight: "700",
                  fontFamily: "Nunito",
                }}
              >
                Failed Payments
              </Typography>
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
                        color: Colors.ORANGE_COLOR,
                        fontWeight: "500",
                      }}
                    >
                      {formatDate(item?.dueDate)}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        fontFamily: "Nunito",
                        color: Colors.ORANGE_COLOR,
                        fontWeight: "500",
                      }}
                    >
                      {item?.totalDebt}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        fontFamily: "Nunito",
                        color: Colors.ORANGE_COLOR,
                        fontWeight: "500",
                      }}
                    >
                      {item?.status}
                    </p>
                  </div>
                );
              }
            )}
            {!isEmpty(paymentDetails?.transactions?.successPayments) && (
              <Typography
                sx={{
                  color: Colors.BLACK,
                  fontWeight: "700",
                  fontFamily: "Nunito",
                }}
              >
                Success Payments
              </Typography>
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
                        color: Colors.SKY_BLUE,
                        fontWeight: "500",
                      }}
                    >
                      {formatDate(item?.dueDate)}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        fontFamily: "Nunito",
                        color: Colors.SKY_BLUE,
                        fontWeight: "500",
                      }}
                    >
                      {item?.totalDebt}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        fontFamily: "Nunito",
                        color: Colors.SKY_BLUE,
                        fontWeight: "500",
                      }}
                    >
                      {item?.status}
                    </p>
                  </div>
                );
              }
            )}
            {!isEmpty(paymentDetails?.transactions?.upcomingPayments) && (
              <Typography
                sx={{
                  color: Colors.BLACK,
                  fontWeight: "700",
                  fontFamily: "Nunito",
                }}
              >
                Upcoming
              </Typography>
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
                        color: Colors.DARK_GRAY,
                        fontWeight: "500",
                      }}
                    >
                      {formatDate(item?.dueDate)}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: Colors.DARK_GRAY,
                        fontFamily: "Nunito",
                        fontWeight: "500",
                      }}
                    >
                      {item?.totalDebt}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: Colors.DARK_GRAY,
                        fontFamily: "Nunito",
                        fontWeight: "500",
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
