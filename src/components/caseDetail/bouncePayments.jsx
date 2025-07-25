import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Divider,
  CircularProgress,
  IconButton,
  Collapse,
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

function BouncePayments({ debtorId }) {
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
      GetManualPaymentsDetails();
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
            height: "50vh",
            backgroundColor: Colors.WHITE,
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
            height: "50vh",
            backgroundColor: Colors.WHITE,
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
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
            Bounce payments does not exist...
          </Typography>
        </Grid>
      ) : (
        <>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              backgroundColor: Colors.WHITE,
              borderBottomLeftRadius: "5px",
              borderBottomRightRadius: "5px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Nunito",
                mb: "1rem",
                fontWeight: "600",
                padding: ".8rem",
              }}
            >
              Bounce Payment Details
            </Typography>
          </Grid>
          <Grid
            sx={{
              backgroundColor: Colors.WHITE,
              padding: ".8rem",
              borderBottomLeftRadius: "5px",
              borderBottomRightRadius: "5px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {Object?.keys(manualPayments)?.map((parentId, index) => (
              <div key={parentId}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="subtitle1" sx={{ fontFamily: "Nunito" }}>
                    {`Reference ID: ${parentId}`}
                  </Typography>

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

                {/* Commission Section */}
                <Grid sx={{ pl: 1, mt: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "Nunito", fontWeight: "600" }}
                  >
                    <strong>Commission:</strong>{" "}
                    {formatDollarAmount(
                      manualPayments[parentId]?.[0]?.manualCommission
                    ) || "-"}
                  </Typography>
                </Grid>

                {/* Payments List with Inner Scroll */}
                <Collapse
                  in={expandedIndices.includes(index)}
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid
                    sx={{
                      ...ScrollbarStyles,
                      pl: 1,
                      mt: 1,
                      borderRadius: 1,
                      padding: "10px",
                      maxHeight: "30vh", // scroll inside here
                      overflowY: "auto",
                    }}
                  >
                    {manualPayments[parentId]?.map((item) => (
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
                            <strong>Amount:</strong>{" "}
                            {formatDollarAmount(item?.amount) || "-"}
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

                    {manualPayments[parentId]?.length === 1 && (
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
                </Collapse>

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
