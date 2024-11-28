import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TransactionHistoryTable from "./transactionHistoryTable";
import { FONT_SIZE_MEDIUM } from "../constants/appConstants";
import { Colors } from "../config/default";

export default function TransactionHistory({ data }) {
  const transactionTypes = [
    { label: "Transfer", key: Object.keys(data)[0] },
    { label: "Check", key: Object.keys(data)[1] },
    { label: "Wire", key: Object.keys(data)[2] },
    { label: "Others", key: "others" },
  ];

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
        transactionTypes?.map(({ label, key }) => (
          <Accordion
            key={key}
            sx={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "none",
              "&:not(:last-child)": {
                marginBottom: "1rem",
              },
            }}
          >
            <AccordionSummary
              sx={{
                backgroundColor: Colors.SKY_BLUE,
                borderRadius: "10px",
                color: Colors.WHITE,
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: Colors.WHITE }} />}
            >
              <Typography
                sx={{
                  fontSize: FONT_SIZE_MEDIUM,
                  fontFamily: "Nunito",
                }}
              >
                {key}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                padding: "1rem",
                backgroundColor: "#ffffff",
              }}
            >
              <TransactionHistoryTable data={data?.[key]} />
            </AccordionDetails>
          </Accordion>
        ))
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
