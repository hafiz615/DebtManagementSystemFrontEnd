import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { isEmpty } from "lodash";

import {
  Grid,
  Typography,
  Card,
  CircularProgress,
  IconButton,
  Menu,
} from "@mui/material";
import { LineChart, PieChart, BarChart } from "@mui/x-charts";

import { Colors } from "../../config/default";
import SpinnerWithPercentage from "../spinnerWithPercentage";
import { GetDashboard } from "../../services/services";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import TextButton from "../button";
import CustomTextField from "../customTextfield";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_XL,
  PAGE_HEIGHT,
} from "../../constants/appConstants";
import ScrollbarStyles from "../customScroll";

function DashboardContent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filterActive, setFilterActive] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applyDisabled, setApplyDisabled] = useState(true);
  const [saveState, setSaveState] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [dashboardData, setDashboardData] = useState({});
  const userName = useSelector((state) => state?.signIn?.signIn?.user?.name);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split(".")[0] + ".000Z";
  };

  const createFilterObject = (startDate, endDate) => {
    const filter = {};
    if (
      startDate !== null &&
      startDate !== "" &&
      endDate !== null &&
      endDate !== ""
    ) {
      filter.date = {
        start: formatDate(startDate),
        end: formatDate(endDate),
      };
    }

    return filter;
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSave = () => {
    handleClose();
    setSaveState(!saveState);
    setFilterActive(true);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setFilterActive(false);
    handleClose();
    dashBoard(false);
  };

  const disabled = !startDate && !endDate;

  const isPairComplete = (min, max) => {
    return (min !== "" && max !== "") || (min === "" && max === "");
  };

  useEffect(() => {
    const allPairsValid = isPairComplete(startDate, endDate);
    const anyPairFilled = startDate !== "" && endDate !== "";

    setApplyDisabled(!(allPairsValid && anyPairFilled));
  }, [startDate, endDate]);

  const dashBoard = async (filter) => {
    setLoading(true);
    let payload = {};
    const filterObj = createFilterObject(startDate, endDate);

    payload = {
      filter: filter ? filterObj : {},
    };
    const GetDashboardContent = await GetDashboard(filter, payload);
    if (GetDashboardContent?.status === 200) {
      setDashboardData(GetDashboardContent?.data?.data);
    } else if (
      GetDashboardContent?.response?.status === 401 ||
      GetDashboardContent?.response?.status === 403
    ) {
      localStorage.clear();
      navigate("/");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (filterActive) {
      dashBoard(filterActive);
    } else if (!filterActive) {
      dashBoard(false);
    }
  }, [saveState, filterActive]);

  const countData = dashboardData?.statusCounts
    ?.filter((item) => item?.count > 0)
    ?.map((item, i) => ({
      id: i,
      value: item?.count,
      label: item?.label,
    }));
  const processedData = dashboardData?.casesByDate?.map((item) => ({
    date: item?.date,
    value: item?.count,
  }));
  const percentageData = dashboardData?.paidAmounts?.map((item, i) => ({
    id: i,
    caseCode: item?.caseCode,
    value: item?.paidPercentage,
  }));
  const valueFormatter = (value) => value;
  const percentageValues = percentageData?.map((item) => item.value);
  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        paddingLeft: "2rem",
        paddingRight: "2rem",
        height: PAGE_HEIGHT,
        overflowY: "auto",
        ...ScrollbarStyles,
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
            height: "90vh",
          }}
        >
          <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : (
        <>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              marginTop: ".5rem",
              alignItems: "center",
              mt: "2em",
            }}
          >
            <Grid item xs={8}>
              <div style={{ display: "flex" }}>
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "2rem",
                    fontFamily: "Nunito",
                    color: Colors.BLACK,
                  }}
                >
                  Hi
                </Typography>
                <Typography
                  sx={{
                    color: Colors.SKY_BLUE,
                    fontSize: "2rem",
                    ml: "10px",
                    fontWeight: "800",
                    fontFamily: "Nunito",
                  }}
                >
                  {userName},
                </Typography>
              </div>
              <div>
                <Typography
                  style={{ color: Colors.DIM_LIGHT_GRAY, fontFamily: "Nunito" }}
                >
                  You can manage your whole team from here.
                </Typography>
              </div>
            </Grid>
            <Grid container sx={{ justifyContent: "flex-end" }}>
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
            </Grid>
          </Grid>

          <Grid container sx={{ mt: "1rem" }}>
            <Grid item xs={12} lg={8}>
              <Card
                sx={{
                  width: { xs: "100%", lg: "95%" },
                  backgroundColor: Colors.WHITE,
                  height: "20rem",
                  borderRadius: "16px",
                  boxShadow: "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "600",
                      fontFamily: "Nunito",
                    }}
                  >
                    Payments & Authorizations
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontFamily: "Nunito",
                      color: Colors.DIM_LIGHT_GRAY,
                    }}
                  >
                    Year{" "}
                    <span style={{ color: Colors.BLACK, fontSize: "16px" }}>
                      2024
                    </span>
                  </Typography>
                </div>
                <hr style={{ background: "lightgrey" }} />
                <Grid
                  container
                  sx={{
                    marginTop: "1rem",
                    height: "16rem",
                    gap: { xs: "1em", md: "0" },
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: "10px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#E5E5E5",
                      borderRadius: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: Colors.WHITE,
                      borderRadius: "8px",
                    },
                  }}
                >
                  {!isEmpty(dashboardData?.paymentStats) ? (
                    <>
                      <Grid
                        item
                        xs={12}
                        md={3}
                        sx={{
                          flexDirection: "column",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SpinnerWithPercentage
                          value={
                            dashboardData?.paymentStats[0]
                              ?.totalFailedAuthorizations
                          }
                          color={Colors.ORANGE_COLOR}
                        />
                        <Typography
                          style={{
                            fontSize: "14px",
                            fontFamily: "Nunito",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "2rem",
                          }}
                        >
                          Failed Authorizations
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={3}
                        sx={{
                          flexDirection: "column",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SpinnerWithPercentage
                          value={
                            dashboardData?.paymentStats[0]?.totalFailedPayments
                          }
                          color={Colors.YELLOW}
                        />
                        <Typography
                          style={{
                            fontSize: "14px",
                            fontFamily: "Nunito",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "2rem",
                          }}
                        >
                          Failed Payments
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={3}
                        sx={{
                          flexDirection: "column",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SpinnerWithPercentage
                          color={Colors.SKY_BLUE}
                          value={
                            dashboardData?.paymentStats[0]
                              ?.totalSuccessfulAuthorizations
                          }
                        />
                        <Typography
                          style={{
                            fontSize: "14px",
                            fontFamily: "Nunito",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "2rem",
                          }}
                        >
                          Successful Authorizations
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={3}
                        sx={{
                          flexDirection: "column",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SpinnerWithPercentage
                          value={
                            dashboardData?.paymentStats[0]
                              ?.totalSuccessfulPayments
                          }
                          color={Colors.NAVY_BLUE}
                        />
                        <Typography
                          style={{
                            fontSize: "14px",
                            fontFamily: "Nunito",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "2rem",
                          }}
                        >
                          Successful Payments
                        </Typography>
                      </Grid>
                    </>
                  ) : (
                    <></>
                  )}
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4} sx={{ mt: { xs: "1rem", lg: "0" } }}>
              <Card
                sx={{
                  backgroundColor: Colors.WHITE,
                  height: "20rem",
                  borderRadius: "16px",
                  boxShadow: "none",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "600",
                    padding: "10px 16px",
                    fontFamily: "Nunito",
                  }}
                >
                  Case Status
                </Typography>
                <hr style={{ background: "lightgrey" }} />

                <div style={{ height: "10rem" }}>
                  {!isEmpty(countData) ? (
                    <PieChart
                      sx={{ width: "100%", ml: { xs: "3rem", sm: "0" } }}
                      slotProps={{
                        legend: {
                          direction: "column",
                          itemGap: 6,
                          padding: 40,
                          labelStyle: {
                            fontSize: "14px",
                            fontFamily: "Nunito",
                          },
                        },
                      }}
                      series={[
                        {
                          data: countData,
                          highlightScope: {
                            faded: "global",
                            highlighted: "item",
                          },
                        },
                      ]}
                      margin={{
                        top: 10,
                        bottom: 40,
                        left: 0,
                        right: 150,
                      }}
                      height={250}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Nunito",
                      }}
                    >
                      No Record
                    </div>
                  )}
                </div>
              </Card>
            </Grid>
          </Grid>

          <Grid container sx={{ m: "1rem 0rem" }}>
            <Grid item xs={12} lg={8} sx={{ mt: { xs: "1rem", lg: "0" } }}>
              <Card
                sx={{
                  width: { xs: "100%", lg: "95%" },
                  backgroundColor: Colors.WHITE,
                  height: "20rem",
                  borderRadius: "16px",
                  boxShadow: "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "600",
                      fontFamily: "Nunito",
                    }}
                  >
                    Case By Agents
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontFamily: "Nunito",
                      color: Colors.DIM_LIGHT_GRAY,
                    }}
                  >
                    Year{" "}
                    <span style={{ color: Colors.BLACK, fontSize: "16px" }}>
                      2024
                    </span>
                  </Typography>
                </div>
                <hr style={{ background: "lightgrey" }} />
                <div style={{ height: "9rem" }}>
                  {!isEmpty(processedData) ? (
                    <LineChart
                      sx={{ width: "100%" }}
                      xAxis={[{ scaleType: "point", dataKey: "date" }]}
                      dataset={processedData}
                      xAxisType="date"
                      yAxisType="date"
                      xAxisKey="value"
                      yAxisKey="value"
                      series={[
                        {
                          dataKey: "value",
                          curve: "linear",
                          showMark: false,
                        },
                      ]}
                      height={265}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Nunito",
                      }}
                    >
                      No Record
                    </div>
                  )}
                </div>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4} sx={{ mt: { xs: "1rem", lg: "0" } }}>
              <Card
                sx={{
                  backgroundColor: Colors.WHITE,
                  height: "20rem",
                  borderRadius: "16px",
                  boxShadow: "none",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "600",
                    padding: "10px 16px",
                    fontFamily: "Nunito",
                  }}
                >
                  Case Trend
                </Typography>
                <hr style={{ background: "lightgrey" }} />
                <div>
                  {!isEmpty(percentageData) ? (
                    <BarChart
                      sx={{ width: "100%" }}
                      dataset={percentageData}
                      xAxis={[
                        {
                          scaleType: "band",
                          dataKey: "caseCode",
                        },
                      ]}
                      series={[
                        {
                          data: percentageValues,
                          valueFormatter,
                          datakey: "value",
                          color: Colors.SKY_BLUE,
                          highlightScope: {
                            highlighted: { additionalRadius: 10 },
                          },
                        },
                      ]}
                      height={270}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Nunito",
                      }}
                    >
                      No Record
                    </div>
                  )}
                </div>
              </Card>
            </Grid>
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
                Date
              </p>
              <CustomTextField
                type="date"
                width="100%"
                paddingLeft="4px"
                onChange={(e) => setStartDate(e.target.value)}
                value={startDate}
              />
              <CustomTextField
                type="date"
                width="100%"
                paddingLeft="4px"
                onChange={(e) => setEndDate(e.target.value)}
                value={endDate}
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

export default DashboardContent;
