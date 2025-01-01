import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Grid,
  Typography,
  Box,
  CircularProgress,
  Menu,
  Tooltip,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  FONT_SIZE_MEDIUM,
  FONT_SIZE_XL,
  PAGE_HEIGHT,
  UserListPage,
} from "../constants/appConstants";
import { Colors } from "../config/default";
import CaseHistory from "./caseHistory";
import { GetClientById, GetCreditorById } from "../services/services";
import { isEmpty } from "lodash";
import { formatDollarAmount } from "../common";
import TextButton from "./button";
import CustomTextField from "./customTextfield";
import ScrollbarStyles from "./customScroll";
import { truncateText } from "../common";

export default function ClientListDetails() {
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const [clientData, setClientData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [totalData, setTotalData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [caseHistory, setCaseHistory] = useState([]);
  const [paginationRows, setPaginationRows] = useState("5");
  const totalPages = Math.ceil(totalData / paginationRows);
  const [tableLoading, setTableLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  const [totalDebtMin, setTotalDebtMin] = useState("");
  const [totalDebtMax, setTotalDebtMax] = useState("");

  const [lastPaymentMin, setLastPaymentMin] = useState("");
  const [lastPaymentMax, setLastPaymentMax] = useState("");

  const [lastPaymentDateMin, setLastPaymentDateMin] = useState("");
  const [lastPaymentDateMax, setLastPaymentDateMax] = useState("");

  const [upcomingPaymentMin, setUpcomingPaymentMin] = useState("");
  const [upcomingPaymentMax, setUpcomingPaymentMax] = useState("");

  const [upcomingPaymentDateMin, setUpcomingPaymentDateMin] = useState("");
  const [upcomingPaymentDateMax, setUpcomingPaymentDateMax] = useState("");

  const [outstandingDebtMin, setOutstandingDebtMin] = useState("");
  const [outstandingDebtMax, setOutstandingDebtMax] = useState("");

  const [applyDisabled, setApplyDisabled] = useState(true);
  const [saveState, setSaveState] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { userRole, id } = useParams();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split(".")[0] + ".000Z";
  };

  const createFilterObject = (
    totalDebtMin,
    totalDebtMax,
    lastPaymentMin,
    lastPaymentMax,
    outstandingDebtMin,
    outstandingDebtMax,
    upcomingPaymentMin,
    upcomingPaymentMax,
    lastPaymentDateMin,
    lastPaymentDateMax,
    upcomingPaymentDateMin,
    upcomingPaymentDateMax
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
      lastPaymentMin !== null &&
      lastPaymentMin !== "" &&
      lastPaymentMax !== null &&
      lastPaymentMax !== ""
    ) {
      filter.lastPaymentAmount = {
        min: parseInt(lastPaymentMin),
        max: parseInt(lastPaymentMax),
      };
    }
    if (
      outstandingDebtMin !== null &&
      outstandingDebtMin !== "" &&
      outstandingDebtMax !== null &&
      outstandingDebtMax !== ""
    ) {
      filter.outstandingDebt = {
        min: parseInt(outstandingDebtMin),
        max: parseInt(outstandingDebtMax),
      };
    }
    if (
      upcomingPaymentMin !== null &&
      upcomingPaymentMin !== "" &&
      upcomingPaymentMax !== null &&
      upcomingPaymentMax !== ""
    ) {
      filter.upcomingPaymentAmount = {
        min: parseInt(upcomingPaymentMin),
        max: parseInt(upcomingPaymentMax),
      };
    }

    if (
      lastPaymentDateMin !== null &&
      lastPaymentDateMin !== "" &&
      lastPaymentDateMax !== null &&
      lastPaymentDateMax !== ""
    ) {
      filter.lastPaymentDate = {
        start: formatDate(lastPaymentDateMin),
        end: formatDate(lastPaymentDateMax),
      };
    }

    if (
      upcomingPaymentDateMin !== null &&
      upcomingPaymentDateMin !== "" &&
      upcomingPaymentDateMax !== null &&
      upcomingPaymentDateMax !== ""
    ) {
      filter.upcomingPaymentDate = {
        start: formatDate(upcomingPaymentDateMin),
        end: formatDate(upcomingPaymentDateMax),
      };
    }

    return filter;
  };

  const searchClientDetails = async (search, filter) => {
    setTableLoading(true);
    setCaseHistory([]);
    let payload = {};

    const filterObj = createFilterObject(
      totalDebtMin,
      totalDebtMax,
      lastPaymentMin,
      lastPaymentMax,
      outstandingDebtMin,
      outstandingDebtMax,
      upcomingPaymentMin,
      upcomingPaymentMax,
      lastPaymentDateMin,
      lastPaymentDateMax,
      upcomingPaymentDateMin,
      upcomingPaymentDateMax
    );
    payload = {
      text: search ? searchText : "",
      filters: filter ? filterObj : {},
    };
    let res;
    let page = currentPage;
    let limit = paginationRows;
    if (userRole === "client") {
      res = await GetClientById(id, search, filter, page, limit, payload);
    } else {
      res = await GetCreditorById(id, search, filter, page, limit, payload);
    }
    if (res?.status === 200) {
      setCaseHistory(res?.data?.data?.caseHistory);
      if (userRole === "client") {
        setTotalData(res?.data?.data?.debtorTotalCases);
      } else {
        setTotalData(res?.data?.data?.creditorTotalCases);
      }
    }
    setTableLoading(false);
  };

  const GetClientDetails = async () => {
    setLoading(true);
    let filter = false;
    let search = false;
    let payload = {
      text: "",
      filters: {},
    };

    let getClientData;
    let page = currentPage;
    let limit = paginationRows;
    if (userRole === "client") {
      getClientData = await GetClientById(
        id,
        search,
        filter,
        page,
        limit,
        payload
      );
    } else {
      getClientData = await GetCreditorById(
        id,
        search,
        filter,
        page,
        limit,
        payload
      );
    }
    if (getClientData?.status === 200) {
      setClientData(getClientData?.data?.data);

      setCaseHistory(getClientData?.data?.data?.caseHistory);
      if (userRole === "client") {
        setTotalData(getClientData?.data?.data?.debtorTotalCases);
      } else {
        setTotalData(getClientData?.data?.data?.creditorTotalCases);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!searchText) {
      setSearchActive(false);
    }
    if (searchText) {
      setSearchActive(true);
      searchClientDetails(searchActive, filterActive);
    } else if (filterActive) {
      searchClientDetails(searchActive, filterActive);
    } else if (!searchText && !filterActive) {
      searchClientDetails(false, false);
    }
  }, [currentPage, searchText, saveState, filterActive, searchActive]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterActive, searchActive]);

  useEffect(() => {
    GetClientDetails();
  }, []);

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
    setLastPaymentMin("");
    setLastPaymentMax("");
    setOutstandingDebtMin("");
    setOutstandingDebtMax("");
    setUpcomingPaymentMin("");
    setUpcomingPaymentMax("");
    setLastPaymentDateMin("");
    setLastPaymentDateMax("");
    setUpcomingPaymentDateMin("");
    setUpcomingPaymentDateMax("");

    setFilterActive(false);
    handleClose();
    searchClientDetails(searchActive, false);
  };

  const disabled =
    !lastPaymentMin &&
    !lastPaymentMax &&
    !outstandingDebtMin &&
    !outstandingDebtMax &&
    !totalDebtMin &&
    !totalDebtMax &&
    !upcomingPaymentMin &&
    !upcomingPaymentMax &&
    !lastPaymentDateMin &&
    !lastPaymentDateMax &&
    !upcomingPaymentDateMin &&
    !upcomingPaymentDateMax;

  const isPairComplete = (min, max) => {
    return (min !== "" && max !== "") || (min === "" && max === "");
  };

  useEffect(() => {
    const allPairsValid =
      isPairComplete(totalDebtMin, totalDebtMax) &&
      isPairComplete(lastPaymentMin, lastPaymentMax) &&
      isPairComplete(outstandingDebtMin, outstandingDebtMax) &&
      isPairComplete(upcomingPaymentMin, upcomingPaymentMax) &&
      isPairComplete(lastPaymentDateMin, lastPaymentDateMax) &&
      isPairComplete(upcomingPaymentDateMin, upcomingPaymentDateMax);

    const anyPairFilled =
      (totalDebtMin !== "" && totalDebtMax !== "") ||
      (lastPaymentMin !== "" && lastPaymentMax !== "") ||
      (outstandingDebtMin !== "" && outstandingDebtMax !== "") ||
      (upcomingPaymentMin !== "" && upcomingPaymentMax !== "") ||
      (lastPaymentDateMin !== "" && lastPaymentDateMax !== "") ||
      (upcomingPaymentDateMin !== "" && upcomingPaymentDateMax !== "");

    setApplyDisabled(!(allPairsValid && anyPairFilled));
  }, [
    totalDebtMin,
    totalDebtMax,
    lastPaymentMin,
    lastPaymentMax,
    outstandingDebtMin,
    outstandingDebtMax,
    upcomingPaymentMin,
    upcomingPaymentMax,
    lastPaymentDateMin,
    lastPaymentDateMax,
    upcomingPaymentDateMin,
    upcomingPaymentDateMax,
  ]);

  const { AUTHORITY_TEXT } = UserListPage;
  const dataUser = clientData?.debtor || clientData?.creditor;
  const infoItems = [
    { label: "Name", value: truncateText(dataUser?.fullName, 25) || "--" },
    {
      label: "Current Balance",
      value: formatDollarAmount(dataUser?.totalRemaining) || "--",
    },
  ];

  if (userRole === "client") {
    infoItems.push({ label: "Address", value: dataUser?.address || "--" });
  }
  const financialInfo = [
    ...(userRole === "client"
      ? [
          {
            label: "Account Status",
            value: dataUser?.status || "--",
          },
          {
            label: "Weekly Budget",
            value: formatDollarAmount(dataUser?.weeklyBudget) || "--",
          },
        ]
      : []),
  ];

  useEffect(() => {
    setCurrentPage(1);
    GetClientDetails("", "");
  }, [paginationRows]);
  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        paddingLeft: "2rem",
        paddingRight: "2rem",
        maxHeight: PAGE_HEIGHT,
        overflowY: "auto",
        ...ScrollbarStyles,
      }}
    >
      {loading || isEmpty(clientData) ? (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "90vh",
          }}
        >
          <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : (
        <>
          <Grid
            container
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
            container
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
              {clientData?.debtor?.companyName ||
                clientData?.creditor?.fullName}
            </Typography>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sx={{
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <Grid
              container
              item
              xs={12}
              lg={6}
              sx={{
                justifyContent: {
                  xs: "left",
                  md: "space-evenly",
                },
              }}
            >
              <Grid item xs={12} lg={6}>
                {infoItems?.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: { xs: "space-between", md: "unset" },
                      marginBottom: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Nunito",
                        fontWeight: "600",
                        color: Colors.DARK_GRAY,
                        width: "6rem",
                        width: "50%",
                      }}
                    >
                      {item?.label}
                    </Typography>
                    <Tooltip title={item?.value || ""} placement="top-end">
                      <span
                        style={{
                          fontFamily: "Nunito",
                          fontWeight: "300",
                          fontSize: "0.9rem",
                          color: Colors.DIM_LIGHT_GRAY,
                        }}
                      >
                        {truncateText(item?.value, 15) || "--"}
                      </span>
                    </Tooltip>
                  </Box>
                ))}
              </Grid>

              <Grid item xs={12} lg={6}>
                {financialInfo?.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: { xs: "space-between", md: "unset" },
                      marginBottom: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Nunito",
                        fontWeight: "600",
                        color: Colors.DARK_GRAY,
                        width: "10rem",
                      }}
                    >
                      {item?.label}
                    </Typography>
                    <Tooltip title={item?.value || ""} placement="top-end">
                      <span
                        style={{
                          fontFamily: "Nunito",
                          fontWeight: "300",
                          fontSize: "0.9rem",
                          color: Colors.DIM_LIGHT_GRAY,
                          marginLeft: ".5rem",
                        }}
                      >
                        {truncateText(item?.value, 15)}
                      </span>
                    </Tooltip>
                  </Box>
                ))}
              </Grid>
            </Grid>

            <Grid
              container
              item
              xs={12}
              lg={6}
              sx={{
                justifyContent: "space-between",
                mt: { xs: "1rem", lg: "0" },
              }}
            >
              <Grid
                container
                sx={{
                  justifyContent: { xs: "space-between", lg: "space-evenly" },
                }}
              >
                {[
                  {
                    title: "Failed Captures",
                    value: clientData?.paymentCounts?.failedCaptures,
                    color: Colors.BLACK,
                  },
                  {
                    title: "Failed Authorizations",
                    value: clientData?.paymentCounts?.failedAuthorizations,
                    color: Colors.BLACK,
                  },
                  {
                    title: "Successful Payments",
                    value: clientData?.paymentCounts?.successfulPayments,
                    color: Colors.SKY_BLUE,
                  },
                  {
                    title: "Successful Authorizations",
                    value: clientData?.paymentCounts?.successfulAuthorizations,
                    color: Colors.SKY_BLUE,
                  },
                  {
                    title: "Successful Captures",
                    value: clientData?.paymentCounts?.successfulCaptures,
                    color: Colors.SKY_BLUE,
                  },
                  {
                    title: "Weeks Remaining",
                    value: clientData?.maxWeekRemaining || "00",
                    color: Colors.SKY_BLUE,
                  },
                ]?.map((item, index) => (
                  <Grid
                    key={index}
                    container
                    item
                    xs={5}
                    lg={5}
                    sx={{
                      backgroundColor: Colors?.WHITE,
                      justifyContent: "space-around",
                      alignItems: "center",
                      borderRadius: "10px",
                      marginBottom: "1rem",
                    }}
                  >
                    <Typography
                      sx={{
                        width: "7rem",
                        paddingTop: { xs: "0.3rem", sm: "auto" },
                        paddingLeft: { xs: "0.5rem", sm: "auto" },
                        fontSize: { xs: FONT_SIZE_MEDIUM, sm: FONT_SIZE_XL },
                      }}
                    >
                      {item?.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: item.color,
                        fontWeight: "700",
                        fontFamily: "Nunito",
                        fontSize: "3rem",
                      }}
                    >
                      {String(item?.value).padStart(2, "0")}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <CaseHistory
              open={open}
              handleClick={handleClick}
              tableLoading={tableLoading}
              searchText={searchText}
              handleKeyPress={handleKeyPress}
              data={caseHistory}
              userRole={userRole}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              paginationRows={paginationRows}
              setPaginationRows={setPaginationRows}
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
                Last Payment Amount
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
                value={lastPaymentMin}
                type="number"
                placeholder="Min"
                onChange={handleInputChange(setLastPaymentMin)}
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
                value={lastPaymentMax}
                onChange={handleInputChange(setLastPaymentMax)}
                onKeyDown={handleKeyDown}
              />

              <p
                style={{
                  fontFamily: "Nunito",
                  fontSize: "14px",
                  margin: "5px 0px",
                }}
              >
                Last Payment Date
              </p>
              <CustomTextField
                type="date"
                width="100%"
                paddingLeft="4px"
                onChange={(e) => setLastPaymentDateMin(e.target.value)}
                value={lastPaymentDateMin}
              />
              <CustomTextField
                type="date"
                width="100%"
                paddingLeft="4px"
                onChange={(e) => setLastPaymentDateMax(e.target.value)}
                value={lastPaymentDateMax}
              />

              <p
                style={{
                  fontFamily: "Nunito",
                  fontSize: "14px",
                  margin: "5px 0px",
                }}
              >
                Upcoming Payment Amount
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
                type="number"
                placeholder="Min"
                value={upcomingPaymentMin}
                onChange={handleInputChange(setUpcomingPaymentMin)}
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
                value={upcomingPaymentMax}
                onChange={handleInputChange(setUpcomingPaymentMax)}
                onKeyDown={handleKeyDown}
              />

              <p
                style={{
                  fontFamily: "Nunito",
                  fontSize: "14px",
                  margin: "5px 0px",
                }}
              >
                Upcoming Payment Date
              </p>
              <CustomTextField
                type="date"
                width="100%"
                paddingLeft="4px"
                onChange={(e) => setUpcomingPaymentDateMin(e.target.value)}
                value={upcomingPaymentDateMin}
              />
              <CustomTextField
                type="date"
                width="100%"
                paddingLeft="4px"
                onChange={(e) => setUpcomingPaymentDateMax(e.target.value)}
                value={upcomingPaymentDateMax}
              />

              <p
                style={{
                  fontFamily: "Nunito",
                  fontSize: "14px",
                  margin: "5px 0px",
                }}
              >
                Current Balance
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
                type="number"
                placeholder="Min"
                value={outstandingDebtMin}
                onChange={handleInputChange(setOutstandingDebtMin)}
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
                value={outstandingDebtMax}
                onChange={handleInputChange(setOutstandingDebtMax)}
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
        </>
      )}
    </Grid>
  );
}
