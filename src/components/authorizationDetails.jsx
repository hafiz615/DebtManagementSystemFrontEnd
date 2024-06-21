import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Grid, Typography, Menu, IconButton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import CustomTextField from "../components/customTextfield";

import { UserListPage } from "../constants/appConstants";
import { Colors } from "../config/default";
import PaymentsTabs from "./paymentsTabs";
import SearchBar from "./searchBar";
import { GetHomePayments } from "../services/services";
import TextButton from "./button";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

export default function AuthorizationDetails() {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState({});
  const [value, setValue] = useState(0);
  const [totalData, setTotalData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchActive, setSearchActive] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [saveState, setSaveState] = useState(false);
  const [totalDebtMin, setTotalDebtMin] = useState("");
  const [totalDebtMax, setTotalDebtMax] = useState("");
  const [tryDateMin, setTryDateMin] = useState("");
  const [tryDateMax, setTryDateMax] = useState("");
  const [dueDateMin, setDueDateMin] = useState("");
  const [dueDateMax, setDueDateMax] = useState("");
  const [applyDisabled, setApplyDisabled] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split(".")[0] + ".000Z";
  };

  const createFilterObject = (
    totalDebtMin,
    totalDebtMax,
    tryDateMin,
    tryDateMax,
    dueDateMin,
    dueDateMax
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
      tryDateMin !== null &&
      tryDateMin !== "" &&
      tryDateMax !== null &&
      tryDateMax !== ""
    ) {
      filter.tryDate = {
        start: formatDate(tryDateMin),
        end: formatDate(tryDateMax),
      };
    }
    if (
      dueDateMin !== null &&
      dueDateMin !== "" &&
      dueDateMax !== null &&
      dueDateMax !== ""
    ) {
      filter.dueDate = {
        start: formatDate(dueDateMin),
        end: formatDate(dueDateMax),
      };
    }
    return filter;
  };

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
    setTryDateMin("");
    setTryDateMax("");
    setDueDateMin("");
    setDueDateMax("");
    setFilterActive(false);
    handleClose();
    getHomeData(searchActive, false);
  };

  const disabled =
    !tryDateMin &&
    !tryDateMax &&
    !dueDateMin &&
    !dueDateMax &&
    !totalDebtMin &&
    !totalDebtMax;

  const isPairComplete = (min, max) => {
    return (min !== "" && max !== "") || (min === "" && max === "");
  };

  useEffect(() => {
    const allPairsValid =
      isPairComplete(totalDebtMin, totalDebtMax) &&
      isPairComplete(tryDateMin, tryDateMax) &&
      isPairComplete(dueDateMin, dueDateMax);

    const anyPairFilled =
      (totalDebtMin !== "" && totalDebtMax !== "") ||
      (tryDateMin !== "" && tryDateMax !== "") ||
      (dueDateMin !== "" && dueDateMax !== "");

    setApplyDisabled(!(allPairsValid && anyPairFilled));
  }, [
    totalDebtMin,
    totalDebtMax,
    tryDateMin,
    tryDateMax,
    dueDateMin,
    dueDateMax,
  ]);

  const count = localStorage.getItem("dayCount");

  const getHomeData = async (search, filter) => {
    let arrayName;
    let payload = {};
    if (value === 0) {
      arrayName = "failedAuthorizations";
    } else if (value === 1) {
      arrayName = "successAuthorizations";
    } else if (value === 2) {
      arrayName = "failedPayments";
    } else if (value === 3) {
      arrayName = "successPayments";
    } else if (value === 4) {
      arrayName = "upcomingPayments";
    }
    const filterObj = createFilterObject(
      totalDebtMin,
      totalDebtMax,
      tryDateMin,
      tryDateMax,
      dueDateMin,
      dueDateMax
    );
    payload = {
      text: search ? searchText : "",
      filters: filter ? filterObj : {},
    };
    const result = await GetHomePayments(
      count,
      currentPage,
      arrayName,
      search,
      filter,
      payload
    );
    setData(result?.data?.data?.payments);
    setTotalData(result?.data?.data?.counts[arrayName]);
  };

  useEffect(() => {
    if (searchText) {
      setSearchActive(true);
      getHomeData(searchActive, filterActive);
    } else if (filterActive) {
      getHomeData(searchActive, filterActive);
    } else if (!searchText && !filterActive) {
      getHomeData(false, false);
    }
  }, [currentPage, searchText, saveState, filterActive, searchActive]);

  useEffect(() => {
    setCurrentPage(1);
    handleClear();
    setSearchText("");
    getHomeData(false, false);
  }, [value]);

  const totalPages = Math.ceil(totalData / 5);

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
          display: "flex",
          marginTop: "1.5rem",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: "1rem", sm: "0" },
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
          Payments Authorization
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <SearchBar
            searchCheck={true}
            searchingText={searchText}
            handleKeyPress={handleKeyPress}
            placeholder="Search..."
          />
          <IconButton
            id="demo-positioned-button"
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <FilterListOutlinedIcon
              sx={{ color: Colors.DARK_GRAY, fontSize: "30px" }}
            />
          </IconButton>
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: "1.5rem",
        }}
      >
        <PaymentsTabs
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          data={data}
          value={value}
          setValue={setValue}
        />
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
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Filter
          </Typography>
          <p
            style={{
              fontFamily: "Nunito",
              fontSize: "14px",
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
              fontSize: "14px",
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
              fontSize: "14px",
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
              fontSize: "14px",
              margin: "5px 0px",
            }}
          >
            Try Date
          </p>
          <CustomTextField
            type="date"
            width="100%"
            paddingLeft="4px"
            onChange={(e) => setTryDateMin(e.target.value)}
            value={tryDateMin}
          />
          <CustomTextField
            type="date"
            width="100%"
            paddingLeft="4px"
            onChange={(e) => setTryDateMax(e.target.value)}
            value={tryDateMax}
          />
          {value === 4 && (
            <>
              <p
                style={{
                  fontFamily: "Nunito",
                  fontSize: "14px",
                  margin: "5px 0px",
                }}
              >
                Due Date
              </p>
              <CustomTextField
                type="date"
                width="100%"
                paddingLeft="4px"
                onChange={(e) => setDueDateMin(e.target.value)}
                value={dueDateMin}
              />
              <CustomTextField
                type="date"
                width="100%"
                paddingLeft="4px"
                onChange={(e) => setDueDateMax(e.target.value)}
                value={dueDateMax}
              />
            </>
          )}

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
  );
}
