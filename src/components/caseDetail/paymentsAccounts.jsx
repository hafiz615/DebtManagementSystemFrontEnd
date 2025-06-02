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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import { decrypt } from "n-krypta";
import { REACT_APP_SECURITY_KEY } from "../../constants/appConstants";
import { DeleteDebtorAccount } from "../../services/services";
import Prompt from "../prompt";
import { useToast } from "../../toast/toastContext";

export default function PaymentsAccounts({
  caseData,
  GetCaseDetails,
  caseDataId,
  accountsResponse,
}) {
  const { showToast } = useToast();

  const styles = {
    accordionSummary: {
      backgroundColor: Colors.SKY_BLUE,
      borderRadius: "10px",
      color: Colors.WHITE,
    },
  };

  const parseKillerPattern = (value) => {
    try {
      const firstNameMatch = value.match(/fisttOamekiller:#(.*?)killer[-;]/);
      const lastNameMatch = value.match(/lastObme#;killer(.*?)killer[,;]/);
      const accountMatch = value.match(
        /cbnkomegabcdountkiller;#(.*?)killer[,;]/
      );

      const firstName = firstNameMatch?.[1] || "-";
      const lastName = lastNameMatch?.[1] || "-";
      const bankAccount = accountMatch?.[1] || "-";

      return (
        <>
          <div>First Name: {firstName}</div>
          <div>Last Name: {lastName}</div>
          <div>Account: {bankAccount}</div>
        </>
      );
    } catch {
      return <div>{value}</div>;
    }
  };

  const decryptIfNeeded = (value) => {
    if (!value) return <div>-</div>;

    const suspiciousPattern =
      value.includes("killer") || value.includes("fisttOame");

    try {
      if (suspiciousPattern) {
        const isKillerFormatted =
          value.includes("cbnkomegabcdountkiller") ||
          value.includes("lastObme") ||
          value.includes("bbok_spuuingkiller");

        if (isKillerFormatted) {
          return parseKillerPattern(value);
        }

        const decrypted = decrypt(value, REACT_APP_SECURITY_KEY);
        const parsed =
          typeof decrypted === "string" ? JSON.parse(decrypted) : decrypted;

        if (typeof parsed === "object" && parsed !== null) {
          return (
            <>
              <div>First Name: {parsed?.firstName}</div>
              <div>Last Name: {parsed?.lastName}</div>
              <div>Account: {parsed?.bankAccount}</div>
            </>
          );
        }

        return <div>{parsed}</div>;
      } else {
        return <div>{value}</div>;
      }
    } catch {
      return <div>{value}</div>;
    }
  };

  const handleDelete = async (index) => {
    const payload = { index };
    const response = await DeleteDebtorAccount(caseData?._id, payload);
    if (response?.status === 200) {
      showToast(response?.data?.message, "success");
      GetCaseDetails(caseDataId);
    } else {
      const errorMessage = response?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: 300, overflowY: "auto" }}
    >
      <Table stickyHeader sx={{ fontFamily: "Nunito" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontFamily: "Nunito" }}>
              <strong>Customer Vault ID</strong>
            </TableCell>
            <TableCell sx={{ fontFamily: "Nunito" }}>
              <strong>Account Type</strong>
            </TableCell>
            <TableCell sx={{ fontFamily: "Nunito" }}>
              <strong>Customer Account</strong>
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
          {caseData?.accounts?.length > 0 ? (
            caseData.accounts.map((acc, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontFamily: "Nunito" }}>
                  {acc?.customerVaultId || "-"}
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
                        fontFamily: "Nunito",
                        backgroundColor: index === 0 ? "#7353F0" : "#EA6A47",
                        color: "#fff",
                      }}
                    />
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ fontFamily: "Nunito" }}>
                  {acc?.customerAccount
                    ? decryptIfNeeded(acc?.customerAccount)
                    : "-"}
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
                    handleDeleteAccount={() => handleDelete(index)}
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
  );
}
