import React from "react";

import { Grid, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../config/default";
import { DashBoardPage } from "../constants/appConstants";
import BasicMenu from "../components/dropdown";
import SearchBar from "../components/searchBar";
import AccordionUsage from "../components/accordion";

function Dashboard() {
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");

  const accordionData = [
    { tableHeading: "Failed Authorizations", paymentNumber: "5" },
    { tableHeading: "Failed Payments", paymentNumber: "5" },
    { tableHeading: "Successful Authorizations", paymentNumber: "4" },
    { tableHeading: "Successful Payments", paymentNumber: "4" },
    { tableHeading: "Upcoming Payments", paymentNumber: "4" },
  ];

  const {
    DASHBOARD_HEADING,
    AUTHORITY_TEXT,
    AUTHORITY_VALUE,
    HOME_HEADING,
    VIEW_DAYS,
    DAYS_TEXT,
  } = DashBoardPage;
  return (
    <Grid container sx={{ backgroundColor: Colors.BG_LIGHT_GRAY }}>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: smallScreen ? "column" : "",
          marginTop: "1.5rem",
          paddingLeft: "2rem",
          paddingRight: "2rem",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "500",
            color: Colors.DARK_GRAY,
          }}
        >
          {DASHBOARD_HEADING}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "500",
            color: Colors.DARK_GRAY,
          }}
        >
          {AUTHORITY_TEXT} <span>{AUTHORITY_VALUE}</span>
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: smallScreen ? "column" : "row",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          marginTop: "1.5rem",
        }}
      >
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "2rem",
            fontFamily: "Nunito",
            color: Colors.NAVY_BLUE,
          }}
        >
          {HOME_HEADING}
        </Typography>
        <SearchBar />
      </Grid>
      <Grid
        item
        xs={11.6}
        sx={{
          display: "flex",
          justifyContent: smallScreen ? "flex-start" : "flex-end",
          flexDirection: smallScreen ? "column" : "row",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          marginTop: "1.5rem",
        }}
      >
        <Typography
          sx={{
            fontWeight: "500",
            fontFamily: "Nunito",
            display: "flex",
            alignItems: "center",
            justifyContent: smallScreen ? "flex-start" : "center",
            color: Colors.DARK_GRAY,
          }}
        >
          <span style={{ marginRight: ".5rem" }}>{VIEW_DAYS}</span>
          <BasicMenu />
          <span style={{ marginLeft: ".5rem" }}>{DAYS_TEXT}</span>
        </Typography>
      </Grid>

      <Grid
        container
        item
        xs={12}
        lg={11.6}
        sx={{
          marginTop: "1rem",
          paddingLeft: "2rem",
          paddingRight: "2rem",
        }}
        spacing={smallScreen ? 0 : 2}
      >
        {accordionData?.map((data, index) => (
          <Grid item xs={12} lg={6} key={index} sx={{ marginBottom: "0.5rem" }}>
            <AccordionUsage
              tableHeading={data?.tableHeading}
              paymentNumber={data?.paymentNumber}
              index={index}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default Dashboard;
