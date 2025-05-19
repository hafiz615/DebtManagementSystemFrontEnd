import React from "react";

import { Grid, CircularProgress, Typography, IconButton } from "@mui/material";
import TransactionRow from "../transactionRow";

import { Colors } from "../../config/default";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";

export default function TransactionDetails({
  debtor,
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
  getPaymentPlan,
}) {
  const typographyHeadingStyle = {
    fontSize: "12px",
    fontFamily: "Nunito",
    fontWeight: "600",
    width: "9.5%",
    margin: "5px 0px",
  };
  return (
    <Grid
      item
      xs={12}
      sx={{
        position: "relative",
        backgroundColor: Colors.WHITE,
        borderRadius: "10px",
        marginBottom: "0.5rem",
        height: "auto",
      }}
    >
      {loading ? (
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "10rem",
          }}
        >
          <CircularProgress size={40} sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : paymentDetails?.transactions?.previous?.length === 0 &&
        paymentDetails?.transactions?.upcomingPayments?.length === 0 ? (
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "10rem",
          }}
        >
          <Typography
            sx={{
              color: Colors.GRAY,
              fontFamily: "Nunito",
              fontSize: "13px",
            }}
          >
            Payment plan not available
          </Typography>
        </Grid>
      ) : (
        <Grid sx={{ pb: "3rem", px: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid ${Colors.BLACK}`,
              width: "100%",
              marginBottom: "10px",
              top: 0,
              backgroundColor: "white",
              zIndex: 1,
              overflow: "hidden",
            }}
          >
            <p style={typographyHeadingStyle}>Date</p>
            <p style={typographyHeadingStyle}>Amount</p>
            <p style={typographyHeadingStyle}>Status</p>
            <p style={typographyHeadingStyle}>
              {debtor ? "Client Name" : "Creditor Name"}
            </p>
            <p style={typographyHeadingStyle}>Type</p>
            <p style={typographyHeadingStyle}>Gateway</p>
            {!debtor && <p style={typographyHeadingStyle}>Send Payment</p>}
            <p style={typographyHeadingStyle}>Retry Transaction</p>
            <p style={typographyHeadingStyle}>Revert Transaction</p>
            <p style={typographyHeadingStyle}>Actions</p>
          </div>
          <Grid container item xs={12}>
            <TransactionRow
              debtor={debtor}
              data={paymentDetails?.transactions?.previous}
              GetCasePaymentDetails={GetCasePaymentDetails}
              getCommissionPayments={getCommissionPayments}
              hideTransferPayment={hideTransferPayment}
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
              getPaymentPlan={getPaymentPlan}
            />
            <TransactionRow
              debtor={debtor}
              data={paymentDetails?.transactions?.upcomingPayments}
              heading="Upcoming"
              GetCasePaymentDetails={GetCasePaymentDetails}
              getCommissionPayments={getCommissionPayments}
              hideTransferPayment={hideTransferPayment}
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
              getPaymentPlan={getPaymentPlan}
            />
          </Grid>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              bottom: 0,
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
