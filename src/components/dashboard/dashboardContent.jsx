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

  //   const paymentsAuthorizations = [
  //     { name: "Failed Authorizations" },
  //     { name: "Failed Payments" },
  //     { name: "Successful Payments" },
  //     { name: "Successful Authorizations" },
  //   ];

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
        <Grid xs={8}>
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
                fontWeight: "600",
              }}
            >
              {userName},
            </Typography>
          </div>
          <div>
            <Typography style={{ color: Colors.DIM_LIGHT_GRAY }}>
              You can manage your whole team from here.
            </Typography>
          </div>
        </Grid>
        <Grid xs={4}>
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder="Search..."
          />
        </Grid>
      </Grid>

      <Grid xs={12} container sx={{ mt: "1rem" }}>
        <Grid xs={12} lg={8}>
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
              <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                Payments & Authorizations
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>Year 2024</Typography>
            </div>
            <hr style={{ background: "lightgrey" }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 16px",
                height: "13rem",
              }}
            >
              <SpinnerWithPercentage value={100} color={Colors.NAVY_BLUE} />
              <SpinnerWithPercentage value={100} />
              <SpinnerWithPercentage color={Colors.YELLOW} value={100} />
              <SpinnerWithPercentage
                color={Colors.DIM_LIGHT_GRAY}
                value={100}
              />
            </div>
            {/* <div>
              <Grid
                container
                sx={{ justifyContent: "space-between", padding: "10px 16px" }}
              >
                {paymentsAuthorizations?.map((item) => (
                  <Grid>
                    <Typography style={{ fontSize: "14px" }}>
                      {item?.name}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </div> */}
          </Card>
        </Grid>
        <Grid xs={12} lg={4} sx={{ mt: { xs: "1rem", lg: "0" } }}>
          <Card
            sx={{
              backgroundColor: Colors.WHITE,
              height: "20rem",
              borderRadius: "16px",
              boxShadow: "none",
            }}
          >
            <Typography
              sx={{ fontSize: "14px", fontWeight: "600", padding: "10px 16px" }}
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

      <Grid xs={12} container sx={{ m: "1rem 0rem" }}>
        <Grid xs={12} lg={8} sx={{ mt: { xs: "1rem", lg: "0" } }}>
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
              <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                Case By Agents
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>Year 2024</Typography>
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
        <Grid xs={12} lg={4} sx={{ mt: { xs: "1rem", lg: "0" } }}>
          <Card
            sx={{
              backgroundColor: Colors.WHITE,
              height: "20rem",
              borderRadius: "16px",
              boxShadow: "none",
            }}
          >
            <Typography
              sx={{ fontSize: "14px", fontWeight: "600", padding: "10px 16px" }}
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
