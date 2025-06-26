import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import { decrypt } from "n-krypta";
import { REACT_APP_SECURITY_KEY } from "../../constants/appConstants";
import { DeleteDebtorAccount } from "../../services/services";
import Prompt from "../prompt";
import { useToast } from "../../toast/toastContext";

export default function PaymentsAccounts({
  GetCaseDetails,
  caseDataId,
  accountsResponse,
  GetDebtorAccounts,
}) {
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

  const handleDelete = async (debtorId, accountId) => {
    const payload = { accountId };
    const response = await DeleteDebtorAccount(debtorId, payload);
    if (response?.status === 200) {
      showToast(response?.data?.message, "success");
      GetDebtorAccounts(debtorId);
    } else {
      const errorMessage = response?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  return (
    <Box sx={textStyle}>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 400, overflowY: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
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
              <TableCell sx={textStyle}>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accountsResponse?.length > 0 ? (
              accountsResponse.map((acc, index) => (
                <TableRow key={acc._id}>
                  <TableCell sx={textStyle}>
                    {decryptIfNeeded(acc?.vault)}
                  </TableCell>
                  <TableCell sx={textStyle}>
                    <Tooltip
                      title={
                        index === 0 ? "Primary Account" : "Secondary Account"
                      }
                      arrow
                    >
                      <Chip
                        label={index === 0 ? "Primary" : "Secondary"}
                        size="small"
                        sx={{
                          ...textStyle,
                          backgroundColor: index === 0 ? "#7353F0" : "#EA6A47",
                          color: "#fff",
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={textStyle}>
                    {acc?.paymentType || "-"}
                  </TableCell>
                  <TableCell sx={textStyle}>{acc?.platform || "-"}</TableCell>
                  <TableCell sx={textStyle}>
                    <Prompt
                      text="Are you sure you want to delete this account?"
                      iconSize="1.3rem"
                      deleting="deleteAccount"
                      handleDeleteAccount={() =>
                        handleDelete(acc?.debtorId, acc._id)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={textStyle}>
                  No account exists
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
