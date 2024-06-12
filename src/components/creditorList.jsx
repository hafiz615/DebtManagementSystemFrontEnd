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
import CircularProgress from "@mui/material/CircularProgress";
import { formatDollarAmount } from "../common";
const headers = [
  // "Index",
  "Name",
  "Number of Cases",
  "Number of Debtors",
  "Total Debt",
];

export default function CreditorList() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [totalData, setTotalData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalData / 5);
  const [limit, setLimit] = useState(5);
  const [searchActive, setSearchActive] = useState(false);

  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;

  const [rows, setRows] = useState([]);

  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);

  const GetCreditors = async (search) => {
    setLoading(true);
    setSearchActive(search);
    let filter = false;
    let payload = {};
    setLimit(5);

    if (search) {
      payload = {
        text: searchText,
      };
    } else {
      payload = {
        text: "",
      };
    }
    let page = currentPage;

    const getCreditors = await GetAllCreditors({
      search,
      filter,
      page,
      limit,
      payload,
    });
    if (getCreditors?.status === 200) {
      setUserArray(getCreditors?.data?.data?.clientDetails);
      setTotalData(getCreditors?.data?.data?.creditorsCount);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchActive) {
      GetCreditors(true);
    } else if (searchText) {
      GetCreditors(true);
    } else {
      GetCreditors();
    }
  }, [currentPage, searchText]);

  const handleKeyPress = (e) => {
    setSearchText(e.target.value);
  };

  const clearSearchFromApi = () => {
    setSearchText("");
    GetCreditors();
  };

  const generatedData = useMemo(() => {
    return (
      userArray &&
      userArray?.map((item) => ({
        id: item?.id,
        name: item?.creditorName || "-",
        totalCases: item?.totalCases || "-",
        totalCreditors: item?.totalDebtors || "-",
        totalDebt: formatDollarAmount(item?.totalDebt) || "-",
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
          searchCheck={true}
          searchingText={searchText}
          handleKeyPress={handleKeyPress}
          placeholder="Search Creditor..."
          clearSearchFromApi={clearSearchFromApi}
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
              apiPagination={true}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </>
        )}
      </Grid>
    </Grid>
  );
}
