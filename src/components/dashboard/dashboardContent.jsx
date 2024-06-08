import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Grid, Typography, Card } from "@mui/material";
import { LineChart, PieChart, BarChart } from "@mui/x-charts";

import { Colors } from "../../config/default";
import SearchBar from "../searchBar";
import SpinnerWithPercentage from "../spinnerWithPercentage";

function DashboardContent() {
  const [searchText, setSearchText] = useState("");
  const userName = useSelector((state) => state?.signIn?.signIn?.user?.name);

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
                    },
                  },
                }}
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        color: Colors.SKY_BLUE,
                        value: 15,
                        label: "Successful",
                      },
                      {
                        id: 1,
                        color: Colors.YELLOW,
                        value: 10,
                        label: "Failed",
                      },
                    ],

                    highlightScope: { faded: "global", highlighted: "item" },
                  },
                ]}
                height={250}
              />
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
              <LineChart
                sx={{ width: "100%" }}
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                  {
                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                    color: Colors.SKY_BLUE,
                  },
                ]}
                height={270}
              />
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
              <BarChart
                sx={{ width: "100%" }}
                xAxis={[
                  {
                    scaleType: "band",
                    data: [0, 2, 4, 6, 8, 10, 12, 14],
                  },
                ]}
                series={[
                  {
                    data: [4, 3, 5, 2, 1, 6, 10, 1],
                    color: Colors.SKY_BLUE,
                    highlightScope: {
                      highlighted: { additionalRadius: 10 },
                    },
                  },
                ]}
                height={270}
              />
            </div>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default DashboardContent;
