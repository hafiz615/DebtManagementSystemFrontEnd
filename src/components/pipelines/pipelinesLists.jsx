import React from "react";
import ScrollbarStyles from "../customScroll";
import { Grid } from "@mui/material";
import { Colors } from "../../config/default";
import ListTable from "../listTable";

const headers = [
  "Lead",
  "Total Debt",
  "Confidence",
  "Close Date",
  "Status",
  "User",
];

const dummyData = [
  {
    lead: "Lead 1",
    totalDebt: "$5000",
    confidence: "High",
    closeDate: "2024-07-01",
    status: "Open",
    user: "User A",
  },
  {
    lead: "Lead 2",
    totalDebt: "$15000",
    confidence: "Medium",
    closeDate: "2024-08-15",
    status: "Closed",
    user: "User B",
  },
  {
    lead: "Lead 3",
    totalDebt: "$3000",
    confidence: "Low",
    closeDate: "2024-09-30",
    status: "Open",
    user: "User C",
  },
];

export default function PipelinesLists() {
  return (
    <Grid
      container
      sx={{
        height: "68vh",
        mt: "10px",
        // backgroundColor: Colors.WHITE,
        borderRadius: "10px",
        overflowX: "auto",
        ...ScrollbarStyles,
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <Grid item xs={12} sx={{ marginTop: "1rem" }}>
        <ListTable headerData={headers} data={dummyData} />
      </Grid>
    </Grid>
  );
}
