import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Grid, Typography } from "@mui/material";

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

function CaseHistory({ data }) {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = () => {
      const generatedData =
        data &&
        data?.map((item) => ({
          Creditor: item?.creditor || "-",
          totalDebt: item?.totalDebt || "-",
          lastPaymentAmount: item?.lastPayment || 0,
          lastDate: item?.lastPaymentDate || "-",
          upcomingDate: item?.upcomingAuthDate || "-",
          UpcomingDebt: item?.upcomingDebt || "-",
          caseOwner: item?.caseOwner || "-",
          OutstandingDebt: item?.outstandingDebt || "-",
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
        <ListTable
          headerData={headers}
          data={rows}
          onRowClick={() => navigate("/all-cases")}
        />
      </Grid>
    </>
  );
}

export default CaseHistory;
