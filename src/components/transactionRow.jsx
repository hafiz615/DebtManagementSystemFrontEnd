import React, { useState } from "react";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";
import { Colors } from "../config/default";
import { Typography, Box, IconButton, Checkbox } from "@mui/material";
import { formatDollarAmount } from "../common";
import { useToast } from "../toast/toastContext";
import Prompt from "./prompt";
import { RetryAuth, RetryCapture, SendPayment } from "../services/services";
import { useSelector } from "react-redux";
import { Paid } from "@mui/icons-material";

function TransactionRow({
  data,
  heading,
  GetCasePaymentDetails,
  getCommissionPayments,
  hideTransferPayment,
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
    } else if (item?.type === "payment" && item?.captured === "Failed") {
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
    width: "25%",
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
            m: "10px 0px",
          }}
        >
          {heading}
        </Typography>
      )}
      {data?.map((item, index) => {
        const colorScheme =
          item?.type === "authorization" && item?.authorized === "Failed"
            ? Colors.ORANGE_COLOR
            : item?.type === "payment" && item?.captured === "Failed"
            ? Colors.ORANGE_COLOR
            : Colors.SKY_BLUE;

        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              height: "15%",
              width: "100%",
              justifyContent: "space-between",
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
                : item?.type === "payment"
                ? "Capture"
                : capitalizeFirstLetter(item?.type) || "-"}
            </p>

            <p style={typographyStyle}>
              {(item?.type === "authorization" &&
                item?.authorized === "Failed") ||
              (item?.type === "payment" && item?.captured === "Failed") ? (
                <Box sx={{ cursor: "pointer" }}>
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
              ) : item?.type === "payment" &&
                item?.captured === "Success" &&
                !hideTransferPayment ? (
                <Box sx={{ cursor: "pointer" }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      sendPaymentCreditor(item?.id);
                    }}
                  >
                    <Paid sx={{ color: Colors.SKY_BLUE }} />
                  </IconButton>
                </Box>
              ) : null}
            </p>
          </div>
        );
      })}
    </>
  );
}

export default TransactionRow;
