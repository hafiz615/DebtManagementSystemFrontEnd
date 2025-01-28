import React, { useState } from "react";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";
import { Colors } from "../config/default";
import { Typography, Box, IconButton, Checkbox, Tooltip } from "@mui/material";
import { formatDollarAmount } from "../common";
import { useToast } from "../toast/toastContext";
import Prompt from "./prompt";
import { RetryAuth, RetryCapture, SendPayment } from "../services/services";
import { useSelector } from "react-redux";
import { Paid } from "@mui/icons-material";
import MuiModels from "././models";

function TransactionRow({
  data,
  heading,
  GetCasePaymentDetails,
  getCommissionPayments,
  hideTransferPayment,
  caseData,
  GetCaseDetails,
}) {
  const generalPermissions = useSelector(
    (state) => state?.permissions?.permissions?.generalPermissions
  );
  const { id } = useParams();
  const { showToast } = useToast();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleRetry = async (item) => {
    let response;
    if (item?.type === "authorization" && item?.authorized === "Failed") {
      response = await RetryAuth(item?.id);
    } else if (item?.type === "capture" && item?.captured === "Failed") {
      response = await RetryCapture(item?.id);
    }
    if (response?.status === 200) {
      showToast(response?.data?.message, "success");
      GetCasePaymentDetails && GetCasePaymentDetails(id);
      getCommissionPayments && getCommissionPayments();
    } else {
      showToast(
        response?.response?.data?.message || response?.response?.data?.message,
        "error"
      );
    }
  };

  const sendPaymentCreditor = async (id) => {
    const sendPaymentRes = await SendPayment(id);
    if (sendPaymentRes?.status === 200) {
      showToast(sendPaymentRes?.data?.message, "success");
    } else {
      const errorMessage = sendPaymentRes?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  const typographyStyle = {
    fontSize: "13px",
    fontFamily: "Nunito",
    fontWeight: "500",
    width: "20%",
    margin: "0px 0px",
  };
  const typographyStyleUpcoming = {
    fontSize: "13px",
    fontFamily: "Nunito",
    fontWeight: "500",
    width: "20%",
    margin: "5px 0px",
  };

  return (
    <>
      {!isEmpty(data) && heading && (
        <Typography
          sx={{
            color: Colors.BLACK,
            fontWeight: "600",
            fontSize: "13px",
            fontFamily: "Nunito",
            m: "0px 0px",
          }}
        >
          {heading}
        </Typography>
      )}

      {data?.map((item, index) => {
        const colorScheme =
          item?.type === "authorization" && item?.authorized === "Failed"
            ? Colors.ORANGE_COLOR
            : item?.type === "capture" && item?.captured === "Failed"
            ? Colors.ORANGE_COLOR
            : Colors.SKY_BLUE;

        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              color: heading ? Colors.BLACK : colorScheme,
            }}
          >
            <p style={typographyStyle}>{formatDate(item?.dueDate) || "-"}</p>
            <p style={typographyStyle}>
              {formatDollarAmount(item?.amount) || "-"}
            </p>
            <p style={typographyStyle}>
              {heading
                ? item?.status || "-"
                : item?.type === "authorization"
                ? item?.authorized === "Failed"
                  ? "Authorization Failed"
                  : "Authorized"
                : item?.type === "capture"
                ? item?.captured === "Failed"
                  ? "Capture Failed"
                  : "Captured"
                : item?.type === "payment"
                ? "Capture"
                : capitalizeFirstLetter(item?.type) || "-"}
            </p>
            <p style={typographyStyle}>
              {item?.creditorName?.length > 15 ? (
                <Tooltip title={item?.creditorName} placement="top">
                  <span>{item?.creditorName?.slice(0, 15)}...</span>
                </Tooltip>
              ) : (
                item?.creditorName || "-"
              )}
            </p>
            <p style={typographyStyle}>{item?.transactionType || "-"}</p>
            <p style={typographyStyle}>{item?.paymentGateway || "-"}</p>
            <p style={typographyStyle}>
              {item?.type === "capture" &&
              item?.captured === "Success" &&
              !hideTransferPayment ? (
                <Box sx={{ cursor: "pointer" }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      sendPaymentCreditor(item?.id);
                    }}
                  >
                    <Paid
                      sx={{
                        color: Colors.SKY_BLUE,
                      }}
                    />
                  </IconButton>
                </Box>
              ) : (
                <p
                  style={{
                    paddingLeft: "1rem",
                    fontSize: "13px",
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "20%",
                    margin: "0px 0px",
                  }}
                >
                  -
                </p>
              )}
            </p>
            <p style={typographyStyle}>
              {(item?.type === "authorization" &&
                item?.authorized === "Failed") ||
              (item?.type === "capture" && item?.captured === "Failed") ? (
                <Box
                  sx={{
                    cursor: "pointer",
                    fontSize: "13px",
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "20%",
                    margin: "0px 0px",
                  }}
                >
                  {generalPermissions?.retryPayment && (
                    <Prompt
                      heading="Retry"
                      text={`Are you sure you want to Retry?`}
                      handleRetry={handleRetry}
                      item={item}
                      show={true}
                    />
                  )}
                </Box>
              ) : (
                <p
                  style={{
                    paddingLeft: "1rem",
                    fontSize: "13px",
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "20%",
                    margin: "0px 0px",
                  }}
                >
                  -
                </p>
              )}
            </p>

            <p style={typographyStyleUpcoming}>
              {heading !== "Upcoming" ? (
                <MuiModels
                  show="getTransactionDetails"
                  transactionId={item?.transactionId}
                  height="40vh"
                  caseData={caseData}
                  GetCaseDetails={GetCaseDetails}
                />
              ) : (
                <p
                  style={{
                    paddingLeft: ".5rem",
                    fontSize: "13px",
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "20%",
                    margin: "0px 0px",
                  }}
                >
                  -
                </p>
              )}
            </p>
          </div>
        );
      })}
    </>
  );
}

export default TransactionRow;
