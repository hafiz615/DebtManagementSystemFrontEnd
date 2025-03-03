import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Grid, Typography, CircularProgress } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Colors } from "../config/default";
import { PAGE_HEIGHT, HomePageDetails } from "../constants/appConstants";
import AccordionUsage from "./accordion";
import Dropdown from "./dropdown";
import {
  GetCreditorSuccessfulPayment,
  GetHomePayments,
} from "../services/services";
import { get_payments } from "../redux/action/action";
import ScrollbarStyles from "./customScroll";
import UrlAccordion from "./urlAccordion";

function HomeDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const [homeData, setHomeData] = useState({});
  const [loading, setLoading] = useState(false);
  const [paginationRows, setPaginationRows] = useState({
    failedAuthorizations: "5",
    failedCaptures: "5",
    failedPayments: "5",
    successAuthorizations: "5",
    upcomingPayments: "5",
    successPayments: "5",
  });

  const [totalData, setTotalData] = useState({});
  const [selectedValue, setSelectedValue] = useState(3);
  const [currentPage, setCurrentPage] = useState({
    failedAuthorizations: 1,
    failedCaptures: 1,
    successAuthorizations: 1,
    upcomingPayments: 1,
    successPayments: 1,
    successCaptures: 1,
  });

  const accordionData = [
    {
      key: "upcomingPayments",
      heading: "Client Upcoming Payments",
      number: "4",
    },
    {
      key: "successPayments",
      heading: "Creditor Successful Payments",
      number: "4",
    },
    {
      key: "successAuthorizations",
      heading: "Client Successful Authorizations",
      number: "4",
    },

    {
      key: "successCaptures",
      heading: "Client Successful Captures",
      number: "4",
    },
    {
      key: "failedAuthorizations",
      heading: "Client Failed Authorizations",
      number: "5",
    },

    {
      key: "failedCaptures",
      heading: "Client Failed Captures",
      number: "5",
    },
  ];

  const menuItems = [
    { label: "3", value: 3 },
    { label: "5", value: 5 },
    { label: "7", value: 7 },
  ];

  const { AUTHORITY_TEXT, HOME_HEADING, VIEW_DAYS, DAYS_TEXT } =
    HomePageDetails;

  const getHomeData = async (
    key,
    pageNumber,
    pageLimit,
    isInitialLoad = false
  ) => {
    if (selectedValue) {
      if (isInitialLoad) {
        setLoading(true);
      }
      let limit = pageLimit || paginationRows[key];
      const result = await GetHomePayments(
        selectedValue,
        pageNumber,
        limit,
        key,
        false,
        false
      );
      if (result?.status === 200) {
        if (!result?.data?.data) {
          setTotalData({
            failedAuthorizations: 0,
            failedCaptures: 0,
            successAuthorizations: 0,
            upcomingPayments: 0,
            successCaptures: 0,
          });
          setHomeData({
            failedAuthorizations: [],
            failedCaptures: [],
            successAuthorizations: [],
            upcomingPayments: [],
            successCaptures: [],
          });
        } else {
          key === "default"
            ? setTotalData(result?.data?.data?.counts)
            : setTotalData((prev) => ({
                ...prev,
                [key]: result?.data?.data?.counts[key],
              }));

          key === "default"
            ? setHomeData(result?.data?.data?.payments)
            : setHomeData((prev) => ({
                ...prev,
                [key]: result?.data?.data?.payments[key],
              }));
          dispatch(get_payments(result?.data?.data?.payments));
        }
      } else if (
        result?.response?.status === 401 ||
        result?.response?.status === 403
      ) {
        localStorage.clear();
        navigate("/");
      }

      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  const getCreditorSuccessfulPayments = async (pageNumber, pageLimit) => {
    if (selectedValue) {
      let limit = pageLimit || paginationRows["successPayments"];
      const result = await GetCreditorSuccessfulPayment(
        selectedValue,
        pageNumber,
        limit,
        false,
        false
      );
      if (result?.status === 200) {
        if (!result?.data?.data) {
          setTotalData((prev) => ({
            ...prev,
            successPayments: 0,
          }));
          setHomeData((prev) => ({
            ...prev,
            successPayments: [],
          }));
        } else {
          setTotalData((prev) => ({
            ...prev,
            successPayments: result?.data?.data?.counts?.successPayments,
          }));
          setHomeData((prev) => ({
            ...prev,
            successPayments: result?.data?.data?.payments?.successPayments,
          }));
        }
      } else if (
        result?.response?.status === 401 ||
        result?.response?.status === 403
      ) {
        localStorage.clear();
        navigate("/");
      }
    }
  };

  useEffect(() => {
    setPaginationRows({
      failedAuthorizations: 5,
      failedCaptures: 5,
      successAuthorizations: 5,
      upcomingPayments: 5,
      successPayments: 5,
      successCaptures: 5,
    });

    setCurrentPage({
      failedAuthorizations: 1,
      failedCaptures: 1,
      successAuthorizations: 1,
      upcomingPayments: 1,
      successPayments: 1,
      successCaptures: 1,
    });

    getHomeData("default", 1, 5, true);
    getCreditorSuccessfulPayments(1, 5);
  }, [selectedValue]);

  const handlePageChange = (key, page) => {
    setCurrentPage((prev) => ({ ...prev, [key]: page }));
    if (key === "successPayments") {
      getCreditorSuccessfulPayments(page);
    } else {
      getHomeData(key, page);
    }
  };

  const handleRowChange = (key, newRow) => {
    setCurrentPage((prev) => ({ ...prev, [key]: 1 }));
    setPaginationRows((prev) => ({ ...prev, [key]: newRow }));
    if (key === "successPayments") {
      getCreditorSuccessfulPayments(1, newRow);
    } else {
      getHomeData(key, 1, newRow);
    }
  };

  const renderAccordion = (data, index) => (
    <Grid item xs={12} sx={{ marginBottom: "0.5rem" }} key={data.key}>
      <AccordionUsage
        paginationRows={paginationRows[data?.key]}
        setPaginationRows={(newRow) => handleRowChange(data?.key, newRow)}
        index={index}
        totalPages={Math.ceil(totalData[data?.key] / paginationRows[data?.key])}
        totalData={totalData?.[data?.key]}
        arrayName={data?.key}
        successFulPaymentTrue={data?.key === "successPayments" ? true : false}
        currentPage={currentPage[data?.key]}
        setCurrentPage={(page) => handlePageChange(data?.key, page)}
        tableHeading={data?.heading}
        paymentNumber={data?.number}
        rowArray={homeData[data?.key]}
        getHomeData={getHomeData}
        showFailureReason={
          data?.heading !== "Client Upcoming Payments" &&
          data?.heading !== "Client Successful Captures" &&
          data?.heading !== "Client Successful Authorizations" &&
          data?.heading !== "Creditor Successful Payments"
        }
        showDueDate={
          data?.heading !== "Client Successful Captures" &&
          data?.heading !== "Client Successful Authorizations" &&
          data?.heading !== "Client Failed Captures" &&
          data?.heading !== "Client Failed Authorizations"
        }
      />
    </Grid>
  );

  const groupOne = accordionData?.filter(
    (data) =>
      data.heading === "Client Upcoming Payments" ||
      data.heading === "Client Successful Authorizations" ||
      data.heading === "Client Failed Authorizations"
  );

  const groupTwo = accordionData?.filter(
    (data) =>
      data.heading === "Creditor Successful Payments" ||
      data.heading === "Client Successful Captures" ||
      data.heading === "Client Failed Captures"
  );
  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        padding: "0 2rem",
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
      {loading ? (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
          }}
        >
          <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : (
        <>
          <Grid
            container
            item
            xs={12}
            sx={{
              margin: "1rem 0rem",
              backgroundColor: Colors.PALE_GRAY,
              borderRadius: "10px",
            }}
            spacing={smallScreen ? 0 : 2}
          >
            <Grid
              container
              sx={{
                justifyContent: "space-between",
                padding: "0 1rem",
                mb: { xs: "1rem", lg: "auto" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "700",
                  fontSize: "1.5rem",
                  color: Colors.BLACK,
                  mt: "1.5rem ",
                }}
              >
                Payment
              </Typography>
              <Grid
                item
                sx={{
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
                  <span style={{ marginLeft: ".5rem" }}>{DAYS_TEXT}</span>
                </Typography>
              </Grid>
            </Grid>

            <>
              <Grid
                container
                item
                xs={12}
                sx={{
                  display: "flex",
                  padding: "1rem !important",
                  justifyContent: "space-between",
                }}
              >
                <Grid item xs={12} lg={5.9}>
                  {groupOne?.map(renderAccordion)}
                </Grid>

                <Grid item xs={12} lg={5.9}>
                  {groupTwo?.map(renderAccordion)}
                </Grid>
              </Grid>
            </>
          </Grid>

          <Grid
            container
            item
            xs={12}
            sx={{
              margin: "1rem 0rem",
              backgroundColor: Colors.PALE_GRAY,
              borderRadius: "10px",
            }}
            spacing={smallScreen ? 0 : 2}
          >
            <Grid container sx={{ padding: "0 1rem" }}>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "700",
                  fontSize: "1.5rem",
                  color: Colors.BLACK,
                  mt: "1.5rem ",
                }}
              >
                URL's
              </Typography>
            </Grid>

            <Grid
              container
              item
              xs={12}
              sx={{
                display: "flex",
                padding: "1rem !important",
                justifyContent: "space-between",
              }}
            >
              <UrlAccordion tableHeading={"Debtors Urls"} />
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default HomeDetails;
