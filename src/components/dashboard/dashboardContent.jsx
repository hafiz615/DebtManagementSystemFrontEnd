import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";

import { Grid, Typography, Card, CircularProgress } from "@mui/material";
import { LineChart, PieChart, BarChart } from "@mui/x-charts";

import { Colors } from "../../config/default";
import SearchBar from "../searchBar";
import SpinnerWithPercentage from "../spinnerWithPercentage";
import { GetDashboard } from "../../services/services";

function DashboardContent() {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const userName = useSelector((state) => state?.signIn?.signIn?.user?.name);

  const dashBoard = async () => {
    setLoading(true);
    const GetDashboardContent = await GetDashboard();
    if (GetDashboardContent?.status === 200) {
      setDashboardData(GetDashboardContent?.data?.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    dashBoard();
  }, []);

  const countData = dashboardData?.statusCounts?.map((item, i) => ({
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
              xs={12}
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
              <Grid
                item
                xs={12}
                md={3}
                sx={{
                  flexDirection: "column",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // display: { xs: "flex", md: "unset" },
                  // flexDirection: { xs: "column", md: "unset" },
                  // alignItems: { xs: "center", md: "center" },
                  // justifyContent: { xs: "center", md: "center" },
                }}
              >
                <SpinnerWithPercentage
                  value={100}
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
                  // display: { xs: "flex", md: "unset" },
                  // flexDirection: { xs: "column", md: "unset" },
                  // alignItems: { xs: "center", md: "center" },
                  // justifyContent: { xs: "center", md: "center" },
                }}
              >
                <SpinnerWithPercentage value={40} color={Colors.YELLOW} />
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
                  // display: { xs: "flex", md: "unset" },
                  // flexDirection: { xs: "column", md: "unset" },
                  // alignItems: { xs: "center", md: "unset" },
                  // justifyContent: { xs: "center", md: "unset" },
                }}
              >
                <SpinnerWithPercentage color={Colors.SKY_BLUE} value={70} />
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
              </div>
            </Grid>
            <Grid item xs={4}>
              <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
                placeholder="Search..."
              />
            </Grid>
          </Grid>

          <Grid container xs={12} sx={{ mt: "1rem" }}>
            <Grid item xs={12} lg={8}>
              <Card
                sx={{
                  // display: { xs: "flex", md: "unset" },
                  // flexDirection: { xs: "column", md: "unset" },
                  // alignItems: { xs: "center", md: "center" },
                  // justifyContent: { xs: "center", md: "center" },
                  flexDirection: "column",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SpinnerWithPercentage value={60} color={Colors.NAVY_BLUE} />
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
              <PieChart
                sx={{ width: "100%" }}
                margin={{ top: 10, bottom: 40, left: 10, right: 10 }}
                slotProps={{
                  legend: {
                    direction: "row",
                    position: { vertical: "bottom", horizontal: "middle" },
                    padding: 2,
                    labelStyle: {
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
                  xs={12}
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
                          // display: { xs: "flex", md: "unset" },
                          // flexDirection: { xs: "column", md: "unset" },
                          // alignItems: { xs: "center", md: "center" },
                          // justifyContent: { xs: "center", md: "center" },
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
                          // display: { xs: "flex", md: "unset" },
                          // flexDirection: { xs: "column", md: "unset" },
                          // alignItems: { xs: "center", md: "center" },
                          // justifyContent: { xs: "center", md: "center" },
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
                          // display: { xs: "flex", md: "unset" },
                          // flexDirection: { xs: "column", md: "unset" },
                          // alignItems: { xs: "center", md: "unset" },
                          // justifyContent: { xs: "center", md: "unset" },
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
                          // display: { xs: "flex", md: "unset" },
                          // flexDirection: { xs: "column", md: "unset" },
                          // alignItems: { xs: "center", md: "center" },
                          // justifyContent: { xs: "center", md: "center" },
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
                      sx={{ width: "100%" }}
                      series={[
                        {
                          data: countData,
                          highlightScope: {
                            faded: "global",
                            highlighted: "item",
                          },
                        },
                      ]}
                      margin={{ top: 10, bottom: 40, left: 10, right: 10 }}
                      slotProps={{
                        legend: { hidden: true },
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

          <Grid container xs={12} sx={{ m: "1rem 0rem" }}>
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
        </>
      )}
    </Grid>
  );
}

export default DashboardContent;
