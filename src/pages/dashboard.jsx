import React from "react";
import { Grid, Typography } from "@mui/material";

import NavBar from "../components/navBar";
import SearchBar from "../components/searchBar";
import useMediaQuery from "@mui/material/useMediaQuery";
import AccordionUsage from "../components/accordian";

function Dashboard() {
  const largeScreen = useMediaQuery("(min-width:320px) and (max-width:760px)");
  return (
    <>
      <Grid
        container
        sx={{
          height: "100vh",
          backgroundColor: "#F5F5F5",
        }}
      >
        <NavBar />
        <Grid container>
          <Grid
            item
            xs={2.5}
            sx={{
              border: "1px solid red",
              backgroundColor: "#FFFFFF",
              height: "90vh",
            }}
          >
            Side Bar
          </Grid>
          <Grid item xs={9.5}>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: largeScreen ? "column" : "",
                paddingLeft: "2rem",
                paddingRight: "2rem",
                marginTop: "1.5rem",
              }}
            >
              <Typography>DashBoard</Typography>
              <Typography>
                Authority level: <span>Negotiator</span>
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: largeScreen ? "column" : "",
                paddingLeft: "2rem",
                paddingRight: "1.7rem",
                marginTop: "1.5rem",
              }}
            >
              <Typography sx={{ fontWeight: "500", fontSize: "2rem" }}>
                DashBoard
              </Typography>
              <SearchBar />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                marginTop: "3rem",
                paddingLeft: "2rem",
                paddingRight: "2rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Grid item xs={5.9}>
                <AccordionUsage
                  tableHeading="Failed Authorizations"
                  paymentNumber="5"
                />
              </Grid>
              <Grid item xs={5.9}>
                <AccordionUsage
                  tableHeading="Failed Payments"
                  paymentNumber="5"
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                marginTop: "3rem",
                paddingLeft: "2rem",
                paddingRight: "2rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Grid item xs={5.9}>
                <AccordionUsage
                  tableHeading="Successful Authorizations"
                  paymentNumber="4"
                />
              </Grid>
              <Grid item xs={5.9}>
                <AccordionUsage
                  tableHeading="Successful Payments"
                  paymentNumber="4"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
