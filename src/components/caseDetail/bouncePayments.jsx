import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Divider,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Close, ExpandMore, ExpandLess } from "@mui/icons-material";
import {
  GetManualPayments,
  UpdateManualPayments,
} from "../../services/services";
import { useToast } from "../../toast/toastContext";
import { Colors } from "../../config/default";
import Button from "../button";
import { formatDollarAmount } from "../../common";
import ScrollbarStyles from "../customScroll";
import { isEmpty } from "lodash";

function BouncePayments({ handleClose, debtorId }) {
  const [manualPaymentsLoading, setManualPaymentsLoading] = useState(false);
  const [loadingParentId, setLoadingParentId] = useState(null);
  const [manualPayments, setManualPayments] = useState(null);
  const [expandedIndices, setExpandedIndices] = useState([]);
  const { showToast } = useToast();

  const GetManualPaymentsDetails = async () => {
    setManualPaymentsLoading(true);
    const GetManualPaymentsDetailsRes = await GetManualPayments(debtorId);
    if (GetManualPaymentsDetailsRes?.status === 200) {
      setManualPayments(GetManualPaymentsDetailsRes?.data?.data);
    } else if (GetManualPaymentsDetailsRes?.response?.status === 400) {
      const errorMessage = GetManualPaymentsDetailsRes?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setManualPaymentsLoading(false);
  };

  useEffect(() => {
    GetManualPaymentsDetails();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndices((prev) =>
      prev?.includes(index)
        ? prev?.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleUpdateAll = async (parentId) => {
    setLoadingParentId(parentId);
    const params = {
      referenceId: parentId || "-",
      commission: manualPayments[parentId]?.[0]?.manualCommission || 0,
    };
    const UpdateManualPaymentsRes = await UpdateManualPayments(
      params,
      debtorId
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

  const isDataEmpty = !manualPayments || isEmpty(manualPayments);

  return (
    <>
      {manualPaymentsLoading ? (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "40vh",
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
            height: "40vh",
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
              Bounce Payment Details
            </Typography>
            <Close onClick={handleClose} />
          </Grid>
          <Grid
            sx={{
              //   height: "35vh",
              overflowY: "auto",
              ...ScrollbarStyles,
            }}
          >
            {Object?.keys(manualPayments)?.map((parentId, index) => (
              <div key={parentId}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontFamily: "Nunito" }}
                  >{`Reference ID: ${parentId}`}</Typography>

                  <div>
                    <IconButton onClick={() => toggleExpand(index)}>
                      {expandedIndices.includes(index) ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                    <Button
                      buttonText="REVERT"
                      onClick={() => handleUpdateAll(parentId)}
                      backgroundColor={Colors.SKY_BLUE}
                      hoverColor={Colors.SKY_BLUE}
                      loading={loadingParentId === parentId}
                      loginFont="600"
                      width="5rem"
                    />
                  </div>
                </Grid>
                <Grid direction="row" sx={{ pl: 1 }}>
                  {(expandedIndices?.includes(index)
                    ? manualPayments[parentId]
                    : [manualPayments[parentId][0]]
                  )?.map((item) => (
                    <Grid
                      container
                      key={item._id}
                      spacing={2}
                      sx={{ padding: "8px 0", alignItems: "center" }}
                    >
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "Nunito" }}
                        >
                          <strong>Commission:</strong>{" "}
                          {formatDollarAmount(item?.manualCommission) || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "Nunito" }}
                        >
                          <strong>Time Period:</strong>{" "}
                          {item?.timePeriod || "--"}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "Nunito" }}
                        >
                          <strong>Due Date:</strong>{" "}
                          {new Date(item?.dueDate)?.toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
                  {expandedIndices?.includes(index) &&
                    manualPayments[parentId]?.length === 1 && (
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
            ))}
          </Grid>
        </>
      )}
    </>
  );
}

export default BouncePayments;
