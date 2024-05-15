import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Grid, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { UserListPage } from "../constants/appConstants";
import { Colors } from "../config/default";
import CircularProgress from "@mui/material/CircularProgress";
import DataTable from "./table";
const columns = [
  {
    field: "name",
    headerName: <span style={{ fontWeight: "600" }}>Name</span>,
    flex: 1,
    minWidth: 70,
  },
  {
    field: "Number of Cases",
    headerName: <span style={{ fontWeight: "600" }}>Number of Cases</span>,
    flex: 1,
    minWidth: 70,
  },
  {
    field: "Number of Creditors",
    headerName: <span style={{ fontWeight: "600" }}>Number of Creditors</span>,
    flex: 1,
    minWidth: 70,
  },
  {
    field: "Client Status",
    headerName: <span style={{ fontWeight: "600" }}>Client Status</span>,
    flex: 1,
    minWidth: 70,
  },
  {
    field: "Total Dept",
    headerName: <span style={{ fontWeight: "600" }}>Total Dept</span>,
    flex: 1,
    minWidth: 70,
  },
];
export default function ClientList() {
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
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
        }}
      >
        <Typography
          sx={{
            bgcolor: Colors.WHITE,
            width: "max-content",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            marginLeft: "2.5rem",
            height: "3.5rem",
          }}
        >
          Clients List
        </Typography>
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
        {loading ? (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "50vh",
            }}
          >
            <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
          </Grid>
        ) : (
          <DataTable rows={rows} columns={columns} />
        )}
      </Grid>
    </Grid>
  );
}
