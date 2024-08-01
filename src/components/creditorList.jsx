import React from "react";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";

import { Grid, Typography, IconButton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_XL,
  UserListPage,
} from "../constants/appConstants";
import { Colors } from "../config/default";
import SearchBar from "./searchBar";
import ListTable from "./listTable";
import { GetAllCreditors } from "../services/services";
import CircularProgress from "@mui/material/CircularProgress";
import { formatDollarAmount } from "../common";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import Menu from "@mui/material/Menu";
import TextButton from "./button";

const headers = [
  // "Index",
  "Company Name",
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
  const [filterActive, setFilterActive] = useState(false);
  const [totalDebtMin, setTotalDebtMin] = useState("");
  const [totalDebtMax, setTotalDebtMax] = useState("");
  const [totalCasesMin, setTotalCasesMin] = useState("");
  const [totalCasesMax, setTotalCasesMax] = useState("");
  const [totalCreditorsMin, setTotalCreditorsMin] = useState("");
  const [totalCreditorsMax, setTotalCreditorsMax] = useState("");
  const [applyDisabled, setApplyDisabled] = useState(true);
  const [saveState, setSaveState] = useState(false);
  const [rows, setRows] = useState([]);
  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;

  const createFilterObject = (
    totalDebtMin,
    totalDebtMax,
    totalCasesMin,
    totalCasesMax,
    totalCreditorsMin,
    totalCreditorsMax
  ) => {
    const filter = {};
    if (
      totalDebtMin !== null &&
      totalDebtMin !== "" &&
      totalDebtMax !== null &&
      totalDebtMax !== ""
    ) {
      filter.totalDebt = {
        min: parseInt(totalDebtMin),
        max: parseInt(totalDebtMax),
      };
    }
    if (
      totalCasesMin !== null &&
      totalCasesMin !== "" &&
      totalCasesMax !== null &&
      totalCasesMax !== ""
    ) {
      filter.totalCases = {
        min: parseInt(totalCasesMin),
        max: parseInt(totalCasesMax),
      };
    }
    if (
      totalCreditorsMin !== null &&
      totalCreditorsMin !== "" &&
      totalCreditorsMax !== null &&
      totalCreditorsMax !== ""
    ) {
      filter.totalCreditors = {
        min: parseInt(totalCreditorsMin),
        max: parseInt(totalCreditorsMax),
      };
    }

    return filter;
  };

  const GetCreditors = async (search, filter) => {
    setLoading(true);
    let payload = {};
    setLimit(5);

    const filterObj = createFilterObject(
      totalDebtMin,
      totalDebtMax,
      totalCasesMin,
      totalCasesMax,
      totalCreditorsMin,
      totalCreditorsMax
    );
    payload = {
      text: search ? searchText : "",
      filter: filter ? filterObj : {},
    };
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
    } else if (
      getCreditors?.response?.status === 401 ||
      getCreditors?.response?.status === 403
    ) {
      localStorage.clear();
      navigate("/");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!searchText) {
      setSearchActive(false);
    }
    if (searchText) {
      setSearchActive(true);
      GetCreditors(searchActive, filterActive);
    } else if (filterActive) {
      GetCreditors(searchActive, filterActive);
    } else if (!searchText && !filterActive) {
      GetCreditors(false, false);
    }
  }, [currentPage, searchText, saveState, filterActive, searchActive]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterActive, searchActive]);

  const handleKeyPress = (e) => {
    setSearchText(e.target.value);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (value === "" || Number(value) >= 0) {
      setter(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "-") {
      e.preventDefault();
    }
  };

  const handleSave = () => {
    handleClose();
    setSaveState(!saveState);
    setFilterActive(true);
  };

  const handleClear = () => {
    setTotalDebtMin("");
    setTotalDebtMax("");
    setTotalCasesMin("");
    setTotalCasesMax("");
    setTotalCreditorsMin("");
    setTotalCreditorsMax("");
    setFilterActive(false);
    handleClose();
    GetCreditors(searchActive, false);
  };

  const disabled =
    !totalCreditorsMax &&
    !totalCreditorsMin &&
    !totalCasesMax &&
    !totalCasesMin &&
    !totalDebtMin &&
    !totalDebtMax;

  const isPairComplete = (min, max) => {
    return (min !== "" && max !== "") || (min === "" && max === "");
  };

  useEffect(() => {
    const allPairsValid =
      isPairComplete(totalDebtMin, totalDebtMax) &&
      isPairComplete(totalCasesMin, totalCasesMax) &&
      isPairComplete(totalCreditorsMin, totalCreditorsMax);

    const anyPairFilled =
      (totalDebtMin !== "" && totalDebtMax !== "") ||
      (totalCasesMin !== "" && totalCasesMax !== "") ||
      (totalCreditorsMin !== "" && totalCreditorsMax !== "");

    setApplyDisabled(!(allPairsValid && anyPairFilled));
  }, [
    totalDebtMin,
    totalDebtMax,
    totalCasesMin,
    totalCasesMax,
    totalCreditorsMin,
    totalCreditorsMax,
  ]);

  const generatedData = useMemo(() => {
    return (
      userArray &&
      userArray?.map((item) => ({
        id: item?.id,
        name: item?.companyName || "-",
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
      <Grid container sx={{ alignItems: "center" }}>
        <Grid
          item
          xs={12}
          sx={{
            marginTop: "1.5rem",
            display: "flex",
            justifyContent: { xs: "unset", sm: "space-between" },
            alignItems: { xs: "unset", sm: "center" },
            gap: { xs: "1rem", sm: "0" },
            flexDirection: { xs: "column-reverse", sm: "row" },
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
          <div style={{ display: "flex" }}>
            <SearchBar
              searchCheck={true}
              searchingText={searchText}
              handleKeyPress={handleKeyPress}
              placeholder="Search Client..."
            />
            <IconButton
              id="demo-positioned-button"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <FilterListOutlinedIcon
                sx={{
                  color: Colors.DARK_GRAY,
                  fontSize: { xs: "20px", sm: "30px" },
                }}
              />
            </IconButton>
          </div>
        </Grid>

        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "12px",
            },
          }}
        >
          <Grid sx={{ padding: ".5rem .75rem", width: "16rem" }}>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_XL,
                fontWeight: "600",
              }}
            >
              Filter
            </Typography>
            <p
              style={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
                margin: "5px 0px",
              }}
            >
              Total Debt
            </p>
            <input
              min={0}
              style={{
                width: "45%",
                padding: "7px 5px",
                borderRadius: "5px",
                backgroundColor: Colors.BG_LIGHT_GRAY,
                border: "none",
                outline: "none",
                fontSize: FONT_SIZE_LARGE,
                fontFamily: "Nunito",
                color: Colors.DIM_LIGHT_GRAY,
              }}
              placeholder="Min"
              type="number"
              value={totalDebtMin}
              onChange={handleInputChange(setTotalDebtMin)}
              onKeyDown={handleKeyDown}
            />
            <input
              min={0}
              style={{
                width: "45%",
                padding: "7px 5px",
                marginLeft: "10%",
                borderRadius: "5px",
                backgroundColor: Colors.BG_LIGHT_GRAY,
                border: "none",
                outline: "none",
                fontSize: FONT_SIZE_LARGE,
                fontFamily: "Nunito",
                color: Colors.DIM_LIGHT_GRAY,
              }}
              type="number"
              placeholder="Max"
              value={totalDebtMax}
              onChange={handleInputChange(setTotalDebtMax)}
              onKeyDown={handleKeyDown}
            />
            <p
              style={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
                margin: "5px 0px",
              }}
            >
              Total Cases
            </p>
            <input
              min={0}
              style={{
                width: "45%",
                padding: "7px 5px",
                borderRadius: "5px",
                backgroundColor: Colors.BG_LIGHT_GRAY,
                border: "none",
                outline: "none",
                fontSize: FONT_SIZE_LARGE,
                fontFamily: "Nunito",
                color: Colors.DIM_LIGHT_GRAY,
              }}
              value={totalCasesMin}
              type="number"
              placeholder="Min"
              onChange={handleInputChange(setTotalCasesMin)}
              onKeyDown={handleKeyDown}
            />
            <input
              min={0}
              style={{
                width: "45%",
                padding: "7px 5px",
                marginLeft: "10%",
                borderRadius: "5px",
                backgroundColor: Colors.BG_LIGHT_GRAY,
                border: "none",
                outline: "none",
                fontSize: FONT_SIZE_LARGE,
                fontFamily: "Nunito",
                color: Colors.DIM_LIGHT_GRAY,
              }}
              type="number"
              placeholder="Max"
              value={totalCasesMax}
              onChange={handleInputChange(setTotalCasesMax)}
              onKeyDown={handleKeyDown}
            />

            <p
              style={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
                margin: "5px 0px",
              }}
            >
              Total Debtors
            </p>
            <input
              min={0}
              style={{
                width: "45%",
                padding: "7px 5px",
                borderRadius: "5px",
                backgroundColor: Colors.BG_LIGHT_GRAY,
                border: "none",
                outline: "none",
                fontSize: FONT_SIZE_LARGE,
                fontFamily: "Nunito",
                color: Colors.DIM_LIGHT_GRAY,
              }}
              type="number"
              placeholder="Min"
              value={totalCreditorsMin}
              onChange={handleInputChange(setTotalCreditorsMin)}
              onKeyDown={handleKeyDown}
            />
            <input
              min={0}
              style={{
                width: "45%",
                padding: "7px 5px",
                marginLeft: "10%",
                borderRadius: "5px",
                backgroundColor: Colors.BG_LIGHT_GRAY,
                border: "none",
                outline: "none",
                fontSize: FONT_SIZE_LARGE,
                fontFamily: "Nunito",
                color: Colors.DIM_LIGHT_GRAY,
              }}
              type="number"
              placeholder="Max"
              value={totalCreditorsMax}
              onChange={handleInputChange(setTotalCreditorsMax)}
              onKeyDown={handleKeyDown}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <TextButton
                buttonText="Clear"
                height="2rem"
                width="45%"
                marginRight="10%"
                fontColor={Colors.BLACK}
                onClick={handleClear}
                disabled={disabled}
                backgroundColor={Colors.BG_LIGHT_GRAY}
                hoverColor={Colors.BG_LIGHT_GRAY}
              />
              <TextButton
                buttonText="Filter"
                height="2rem"
                width="45%"
                fontColor={Colors.BLACK}
                onClick={handleSave}
                disabled={applyDisabled}
                backgroundColor={Colors.BG_LIGHT_GRAY}
                hoverColor={Colors.BG_LIGHT_GRAY}
              />
            </div>
          </Grid>
        </Menu>
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          borderRadius: "10px ",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <>
          <ListTable
            headerData={headers}
            data={rows}
            onRowClick={handleRowClick}
            apiPagination={true}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            loading={loading}
          />
        </>
      </Grid>
    </Grid>
  );
}
