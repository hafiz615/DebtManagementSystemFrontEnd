import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import {
  Grid,
  Typography,
  Menu,
  IconButton,
  styled,
  Tabs,
  Tab,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import CustomTextField from "../components/customTextfield";

import {
  FONT_SIZE_SMALL,
  UserListPage,
  paymentAuthHeading,
} from "../constants/appConstants";
import { Colors } from "../config/default";
import PaymentsTabs from "./paymentsTabs";
import SearchBar from "./searchBar";
import {
  GetCreditorSuccessfulPayment,
  GetCreditorUpcomingPayment,
  GetHomePayments,
} from "../services/services";
import TextButton from "./button";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

const AntTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: Colors.SKY_BLUE,
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
      fontSize: "14px !important",
    },
    [theme.breakpoints.up("xs")]: {
      fontSize: FONT_SIZE_SMALL,
    },
    fontWeight: "500",
    color: Colors.DARK_GRAY,
    fontFamily: ["Nunito"].join(","),
    "&:hover": {
      color: Colors.SKY_BLUE,
      opacity: 1,
    },
    "&.Mui-selected": {
      color: Colors.SKY_BLUE,
      fontWeight: "500",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
  })
);

export default function AuthorizationDetails() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState({});
  const [value, setValue] = useState(0);
  const [mainTabValue, setMainTabValue] = useState(0);
  const [paginationRows, setPaginationRows] = useState("5");
  const [totalData, setTotalData] = useState();
  const totalPages = Math.ceil(totalData / paginationRows);
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
  const [loading, setLoading] = useState(false);

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

  const handleChange = (event, newValue) => {
    setMainTabValue(newValue);
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
    setLoading(true);
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

  const getHomeData = async (search, filter) => {
    let arrayName;
    let payload = {};
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
    const count = 0;
    const limit = paginationRows;

    if (mainTabValue === 0) {
      if (value === 0) {
        arrayName = "failedAuthorizations";
      } else if (value === 1) {
        arrayName = "successAuthorizations";
      } else if (value === 2) {
        arrayName = "successCaptures";
      } else if (value === 3) {
        arrayName = "failedCaptures";
      } else if (value === 4) {
        arrayName = "upcomingPayments";
      } else if (value === 5) {
        arrayName = "pendingCheckPayments";
      }
      const result = await GetHomePayments(
        count,
        currentPage,
        limit,
        arrayName,
        search,
        filter,
        payload
      );
      if (result?.status === 200) {
        setData(result?.data?.data?.payments || []);
        setTotalData(result?.data?.data?.counts[arrayName] || 0);
      } else if (
        result?.response?.status === 401 ||
        result?.response?.status === 403
      ) {
        localStorage.clear();
        navigate("/");
      }
    } else if (mainTabValue === 1 && value === 0) {
      const result = await GetCreditorSuccessfulPayment(
        count,
        currentPage,
        limit,
        search,
        filter,
        payload
      );
      if (result?.status === 200) {
        setData(result?.data?.data?.payments || []);
        setTotalData(result?.data?.data?.counts?.successPayments || 0);
      } else if (
        result?.response?.status === 401 ||
        result?.response?.status === 403
      ) {
        localStorage.clear();
        navigate("/");
      }
    } else if (mainTabValue === 1 && value === 1) {
      const result = await GetCreditorUpcomingPayment(
        count,
        currentPage,
        limit,
        search,
        filter,
        payload
      );
      if (result?.status === 200) {
        setData(result?.data?.data?.payments || []);
        setTotalData(result?.data?.data?.counts?.creditorUpcomingPayments || 0);
      } else if (
        result?.response?.status === 401 ||
        result?.response?.status === 403
      ) {
        localStorage.clear();
        navigate("/");
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!searchText) {
      setSearchActive(false);
    }
    if (searchText) {
      setLoading(true);
      setSearchActive(true);
      getHomeData(searchActive, filterActive);
    } else if (filterActive) {
      setLoading(true);
      getHomeData(searchActive, filterActive);
    } else if (!searchText && !filterActive) {
      getHomeData(false, false);
    }
  }, [
    currentPage,
    searchText,
    saveState,
    filterActive,
    searchActive,
    mainTabValue,
  ]);

  useEffect(() => {
    setValue(0);
  }, [mainTabValue]);

  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    setSearchText("");
    setSearchActive(false);
    handleClear();
  }, [value]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterActive, searchActive]);

  useEffect(() => {
    setCurrentPage(1);
    getHomeData("", "");
  }, [paginationRows]);

  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        padding: "0 2rem",
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
          {paymentAuthHeading}
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
              sx={{
                color: Colors.DARK_GRAY,
                fontSize: { xs: "20px", sm: "30px" },
              }}
            />
          </IconButton>
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: "1.5rem",
          width: { xs: "65vw", sm: "auto" },
        }}
      >
        <AntTabs
          value={mainTabValue}
          onChange={handleChange}
          aria-label="ant example"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            width: { xs: "100%", md: "70rem" },
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <AntTab
            sx={{
              bgcolor: Colors.WHITE,
              width: { xs: "30%", sm: "max-content" },
              fontWeight: "600",
              height: "3.5rem",
            }}
            label="Client"
          />

          <AntTab
            sx={{
              bgcolor: Colors.WHITE,
              width: { xs: "30%", sm: "max-content" },
              fontWeight: "600",
              height: "3.5rem",
            }}
            label="Creditor"
          />
        </AntTabs>
        <PaymentsTabs
          loading={loading}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          data={data}
          value={value}
          hideCheck={value}
          setValue={setValue}
          getHomeData={getHomeData}
          paginationRows={paginationRows}
          setPaginationRows={setPaginationRows}
          mainTabValue={mainTabValue}
        />
      </Grid>
      {/* tesr */}
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
