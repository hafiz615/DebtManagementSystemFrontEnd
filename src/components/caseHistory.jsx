import React from "react";
import { useEffect, useState } from "react";

import { Grid, Typography } from "@mui/material";

// import { isEqual } from "lodash";

import { Colors } from "../config/default";
import SearchBar from "./searchBar";
import ListTable from "./listTable";
const headers = [
  "Creditor",
  "Total Debt",
  "Last Payment Amount",
  "Last Date",
  "Upcoming Date",
  "Upcoming Debt",
  "Case Owner",
  "Outstanding Debt",
];
function createData(
  Creditor,
  totalDebt,
  lastPaymentAmount,
  lastDate,
  upcomingDate,
  UpcomingDebt,
  caseOwner,
  OutstandingDebt
) {
  return {
    Creditor,
    totalDebt,
    lastPaymentAmount,
    lastDate,
    upcomingDate,
    UpcomingDebt,
    caseOwner,
    OutstandingDebt,
  };
}
const tableData = [
  createData(
    "User Name",
    "$10,000",
    "$1,500",
    "2/4/2024",
    "3/4/2024",
    "$10,000",
    "User Name",
    "User Name"
  ),
  createData(
    "User Name",
    "$10,000",
    "$1,500",
    "2/4/2024",
    "3/4/2024",
    "$10,000",
    "User Name",
    "User Name"
  ),
  createData(
    "User Name",
    "$10,000",
    "$1,500",
    "2/4/2024",
    "3/4/2024",
    "$10,000",
    "User Name",
    "User Name"
  ),
  createData(
    "User Name",
    "$10,000",
    "$1,500",
    "2/4/2024",
    "3/4/2024",
    "$10,000",
    "User Name",
    "User Name"
  ),
  createData(
    "User Name",
    "$10,000",
    "$1,500",
    "2/4/2024",
    "3/4/2024",
    "$10,000",
    "User Name",
    "User Name"
  ),
  createData(
    "User Name",
    "$10,000",
    "$1,500",
    "2/4/2024",
    "3/4/2024",
    "$10,000",
    "User Name",
    "User Name"
  ),
  createData(
    "User Name",
    "$10,000",
    "$1,500",
    "2/4/2024",
    "3/4/2024",
    "$10,000",
    "User Name",
    "User Name"
  ),
  createData(
    "User Name",
    "$10,000",
    "$1,500",
    "2/4/2024",
    "3/4/2024",
    "$10,000",
    "User Name",
    "User Name"
  ),
  createData(
    "User Name",
    "$10,000",
    "$1,500",
    "2/4/2024",
    "3/4/2024",
    "$10,000",
    "User Name",
    "User Name"
  ),
  createData(
    "User Name",
    "$10,000",
    "$1,500",
    "2/4/2024",
    "3/4/2024",
    "$10,000",
    "User Name",
    "User Name"
  ),
  createData(
    "User Name",
    "$10,000",
    "$1,500",
    "2/4/2024",
    "3/4/2024",
    "$10,000",
    "User Name",
    "User Name"
  ),
  createData(
    "User Name",
    "$10,000",
    "$1,500",
    "2/4/2024",
    "3/4/2024",
    "$10,000",
    "User Name",
    "User Name"
  ),
];

function CaseHistory() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = () => {
      const generatedData = tableData.map((item) => ({
        Creditor: item.Creditor,
        totalDebt: item.totalDebt,
        lastPaymentAmount: item.lastPaymentAmount,
        lastDate: item.lastDate,
        upcomingDate: item.upcomingDate,
        UpcomingDebt: item.UpcomingDebt,
        caseOwner: item.caseOwner,
        OutstandingDebt: item.OutstandingDebt,
      }));
      setRows(generatedData);
    };

    fetchData();
  }, []);
  return (
    <>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            paddingLeft: "0.8rem",
            paddingRight: "0.8rem",
            bgcolor: Colors.WHITE,
            width: "max-content",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            fontWeight: "600",
            fontSize: "0.8rem",
            marginLeft: "2.5rem",
            height: "3.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Case History
        </Typography>
        <SearchBar placeholder="Search Creditor..." />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px ",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ListTable headerData={headers} data={rows} />
      </Grid>
    </>
  );
}

export default CaseHistory;
