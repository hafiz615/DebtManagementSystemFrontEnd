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

  const decryptIfNeeded = (value) => {
    if (!value) return <div>-</div>;

    try {
      const decrypted = decrypt(value, REACT_APP_SECURITY_KEY);
      const parsed =
        typeof decrypted === "string" ? JSON.parse(decrypted) : decrypted;

      if (typeof parsed === "object" && parsed !== null) {
        return (
          <Box>
            <Typography sx={{ fontFamily: "Nunito" }}>
              Name: {parsed?.firstName || "-"} {parsed?.lastName || ""}
            </Typography>
            <Typography sx={{ fontFamily: "Nunito" }}>
              Account: {parsed?.bankRouting || "-"}
            </Typography>
          </Box>
        );
      }

      return <div>{parsed}</div>;
    } catch (error) {
      console.error("Decryption error:", error);
      return <div>{value}</div>;
    }
  };

  const handleDelete = async (debtorId, accountId) => {
    const payload = { accountId };
    const response = await DeleteDebtorAccount(debtorId, payload);
    if (response?.status === 200) {
      showToast(response?.data?.message, "success");
      // GetCaseDetails(caseDataId);
      GetDebtorAccounts(debtorId);
    } else {
      const errorMessage = response?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  return (
    <Box sx={{ fontFamily: "Nunito" }}>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 400, overflowY: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontFamily: "Nunito" }}>
                <strong>Customer Account</strong>
              </TableCell>
              <TableCell sx={{ fontFamily: "Nunito" }}>
                <strong>Account Type</strong>
              </TableCell>
              <TableCell sx={{ fontFamily: "Nunito" }}>
                <strong>Payment Type</strong>
              </TableCell>
              <TableCell sx={{ fontFamily: "Nunito" }}>
                <strong>Platform</strong>
              </TableCell>
              <TableCell sx={{ fontFamily: "Nunito" }}>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accountsResponse?.length > 0 ? (
              accountsResponse.map((acc, index) => (
                <TableRow key={acc._id}>
                  <TableCell sx={{ fontFamily: "Nunito" }}>
                    {decryptIfNeeded(acc?.vault)}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Nunito" }}>
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
                          backgroundColor: index === 0 ? "#7353F0" : "#EA6A47",
                          color: "#fff",
                          fontFamily: "Nunito",
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Nunito" }}>
                    {acc?.paymentType || "-"}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Nunito" }}>
                    {acc?.platform || "-"}
                  </TableCell>
                  <TableCell>
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
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ fontFamily: "Nunito" }}
                >
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
