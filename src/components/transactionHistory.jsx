import React from "react";
import { Typography, Divider } from "@mui/material";
import TransactionHistoryTable from "./transactionHistoryTable";

export default function TransactionHistory({ transactionKey, data }) {
  return (
    <>
      <Typography
        sx={{
          textAlign: "center",
          width: "100%",
          fontFamily: "Nunito",
          m: "1rem 0",
          fontWeight: "700",
        }}
      >
        Transaction History
      </Typography>
      <Divider sx={{ mb: "1rem" }} />
      {data ? (
        <TransactionHistoryTable data={data?.[transactionKey]} />
      ) : (
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ fontFamily: "Nunito", textAlign: "center" }}
        >
          No data available
        </Typography>
      )}
    </>
  );
}
