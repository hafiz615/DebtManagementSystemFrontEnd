import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Grid, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { isEqual } from "lodash";

import { UserListPage } from "../constants/appConstants";
import { Colors } from "../config/default";
import DataTable from "./table";
import SearchBar from "./searchBar";
const columns = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    minWidth: 70,
  },
  {
    field: "numberOfCases",
    headerName: "Number of Cases",
    flex: 1,
    minWidth: 70,
  },
  {
    field: "numberOfCreditors",
    headerName: "Number of Creditors",
    flex: 1,
    minWidth: 70,
  },
  {
    field: "clientStatus",
    headerName: "Client Status",
    flex: 1,
    minWidth: 70,
  },
  {
    field: "totalDept",
    headerName: "Total Dept",
    flex: 1,
    minWidth: 70,
  },
];
const rowArray = [
  {
    name: "User Name",
    numberOfCases: "03",
    numberOfCreditors: "03",
    clientStatus: "Lorem Ipsum",
    totalDept: "$10,000",
  },
  {
    name: "User Name",
    numberOfCases: "03",
    numberOfCreditors: "03",
    clientStatus: "Lorem Ipsum",
    totalDept: "$10,000",
  },
  {
    name: "User Name",
    numberOfCases: "03",
    numberOfCreditors: "03",
    clientStatus: "Lorem Ipsum",
    totalDept: "$10,000",
  },
  {
    name: "User Name",
    numberOfCases: "03",
    numberOfCreditors: "03",
    clientStatus: "Lorem Ipsum",
    totalDept: "$10,000",
  },
  {
    name: "User Name",
    numberOfCases: "03",
    numberOfCreditors: "03",
    clientStatus: "Lorem Ipsum",
    totalDept: "$10,000",
  },
  {
    name: "User Name",
    numberOfCases: "03",
    numberOfCreditors: "03",
    clientStatus: "Lorem Ipsum",
    totalDept: "$10,000",
  },
  {
    name: "User Name",
    numberOfCases: "03",
    numberOfCreditors: "03",
    clientStatus: "Lorem Ipsum",
    totalDept: "$10,000",
  },
  {
    name: "User Name",
    numberOfCases: "03",
    numberOfCreditors: "03",
    clientStatus: "Lorem Ipsum",
    totalDept: "$10,000",
  },
];
export default function ClientList() {
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const generatedData = rowArray?.map((item, index) => ({
      id: index,
      name: item?.name,
      numberOfCases: item?.numberOfCases,
      numberOfCreditors: item?.numberOfCreditors,
      clientStatus: item?.clientStatus,
      totalDept: item?.totalDept,
    }));
    if (!isEqual(generatedData, rowArray)) {
      setRows(generatedData);
    }
  }, []);
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
        container
        item
        xs={11.9}
        sx={{
          marginTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            padding: "1rem",
            bgcolor: Colors.WHITE,
            width: "max-content",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            fontWeight: "600",
            marginLeft: "2.5rem",
            height: "3.5rem",
          }}
        >
          Clients List
        </Typography>
        <SearchBar />
      </Grid>
      <Grid
        item
        xs={11.9}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px ",
          // height: "58vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DataTable rows={rows} columns={columns} />
      </Grid>
    </Grid>
  );
}
