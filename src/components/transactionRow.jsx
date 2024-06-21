import React from "react";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";
import { Colors } from "../config/default";
import { Typography, Box } from "@mui/material";
import { formatDollarAmount } from "../common";
import { useToast } from "../toast/toastContext";
import Prompt from "./prompt";
import { RetryAuth, RetryCapture } from "../services/services";

function TransactionRow({ data, heading, GetCasePaymentDetails }) {
  const { id } = useParams();
  const { showToast } = useToast();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
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
      GetCasePaymentDetails(id);
    } else {
      showToast(
        response?.response?.data?.message || response?.response?.data?.message,
        "error"
      );
    }
  };

  const typographyStyle = {
    fontSize: "11px",
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
            fontWeight: "700",
            fontFamily: "Nunito",
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
              gap: "10px",
              alignItems: "center",

              color: heading ? Colors.BLACK : colorScheme,
            }}
          >
            <p style={typographyStyle}>{formatDate(item?.dueDate) || "-"}</p>
            <p style={typographyStyle}>
              {formatDollarAmount(item?.totalDebt) || "-"}
            </p>
            <p
              style={{
                display: "flex",
                fontSize: "11px",
                fontFamily: "Nunito",
                fontWeight: "500",
                width: "100px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {heading
                ? item?.status || "-"
                : capitalizeFirstLetter(item?.type) || "-"}
              {(item?.type === "authorization" &&
                item?.authorized === "Failed") ||
              (item?.type === "payment" && item?.captured === "Failed") ? (
                <Box sx={{ cursor: "pointer" }}>
                  <Prompt
                    heading="Retry"
                    text={`Are you sure you want to Retry?`}
                    handleRetry={handleRetry}
                    item={item}
                    show={true}
                  />
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
