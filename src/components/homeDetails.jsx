import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Grid, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../config/default";
import { HomePageDetails } from "../constants/appConstants";
import AccordionUsage from "./accordion";
import Dropdown from "./dropdown";

function HomeDetails() {
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);

  const accordionData = [
    { tableHeading: "Failed Authorizations", paymentNumber: "5" },
    { tableHeading: "Failed Payments", paymentNumber: "5" },
    { tableHeading: "Successful Authorizations", paymentNumber: "4" },
    { tableHeading: "Successful Payments", paymentNumber: "4" },
    { tableHeading: "Upcoming Payments", paymentNumber: "4" },
  ];
  const menuItems = [
    { label: "5", value: 5 },
    { label: "7", value: 7 },
  ];
  const [selectedValue, setSelectedValue] = useState("3");

  const { AUTHORITY_TEXT, HOME_HEADING, VIEW_DAYS, DAYS_TEXT } =
    HomePageDetails;
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
          {HOME_HEADING}
        </Typography>
      </Grid>
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
            fontWeight: "500",
            fontFamily: "Nunito",
            display: "flex",
            alignItems: "center",
            justifyContent: smallScreen ? "flex-start" : "center",
            color: Colors.BLACK,
          }}
        >
          <span style={{ marginRight: ".5rem" }}>{VIEW_DAYS}</span>
          <Dropdown
            menuItems={menuItems}
            defaultSelectedItem={3}
            backgroundColor={Colors.WHITE}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
          <span style={{ marginLeft: ".5rem" }}>{DAYS_TEXT}</span>
        </Typography>
      </Grid>

      <Grid
        container
        item
        xs={12}
        sx={{
          marginTop: "1rem",
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

export default HomeDetails;
