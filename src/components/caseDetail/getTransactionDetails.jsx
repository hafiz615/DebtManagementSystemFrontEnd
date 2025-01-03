import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Divider,
  CircularProgress,
  IconButton,
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

function GetTransactionDetails({ handleClose, transactionId }) {
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
    const params = {
      referenceId: transactionId || "-",
      commission: relatedPayments?.[0]?.manualCommission || 0,
    };
    const UpdateManualPaymentsRes = await UpdateManualPayments(
      params,
      relatedPayments?.[0]?.debtorId
    );
    if (UpdateManualPaymentsRes?.status === 200) {
      showToast(UpdateManualPaymentsRes?.data?.message, "success");
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
      {relatedPaymentsLoading ? (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "30vh",
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
            height: "30vh",
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
            {relatedPayments?.map((payment, index) => (
              <div key={payment?.debtorTransId}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontFamily: "Nunito" }}
                  >{`Payment ID: ${payment?.debtorTransId}`}</Typography>

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
                      onClick={() => handleUpdateAll(transactionId)}
                      backgroundColor={Colors.SKY_BLUE}
                      hoverColor={Colors.SKY_BLUE}
                      loading={loadingParentId === transactionId}
                      loginFont="600"
                      width="5rem"
                    />
                  </div>
                </Grid>

                {/* Display Payment Details below Payment ID */}

                <Grid direction="row" sx={{ pl: 1 }}>
                  {(expandedIndices?.includes(index)
                    ? [payment]
                    : [payment]
                  )?.map((item) => (
                    <Grid
                      container
                      key={item._id || index} // Use a unique key, fall back to `index` if `_id` isn't available
                      spacing={2}
                      sx={{ padding: "8px 0", alignItems: "center" }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "Nunito" }}
                        >
                          <strong>Amount:</strong>{" "}
                          {formatDollarAmount(item?.amount) || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "Nunito" }}
                        >
                          <strong>Transaction Type:</strong>{" "}
                          {item?.transactionType || "--"}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "Nunito" }}
                        >
                          <strong>Due Date:</strong>{" "}
                          {new Date(item?.dueDate)?.toLocaleDateString() ||
                            "--"}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
                  {expandedIndices?.includes(index) && (
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
                      {expandedIndices?.includes(index) &&
                      [payment]?.length <= 1
                        ? "No more data"
                        : ""}
                    </Typography>
                  )}
                </Grid>

                <Divider sx={{ my: 2 }} />
              </div>
            ))}
          </Grid>
        </>
      )}
    </>
  );
}

export default GetTransactionDetails;
