import React from "react";

import { Grid, CircularProgress, Typography } from "@mui/material";
import TransactionRow from "../transactionRow";

import { Colors } from "../../config/default";
import { isEmpty } from "lodash";

export default function TransactionDetails({
  paymentDetails,
  loading,
  GetCasePaymentDetails,
  getCommissionPayments,
  hideTransferPayment,
}) {
  return (
    <Grid
      item
      xs={12}
      sx={{
        backgroundColor: Colors.WHITE,
        borderRadius: "10px",
        padding: "0px 10px",
        height: "13rem",
        marginBottom: "0.5rem",
      }}
    >
      <p
        style={{
          fontWeight: "600",
          fontSize: "13px",
          fontFamily: "Nunito",
        }}
      >
        Transactions
      </p>
      {loading ? (
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "13rem",
          }}
        >
          <CircularProgress size={60} sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : isEmpty(paymentDetails) ? (
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "8rem",
          }}
        >
          <Typography
            sx={{
              color: Colors.GRAY,
              fontFamily: "Nunito",
              fontSize: "13px",
            }}
          >
            No transactions data
          </Typography>
        </Grid>
      ) : (
        <Grid
          sx={{
            height: "10rem",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#E5E5E5",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: Colors.WHITE,
              borderRadius: "8px",
              marginTop: ".5rem",
              marginBottom: ".5rem",
            },
          }}
        >
          <Grid container item xs={12}>
            <TransactionRow
              data={paymentDetails?.transactions?.previous}
              GetCasePaymentDetails={GetCasePaymentDetails}
              getCommissionPayments={getCommissionPayments}
              hideTransferPayment={hideTransferPayment}
            />
            <TransactionRow
              data={paymentDetails?.transactions?.upcomingPayments}
              heading="Upcoming"
              GetCasePaymentDetails={GetCasePaymentDetails}
              getCommissionPayments={getCommissionPayments}
              hideTransferPayment={hideTransferPayment}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
