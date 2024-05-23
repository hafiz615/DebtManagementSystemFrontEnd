import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Grid, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
// import { isEqual } from "lodash";
import { useNavigate } from "react-router-dom";
import { UserListPage } from "../constants/appConstants";
import { Colors } from "../config/default";
import SearchBar from "./searchBar";
import ListTable from "./listTable";
const headers = [
  // "Index",
  "Name",
  "Number of Cases",
  "Number of Creditors",
  "Client Status",
  "Total Dept",
];
function createData(
  debtor,
  dueDate,
  tryDate,
  totalDebt,
  ssid,
  caseOwner,
  actions
) {
  return { debtor, dueDate, tryDate, totalDebt, ssid, caseOwner, actions };
}
const tableData = [
  createData("User Name", "03", "03", "Lorem Ipsum", "$10,000"),
  createData("User Name", "03", "03", "Lorem Ipsum", "$10,000"),
  createData("User Name", "03", "03", "Lorem Ipsum", "$10,000"),
  createData("User Name", "03", "03", "Lorem Ipsum", "$10,000"),
  createData("User Name", "03", "03", "Lorem Ipsum", "$10,000"),
  createData("User Name", "03", "03", "Lorem Ipsum", "$10,000"),
  createData("User Name", "03", "03", "Lorem Ipsum", "$10,000"),
];
export default function ClientList() {
  const navigate = useNavigate();
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = () => {
      const generatedData = tableData.map((item, index) => ({
        // id: index,
        debtor: item.debtor,
        dueDate: item.dueDate,
        tryDate: item.tryDate,
        totalDebt: item.totalDebt,
        ssid: item.ssid,
        caseOwner: item.caseOwner,
        actions: item.actions,
      }));
      setRows(generatedData);
    };

    fetchData();
  }, []);
  const handleRowClick = (id) => {
    localStorage.setItem("route", "client-list-details");
    navigate(`/client-list-details/${id}`);
  };
  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        paddingLeft: "2rem",
        paddingRight: "2rem",
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: smallScreen ? "flex-start" : "flex-end",
          marginTop: "1.5rem",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "500",
            color: Colors.DARK_GRAY,
          }}
        >
          {AUTHORITY_TEXT} <span>{role}</span>
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: "1.5rem",
        }}
      >
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "2rem",
            fontFamily: "Nunito",
            color: Colors.BLACK,
          }}
        >
          Clients
        </Typography>
      </Grid>
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
          Clients List
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
          onRowClick={handleRowClick}
        />
      </Grid>
    </Grid>
  );
}
