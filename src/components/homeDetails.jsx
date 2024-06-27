import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Typography, CircularProgress } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Colors } from "../config/default";
import { PAGE_HEIGHT, HomePageDetails } from "../constants/appConstants";
import AccordionUsage from "./accordion";
import Dropdown from "./dropdown";
import { GetHomePayments } from "../services/services";
import { get_payments } from "../redux/action/action";
import ScrollbarStyles from "./customScroll";
// import SelectMenu from "./select";

function HomeDetails() {
  const dispatch = useDispatch();
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const [homeData, setHomeData] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalData, setTotalData] = useState({});
  const [selectedValue, setSelectedValue] = useState(3);
  const [currentPage, setCurrentPage] = useState({
    failedAuthorizations: 1,
    failedPayments: 1,
    successAuthorizations: 1,
    upcomingPayments: 1,
    successPayments: 1,
  });

  const accordionData = [
    {
      key: "failedAuthorizations",
      heading: "Failed Authorizations",
      number: "5",
    },
    { key: "failedPayments", heading: "Failed Payments", number: "5" },
    {
      key: "successAuthorizations",
      heading: "Successful Authorizations",
      number: "4",
    },
    { key: "successPayments", heading: "Successful Payments", number: "4" },
    { key: "upcomingPayments", heading: "Upcoming Payments", number: "4" },
  ];

  const menuItems = [
    { label: "3", value: 3 },
    { label: "5", value: 5 },
    { label: "7", value: 7 },
  ];

  const { AUTHORITY_TEXT, HOME_HEADING, VIEW_DAYS, DAYS_TEXT } =
    HomePageDetails;

  const getHomeData = async (key, pageNumber, isInitialLoad = false) => {
    if (selectedValue) {
      if (isInitialLoad) {
        setLoading(true);
      }

      const result = await GetHomePayments(selectedValue, pageNumber, key);
      if (result?.status === 200) {
        setTotalData((prev) => ({
          ...prev,
          [key]: result?.data?.data?.counts[key],
        }));
        setHomeData((prev) => ({
          ...prev,
          [key]: result?.data?.data?.payments[key],
        }));
        dispatch(get_payments(result?.data?.data?.payments));
      }

      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    accordionData.forEach((data) => {
      getHomeData(data?.key, currentPage[data?.key], true);
    });
  }, [selectedValue]);

  const handlePageChange = (key, page) => {
    setCurrentPage((prev) => ({ ...prev, [key]: page }));
    getHomeData(key, page);
  };

  const renderAccordion = (data, index) => (
    <Grid item xs={12} lg={6} sx={{ marginBottom: "0.5rem" }} key={data.key}>
      <AccordionUsage
        index={index}
        totalPages={Math.ceil(totalData[data?.key] / 5)}
        totalData={totalData[data?.key]}
        arrayName={data?.key}
        currentPage={currentPage[data?.key]}
        setCurrentPage={(page) => handlePageChange(data?.key, page)}
        tableHeading={data?.heading}
        paymentNumber={data?.number}
        rowArray={homeData[data?.key]}
        getHomeData={getHomeData}
        showFailureReason={
          data?.heading !== "Upcoming Payments" &&
          data?.heading !== "Successful Payments" &&
          data?.heading !== "Successful Authorizations"
        }
        showDueDate={
          data?.heading !== "Successful Payments" &&
          data?.heading !== "Successful Authorizations" &&
          data?.heading !== "Failed Payments" &&
          data?.heading !== "Failed Authorizations"
        }
      />
    </Grid>
  );

  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        padding: "2rem",
        height: PAGE_HEIGHT,
        overflowY: "auto",
        ...ScrollbarStyles,
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
      <Grid item xs={12} sx={{ marginTop: "1.5rem" }}>
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
          {/* <SelectMenu /> */}
          <span style={{ marginLeft: ".5rem" }}>{DAYS_TEXT}</span>
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{ marginTop: "1rem" }}
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
          accordionData.map(renderAccordion)
        )}
      </Grid>
    </Grid>
  );
}

export default HomeDetails;
