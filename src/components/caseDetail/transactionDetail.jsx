import React from "react";

import { Grid, CircularProgress, Typography, IconButton } from "@mui/material";
import TransactionRow from "../transactionRow";

import { Colors } from "../../config/default";
import { isEmpty } from "lodash";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";

const typographyHeadingStyle = {
  fontSize: "13px",
  fontFamily: "Nunito",
  fontWeight: "600",
  width: "20%",
  margin: "5px 0px",
};
export default function TransactionDetails({
  paymentDetails,
  loading,
  GetCasePaymentDetails,
  getCommissionPayments,
  hideTransferPayment,
  caseData,
  GetCaseDetails,
  currentPaymentPage,
  setCurrentPaymentPage,
  totalPaymentPage,
}) {
  return (
    <Grid
      item
      xs={12}
      sx={{
        backgroundColor: Colors.WHITE,
        borderRadius: "10px",
        padding: "0px 10px",
        height: "14rem",
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: `1px solid ${Colors.BLACK}`,
              width: "100%",
              marginBottom: "10px",
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              zIndex: 1,
            }}
          >
            <p style={typographyHeadingStyle}>Date</p>
            <p style={typographyHeadingStyle}>Amount</p>
            <p style={typographyHeadingStyle}>Payment Status</p>
            <p style={typographyHeadingStyle}>Creditor Name</p>
            <p style={typographyHeadingStyle}>Payment Type</p>
            <p style={typographyHeadingStyle}>Payment Gateway</p>
            <p style={typographyHeadingStyle}>Send Payment</p>
            <p style={typographyHeadingStyle}>Retry Transaction</p>
            <p style={typographyHeadingStyle}>Revert Transactions</p>
          </div>
          <Grid container item xs={12}>
            <TransactionRow
              data={paymentDetails?.transactions?.previous}
              GetCasePaymentDetails={GetCasePaymentDetails}
              getCommissionPayments={getCommissionPayments}
              hideTransferPayment={hideTransferPayment}
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
            />
            <TransactionRow
              data={paymentDetails?.transactions?.upcomingPayments}
              heading="Upcoming"
              GetCasePaymentDetails={GetCasePaymentDetails}
              getCommissionPayments={getCommissionPayments}
              hideTransferPayment={hideTransferPayment}
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
            />
          </Grid>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              bottom: -8,
              right: 10,
            }}
          >
            <Typography
              sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
            >
              {totalPaymentPage === 0 ? 0 : currentPaymentPage} of{" "}
              {totalPaymentPage}
            </Typography>
            <IconButton
              onClick={() => setCurrentPaymentPage(currentPaymentPage - 1)}
              disabled={currentPaymentPage === 1}
            >
              <ArrowLeft />
            </IconButton>

            <IconButton
              onClick={() => setCurrentPaymentPage(currentPaymentPage + 1)}
              disabled={
                totalPaymentPage === 0 ||
                currentPaymentPage === totalPaymentPage
              }
            >
              <ArrowRight />
            </IconButton>
          </div>
        </Grid>
      )}
    </Grid>
  );
}
