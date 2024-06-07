import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Grid, Typography } from "@mui/material";

import { Colors } from "../config/default";
import SearchBar from "./searchBar";
import ListTable from "./listTable";
import { formatDollarAmount } from "../common";

function CaseHistory({ data, userRole }) {
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };
  const headers = [
    "Case Owner",
    userRole === "client" ? "Creditor" : "Debtor",
    "Last Payment Date",
    "Outstanding Debt",
    "Total Debt",
    "Upcoming Debt",
    "Upcoming Date",
    "Last Payment Amount",
  ];
  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = () => {
      const generatedData =
        data &&
        data?.map((item) => ({
          id: item?._id,
          caseOwner: item?.caseOwner || "-",
          Creditor: item?.creditorName || item?.debtorName || "-",
          lastDate: formatDate(item?.lastPaymentDate) || "-",
          OutstandingDebt: formatDollarAmount(item?.outstandingDebt) || "-",
          totalDebt: formatDollarAmount(item?.totalDebt) || "-",
          UpcomingDebt: formatDollarAmount(item?.upcomingPayment) || "-",
          upcomingDate: formatDate(item?.upcomingPaymentDate) || "-",
          lastPaymentAmount: formatDollarAmount(item?.lastPayment) || "-",
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
            fontSize: 14,
            fontFamily: "Nunito",
            marginLeft: "2.5rem",
            height: "3.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Case History
        </Typography>
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          placeholder="Search Creditor..."
        />
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
          onRowClick={(id) => navigate(`/all-cases/${id}`)}
        />
      </Grid>
    </>
  );
}

export default CaseHistory;
