import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Grid, Typography, CircularProgress } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../config/default";
import { HomePageDetails } from "../constants/appConstants";
import AccordionUsage from "./accordion";
import Dropdown from "./dropdown";
import { GetHomePayments } from "../services/services";
import { get_payments } from "../redux/action/action";
// import SelectMenu from "./select";

function HomeDetails() {
  const dispatch = useDispatch();
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const [homeData, setHomeData] = useState({});
  const [loading, setLoading] = useState(false);

  const accordionData = {
    group1: [
      {
        tableHeading: "Failed Authorizations",
        paymentNumber: "5",
        rowData: homeData?.failedAuthorizations,
      },
      {
        tableHeading: "Successful Authorizations",
        paymentNumber: "4",
        rowData: homeData?.successAuthorizations,
      },
      {
        tableHeading: "Upcoming Payments",
        paymentNumber: "4",
        rowData: homeData?.upcomingPayments,
      },
    ],
    group2: [
      {
        tableHeading: "Failed Payments",
        paymentNumber: "5",
        rowData: homeData?.failedPayments,
      },
      {
        tableHeading: "Successful Payments",
        paymentNumber: "4",
        rowData: homeData?.successPayments,
      },
    ],
  };

  const menuItems = [
    { label: "3", value: 3 },
    { label: "5", value: 5 },
    { label: "7", value: 7 },
  ];
  const [selectedValue, setSelectedValue] = useState(3);
  const { AUTHORITY_TEXT, HOME_HEADING, VIEW_DAYS, DAYS_TEXT } =
    HomePageDetails;
  const getHomeData = async () => {
    if (selectedValue) {
      setLoading(true);
      const result = await GetHomePayments(selectedValue);
      if (result?.status === 200) {
        setHomeData(result?.data?.data);
        dispatch(get_payments(result?.data?.data));
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    getHomeData();
  }, [selectedValue]);
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
            menuWidth="4rem"
            menuItems={menuItems}
            defaultSelectedItem={3}
            backgroundColor={Colors.WHITE}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
          {/* <SelectMenu
            menuWidth="4rem"
            menuItems={menuItems}
            defaultSelectedItem={3}
            backgroundColor={Colors.WHITE}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          /> */}
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
        {loading ? (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "50vh",
            }}
          >
            <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
          </Grid>
        ) : (
          <>
            <Grid item xs={12} lg={6}>
              {accordionData.group1.map((data, index) => (
                <Grid item xs={12} key={index} sx={{ marginBottom: "0.5rem" }}>
                  <AccordionUsage
                    tableHeading={data?.tableHeading}
                    paymentNumber={data?.paymentNumber}
                    index={index}
                    rowArray={data?.rowData}
                  />
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12} lg={6}>
              {accordionData.group2.map((data, index) => (
                <Grid item xs={12} key={index} sx={{ marginBottom: "0.5rem" }}>
                  <AccordionUsage
                    tableHeading={data?.tableHeading}
                    paymentNumber={data?.paymentNumber}
                    index={index}
                    rowArray={data?.rowData}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default HomeDetails;
