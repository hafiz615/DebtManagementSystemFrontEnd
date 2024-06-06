import React from "react";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";

import { Grid, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { UserListPage } from "../constants/appConstants";
import { Colors } from "../config/default";
import SearchBar from "./searchBar";
import ListTable from "./listTable";
import { GetAllCreditors } from "../services/services";
import { useToast } from "../toast/toastContext";
import CircularProgress from "@mui/material/CircularProgress";
const headers = [
  // "Index",
  "Name",
  "Number of Cases",
  "Number of Debtors",
  "Total Dept",
];

export default function CreditorList() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;

  const [rows, setRows] = useState([]);

  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);

  const GetCreditors = async () => {
    setLoading(true);
    const getCreditors = await GetAllCreditors();

    if (getCreditors?.status === 200) {
      setUserArray(getCreditors?.data?.data?.clientDetails);
    } else {
      const errorMessage = getCreditors?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    GetCreditors();
  }, []);

  const generatedData = useMemo(() => {
    return (
      userArray &&
      userArray?.map((item) => ({
        id: item?.id,
        name: item?.creditorName || "-",
        totalCases: item?.totalCases || "-",
        totalCreditors: item?.totalDebtors || "-",
        totalDebt: item?.totalDebt || "-",
      }))
    );
  }, [userArray]);
  useEffect(() => {
    setRows(generatedData);
  }, [generatedData]);

  const handleRowClick = (id) => {
    localStorage.setItem("route", "list-details");
    navigate(`/creditor/list-details/${id}`);
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
          Creditors
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
            fontSize: 14,
            marginLeft: "2.5rem",
            height: "3.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Nunito",
          }}
        >
          Creditors List
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
          <>
            <ListTable
              headerData={headers}
              data={rows}
              onRowClick={handleRowClick}
            />
          </>
        )}
      </Grid>
    </Grid>
  );
}
