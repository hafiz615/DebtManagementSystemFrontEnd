import React, { useState } from "react";
import { Colors } from "../../config/default";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  Chip,
  Tooltip,
  IconButton,
  Typography, // ✅ FIXED: Added Typography import
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import TextButton from "../button";

import { useToast } from "../../toast/toastContext";
import { RetryAuth, RetryCapture } from "../../services/services";
import { decrypt } from "n-krypta";
import { REACT_APP_SECURITY_KEY } from "../../constants/appConstants";

function RetryPayments({
  accountsResponse,
  show,
  GetCasePaymentDetails,
  getCommissionPayments,
  getHomeData,
  arrayName,
  itemRow,
  item,
}) {
  const [openDialogue, setOpenDialogue] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const textStyle = {
    fontFamily: "Nunito",
    fontSize: "0.875rem",
  };

  const decryptIfNeeded = (value) => {
    if (!value) return <div style={textStyle}>-</div>;

    try {
      const decrypted = decrypt(value, REACT_APP_SECURITY_KEY);
      const parsed =
        typeof decrypted === "string" ? JSON.parse(decrypted) : decrypted;

      if (typeof parsed === "object" && parsed !== null) {
        return (
          <Box>
            <Typography sx={textStyle}>
              Name: {parsed?.firstName || "-"} {parsed?.lastName || ""}
            </Typography>
            <Typography sx={textStyle}>
              Account: {parsed?.bankRouting || "-"}
            </Typography>
          </Box>
        );
      }

      return <div style={textStyle}>{parsed}</div>;
    } catch (error) {
      console.error("Decryption error:", error);
      return <div style={textStyle}>{value}</div>;
    }
  };

  const handleChange = (accountId) => {
    setSelectedAccountId(accountId);
  };

  const handleRetry = async () => {
    if (!selectedAccountId) return;

    let response;
    const payload = { accountId: selectedAccountId };

    setLoading(true);

    if (
      (item?.type === "authorization" && item?.authorized === "Failed") ||
      arrayName === "failedAuthorizations"
    ) {
      response = await RetryAuth(show ? itemRow : item?.id, payload);
    } else if (
      (item?.type === "capture" && item?.captured === "Failed") ||
      arrayName === "failedCaptures"
    ) {
      response = await RetryCapture(show ? itemRow : item?.id, payload);
    }

    if (response?.status === 200) {
      showToast(response?.data?.message, "success");
      if (item) {
        GetCasePaymentDetails?.(true);
        getCommissionPayments?.();
      }
      if (show) {
        getHomeData(arrayName, 1);
      }
    } else {
      showToast(
        response?.response?.data?.message || "Something went wrong",
        "error"
      );
    }

    setLoading(false);
    setOpenDialogue(false);
  };

  const filteredAccounts =
    (item?.type === "authorization" && item?.authorized === "Failed") ||
    arrayName === "failedAuthorizations"
      ? accountsResponse?.filter(
          (acc) => acc?.paymentType?.toLowerCase() === "cc"
        )
      : accountsResponse;

  return (
    <>
      <IconButton>
        <ReplayIcon
          onClick={() => setOpenDialogue(true)}
          sx={{
            color: Colors.ORANGE_COLOR,
            fontSize: show ? "1.3rem" : "1.2rem",
            cursor: "pointer",
          }}
        />
      </IconButton>

      <Dialog
        open={openDialogue}
        onClose={() => setOpenDialogue(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "1rem",
            width: "60vw",
            maxWidth: "800px",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
          Select Account To Proceed
        </DialogTitle>

        <DialogContent>
          <Box sx={textStyle}>
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 400, overflowY: "auto" }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={textStyle}>
                      <strong>Select</strong>
                    </TableCell>
                    <TableCell sx={textStyle}>
                      <strong>Customer Account</strong>
                    </TableCell>
                    <TableCell sx={textStyle}>
                      <strong>Account Type</strong>
                    </TableCell>
                    <TableCell sx={textStyle}>
                      <strong>Payment Type</strong>
                    </TableCell>
                    <TableCell sx={textStyle}>
                      <strong>Platform</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredAccounts?.length > 0 ? (
                    filteredAccounts.map((acc, index) => (
                      <TableRow key={acc?._id}>
                        <TableCell>
                          <Radio
                            size="small"
                            checked={selectedAccountId === acc?._id}
                            onChange={() => handleChange(acc?._id)}
                            value={acc?._id}
                            sx={{
                              color: Colors.SKY_BLUE,
                              "&.Mui-checked": {
                                color: Colors.SKY_BLUE,
                                backgroundColor: "#FFF3E0",
                                borderRadius: "50%",
                              },
                              "&:hover": {
                                backgroundColor: Colors.lIGHT_PURPLE,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={textStyle}>
                          {decryptIfNeeded(acc?.vault)}
                        </TableCell>
                        <TableCell sx={textStyle}>
                          <Tooltip
                            title={
                              index === 0
                                ? "Primary Account"
                                : "Secondary Account"
                            }
                            arrow
                          >
                            <Chip
                              label={index === 0 ? "Primary" : "Secondary"}
                              size="small"
                              sx={{
                                ...textStyle,
                                backgroundColor:
                                  index === 0 ? "#7353F0" : "#EA6A47",
                                color: "#fff",
                              }}
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={textStyle}>
                          {acc?.paymentType || "-"}
                        </TableCell>
                        <TableCell sx={textStyle}>
                          {acc?.platform || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={textStyle}>
                        No account exists
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>

        <DialogActions>
          <TextButton
            buttonText="Cancel"
            onClick={() => setOpenDialogue(false)}
            backgroundColor={Colors.ORANGE_COLOR}
            hoverColor={Colors.ORANGE_COLOR}
            paddingLeft="2rem"
            paddingRight="2rem"
            height="2rem"
            marginRight=".5rem"
            width="6rem"
          />

          <TextButton
            loading={loading}
            disabled={!selectedAccountId}
            buttonText="Confirm"
            onClick={handleRetry}
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            paddingLeft="2rem"
            paddingRight="2rem"
            height="2rem"
            width="6rem"
          />
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RetryPayments;
