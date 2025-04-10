import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Divider,
  CircularProgress,
  IconButton,
  Box,
} from "@mui/material";
import { Close, ExpandMore, ExpandLess } from "@mui/icons-material";
import {
  GetRelatedPayments,
  UpdateManualPayments,
} from "../../services/services";
import { useToast } from "../../toast/toastContext";
import { Colors } from "../../config/default";
import { isEmpty } from "lodash";
import { formatDollarAmount } from "../../common";
import ScrollbarStyles from "../customScroll";
import Button from "../button";

function GetTransactionDetails({
  handleClose,
  transactionId,
  caseData,
  GetCaseDetails,
}) {
  const { showToast } = useToast();
  const [relatedPayments, setRelatedPayments] = useState(null);
  const [loadingParentId, setLoadingParentId] = useState(null);
  const [relatedPaymentsLoading, setRelatedPaymentsLoading] = useState(false);
  const [expandedIndices, setExpandedIndices] = useState([]);

  // Fetch Related Payments
  const GetRelatedPaymentsDetails = async () => {
    setRelatedPaymentsLoading(true);
    const response = await GetRelatedPayments(transactionId);
    if (response?.status === 200) {
      setRelatedPayments(response?.data?.data);
    } else if (response?.response?.status === 400) {
      const errorMessage = response?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setRelatedPaymentsLoading(false);
  };

  // Fetch data when the component mounts
  useEffect(() => {
    GetRelatedPaymentsDetails();
  }, [transactionId]);

  // Toggle Expand/Collapse for Payment Details
  const toggleExpand = (index) => {
    setExpandedIndices((prev) =>
      prev?.includes(index)
        ? prev?.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleUpdateAll = async () => {
    setLoadingParentId(transactionId);
    const firstKey = Object.keys(relatedPayments)?.[0];
    const selectedPayment = relatedPayments?.[firstKey]?.[0];
    const params = {
      referenceId: transactionId || "-",
      commission: selectedPayment?.manualCommission || 0,
    };
    const UpdateManualPaymentsRes = await UpdateManualPayments(
      params,
      selectedPayment?.debtorId
    );

    if (UpdateManualPaymentsRes?.status === 200) {
      showToast(UpdateManualPaymentsRes?.data?.message, "success");
      GetCaseDetails(caseData._id);
      handleClose();
    } else if (UpdateManualPaymentsRes?.response?.status === 400) {
      const errorMessage = UpdateManualPaymentsRes?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoadingParentId(null);
  };

  const isDataEmpty = !relatedPayments || isEmpty(relatedPayments);

  return (
    <>
      <Box
        sx={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "end",
          marginBottom: "1rem",
        }}
      >
        <Close onClick={handleClose} />
      </Box>
      {relatedPaymentsLoading ? (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "25vh",
          }}
        >
          <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : isDataEmpty ? (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "25vh",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Nunito",
              color: Colors.BLACK,
              fontWeight: "600",
            }}
          >
            No Data Exist
          </Typography>
        </Grid>
      ) : (
        <>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontFamily: "Nunito", mb: "1rem", fontWeight: "600" }}
            >
              Revert Payments
            </Typography>
            <Close onClick={handleClose} />
          </Grid>
          <Grid
            sx={{
              overflowY: "auto",
              ...ScrollbarStyles,
            }}
          >
            {Object?.entries(relatedPayments || {})?.map(
              ([key, payment], index) => (
                <div key={key}>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontFamily: "Nunito" }}
                    >{`Payment ID: ${key}`}</Typography>

                    <div>
                      <IconButton onClick={() => toggleExpand(index)}>
                        {expandedIndices?.includes(index) ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                      <Button
                        buttonText="REVERT"
                        onClick={() => handleUpdateAll(key)}
                        backgroundColor={Colors.SKY_BLUE}
                        hoverColor={Colors.SKY_BLUE}
                        loading={loadingParentId === key}
                        loginFont="600"
                        width="5rem"
                      />
                    </div>
                  </Grid>

                  {/* Display Payment Details below Payment ID */}
                  <Grid direction="row" sx={{ pl: 1 }}>
                    {/* Always display the first row */}
                    <Grid
                      container
                      spacing={2}
                      sx={{ padding: "8px 0", alignItems: "center" }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "Nunito" }}
                        >
                          <strong>Amount:</strong>{" "}
                          {formatDollarAmount(payment[0]?.amount) || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "Nunito" }}
                        >
                          <strong>Transaction Type:</strong>{" "}
                          {payment[0]?.transactionType || "--"}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "Nunito" }}
                        >
                          <strong>Due Date:</strong>{" "}
                          {new Date(
                            payment[0]?.dueDate
                          )?.toLocaleDateString() || "--"}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Additional rows when expanded */}
                    {expandedIndices?.includes(index) &&
                    payment?.slice(1)?.length > 0
                      ? payment?.slice(1)?.map((row, rowIndex) => (
                          <Grid
                            key={rowIndex}
                            container
                            spacing={2}
                            sx={{ padding: "8px 0", alignItems: "center" }}
                          >
                            <Grid item xs={4}>
                              <Typography
                                variant="body2"
                                sx={{ fontFamily: "Nunito" }}
                              >
                                <strong>Amount:</strong>{" "}
                                {formatDollarAmount(row?.amount) || "-"}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography
                                variant="body2"
                                sx={{ fontFamily: "Nunito" }}
                              >
                                <strong>Transaction Type:</strong>{" "}
                                {row?.transactionType || "--"}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography
                                variant="body2"
                                sx={{ fontFamily: "Nunito" }}
                              >
                                <strong>Due Date:</strong>{" "}
                                {new Date(row?.dueDate)?.toLocaleDateString() ||
                                  "--"}
                              </Typography>
                            </Grid>
                          </Grid>
                        ))
                      : expandedIndices?.includes(index) && (
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "Nunito",
                              color: Colors.BLACK,
                              mt: 1,
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              textAlign: "center",
                            }}
                          >
                            No more data
                          </Typography>
                        )}
                  </Grid>

                  <Divider sx={{ my: 2 }} />
                </div>
              )
            )}
          </Grid>
        </>
      )}
    </>
  );
}

export default GetTransactionDetails;
