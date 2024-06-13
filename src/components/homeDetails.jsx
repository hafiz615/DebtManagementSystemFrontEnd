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

function HomeDetails() {
  const dispatch = useDispatch();
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const [homeData, setHomeData] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalData, setTotalData] = useState();
  const [arrayName, setArrayName] = useState("default");

  const [faCurrent, setFaCurrent] = useState(1);
  const [saCurrent, setSaCurrent] = useState(1);
  const [upCurrent, setUpCurrent] = useState(1);
  const [fpCurrent, setFpCurrent] = useState(1);
  const [spCurrent, setSpCurrent] = useState(1);

  const [faCurrentLoading, setFaCurrentLoading] = useState(false);
  const [saCurrentLoading, setSaCurrentLoading] = useState(false);
  const [upCurrentLoading, setUpCurrentLoading] = useState(false);
  const [fpCurrentLoading, setFpCurrentLoading] = useState(false);
  const [spCurrentLoading, setSpCurrentLoading] = useState(false);

  const accordionData = [
    {
      arrayTotal: totalData?.failedAuthorizations,
      arrayName: "failedAuthorizations",
      tableHeading: "Failed Authorizations",
      paymentNumber: "5",
      rowData: homeData?.failedAuthorizations,
    },
    {
      arrayTotal: totalData?.successAuthorizations,
      arrayName: "successAuthorizations",
      tableHeading: "Successful Authorizations",
      paymentNumber: "4",
      rowData: homeData?.successAuthorizations,
    },
    {
      arrayTotal: totalData?.upcomingPayments,
      arrayName: "upcomingPayments",
      tableHeading: "Upcoming Payments",
      paymentNumber: "4",
      rowData: homeData?.upcomingPayments,
    },

    {
      arrayTotal: totalData?.failedPayments,
      arrayName: "failedPayments",
      tableHeading: "Failed Payments",
      paymentNumber: "5",
      rowData: homeData?.failedPayments,
    },
    {
      arrayTotal: totalData?.successPayments,
      arrayName: "successPayments",
      tableHeading: "Successful Payments",
      paymentNumber: "4",
      rowData: homeData?.successPayments,
    },
  ];

  const menuItems = [
    { label: "3", value: 3 },
    { label: "5", value: 5 },
    { label: "7", value: 7 },
  ];
  const [selectedValue, setSelectedValue] = useState(3);
  const { AUTHORITY_TEXT, HOME_HEADING, VIEW_DAYS, DAYS_TEXT } =
    HomePageDetails;

  const getHomeData = async (name, pageNumber) => {
    if (selectedValue) {
      const page = pageNumber;
      setArrayName(name);
      const result = await GetHomePayments(selectedValue, page, arrayName);
      if (result?.status === 200) {
        setTotalData(result?.data?.data?.counts);
        setHomeData(result?.data?.data?.payments);
        dispatch(get_payments(result?.data?.data));
      }
    }
    setLoading(false);
    setFaCurrentLoading(false);
    setSaCurrentLoading(false);
    setUpCurrentLoading(false);
    setFpCurrentLoading(false);
    setSpCurrentLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getHomeData("default", 1);
  }, [selectedValue]);

  useEffect(() => {
    setFaCurrentLoading(true);
    getHomeData("failedAuthorizations", faCurrent);
  }, [faCurrent]);

  useEffect(() => {
    setSaCurrentLoading(true);
    getHomeData("successAuthorizations", saCurrent);
  }, [saCurrent]);

  useEffect(() => {
    setUpCurrentLoading(true);
    getHomeData("upcomingPayments", upCurrent);
  }, [upCurrent]);

  useEffect(() => {
    setFpCurrentLoading(true);
    getHomeData("failedPayments", fpCurrent);
  }, [fpCurrent]);

  useEffect(() => {
    setSpCurrentLoading(true);
    getHomeData("successPayments", spCurrent);
  }, [spCurrent]);

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
              <Grid item xs={12} sx={{ marginBottom: "0.5rem" }}>
                <AccordionUsage
                  totalPages={Math.ceil(accordionData[0]?.arrayTotal / 5)}
                  arrayName={accordionData[0]?.arrayName}
                  index={0}
                  currentPage={faCurrent}
                  setCurrentPage={setFaCurrent}
                  tableHeading={accordionData[0]?.tableHeading}
                  paymentNumber={accordionData[0]?.paymentNumber}
                  rowArray={accordionData[0]?.rowData}
                  showFailureReason={
                    accordionData[0]?.tableHeading !== "Upcoming Payments"
                  }
                />
              </Grid>
              <Grid item xs={12} sx={{ marginBottom: "0.5rem" }}>
                <AccordionUsage
                  totalPages={Math.ceil(accordionData[1]?.arrayTotal / 5)}
                  arrayName={accordionData[1]?.arrayName}
                  index={1}
                  currentPage={saCurrent}
                  setCurrentPage={setSaCurrent}
                  tableHeading={accordionData[1]?.tableHeading}
                  paymentNumber={accordionData[1]?.paymentNumber}
                  rowArray={accordionData[1]?.rowData}
                  showFailureReason={
                    accordionData[1]?.tableHeading !== "Upcoming Payments"
                  }
                />
              </Grid>
              <Grid item xs={12} sx={{ marginBottom: "0.5rem" }}>
                <AccordionUsage
                  totalPages={Math.ceil(accordionData[2]?.arrayTotal / 5)}
                  arrayName={accordionData[2]?.arrayName}
                  currentPage={upCurrent}
                  index={2}
                  setCurrentPage={setUpCurrent}
                  tableHeading={accordionData[2]?.tableHeading}
                  paymentNumber={accordionData[2]?.paymentNumber}
                  rowArray={accordionData[2]?.rowData}
                  showFailureReason={
                    accordionData[2]?.tableHeading !== "Upcoming Payments"
                  }
                />
              </Grid>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Grid item xs={12} sx={{ marginBottom: "0.5rem" }}>
                <AccordionUsage
                  totalPages={Math.ceil(accordionData[3]?.arrayTotal / 5)}
                  arrayName={accordionData[3]?.arrayName}
                  index={3}
                  currentPage={fpCurrent}
                  setCurrentPage={setFpCurrent}
                  tableHeading={accordionData[3]?.tableHeading}
                  paymentNumber={accordionData[3]?.paymentNumber}
                  rowArray={accordionData[3]?.rowData}
                  showFailureReason={
                    accordionData[3]?.tableHeading !== "Upcoming Payments"
                  }
                />
              </Grid>
              <Grid item xs={12} sx={{ marginBottom: "0.5rem" }}>
                <AccordionUsage
                  totalPages={Math.ceil(accordionData[4]?.arrayTotal / 5)}
                  arrayName={accordionData[4]?.arrayName}
                  index={4}
                  currentPage={spCurrent}
                  setCurrentPage={setSpCurrent}
                  tableHeading={accordionData[4]?.tableHeading}
                  paymentNumber={accordionData[4]?.paymentNumber}
                  rowArray={accordionData[4]?.rowData}
                  showFailureReason={
                    accordionData[4]?.tableHeading !== "Upcoming Payments"
                  }
                />
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default HomeDetails;
