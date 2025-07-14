import React from "react";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";
import { Colors } from "../config/default";
import { Typography, Box, IconButton, Tooltip } from "@mui/material";
import {} from "@mui/material";

import { formatDollarAmount } from "../common";
import { useToast } from "../toast/toastContext";
import Prompt from "./prompt";
import { SendPayment } from "../services/services";
import { useSelector } from "react-redux";
import { Paid } from "@mui/icons-material";
import MuiModels from "././models";
import RetryPayments from "./caseDetail/retryPayments";

function TransactionRow({
  debtor,
  data,
  heading,
  GetCasePaymentDetails,
  getCommissionPayments,
  hideTransferPayment,
  caseData,
  GetCaseDetails,
  getPaymentPlan,
  accountsResponse,
}) {
  const generalPermissions = useSelector(
    (state) => state?.permissions?.permissions?.generalPermissions
  );
  const { id } = useParams();
  const { showToast } = useToast();

  const formatDate = (dateString) => {
    return dateString?.split("T")[0];
  };

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

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
    fontSize: "11px",
    fontFamily: "Nunito",
    fontWeight: "500",
    width: debtor ? "12%" : "10%",
    margin: "0px 0px",
  };

  const typographyStyleUpcoming = {
    fontSize: "13px",
    fontFamily: "Nunito",
    fontWeight: "500",
    width: "10%",
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
            m: "1rem 0px",
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
              borderBottom: `1px solid #D3D3D3`,
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
              ) : debtor ? (
                item?.fullName
              ) : (
                item?.creditorName
              )}
            </p>
            <p style={typographyStyle}>{item?.transactionType || "-"}</p>
            <p style={typographyStyle}>{item?.paymentGateway || "-"}</p>
            {!debtor && (
              <p style={typographyStyle}>
                {item?.type === "capture" &&
                item?.captured === "Success" &&
                !hideTransferPayment ? (
                  <Box sx={{ cursor: "pointer" }}>
                    <Tooltip
                      title={item?.status || "No status available"}
                      arrow
                    >
                      <span>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            sendPaymentCreditor(item?.id);
                          }}
                          disabled={item?.status === "Success"}
                          sx={{
                            cursor:
                              item?.status === "Success"
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          <Paid
                            sx={{
                              color:
                                item?.status === "Success"
                                  ? "gray"
                                  : Colors.SKY_BLUE,
                            }}
                          />
                        </IconButton>
                      </span>
                    </Tooltip>
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
            )}
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
                    <>
                      <RetryPayments
                        accountsResponse={accountsResponse}
                        item={item}
                        GetCasePaymentDetails={GetCasePaymentDetails}
                        getCommissionPayments={getCommissionPayments}
                      />
                    </>
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

            {heading === "Upcoming" ? (
              <p style={{ ...typographyStyle, display: "flex" }}>
                <MuiModels
                  show="editPayment"
                  width="30vw"
                  data={item}
                  caseData={caseData}
                  GetCasePaymentDetails={GetCasePaymentDetails}
                  getPaymentPlan={getPaymentPlan}
                />
                <MuiModels
                  show="deletePayment"
                  button="delete"
                  width="30vw"
                  transactionId={item?.id}
                  GetCasePaymentDetails={GetCasePaymentDetails}
                  getPaymentPlan={getPaymentPlan}
                />
              </p>
            ) : (
              "-"
            )}
          </div>
        );
      })}
    </>
  );
}

export default TransactionRow;
