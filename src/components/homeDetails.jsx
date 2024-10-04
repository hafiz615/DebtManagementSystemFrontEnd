import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Grid, Typography, CircularProgress } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Colors } from "../config/default";
import { PAGE_HEIGHT, HomePageDetails } from "../constants/appConstants";
import AccordionUsage from "./accordion";
import Dropdown from "./dropdown";
import { GetBulkRecords, GetHomePayments } from "../services/services";
import { get_payments } from "../redux/action/action";
import ScrollbarStyles from "./customScroll";
import BulkImportAccordions from "./bulkImportAccordion";
import UrlAccordion from "./urlAccordion";

function HomeDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const [homeData, setHomeData] = useState({});
  const [bulkData, setBulkData] = useState({});
  const [loading, setLoading] = useState(false);
  const [paginationRows, setPaginationRows] = useState({
    failedAuthorizations: "5",
    failedPayments: "5",
    successAuthorizations: "5",
    upcomingPayments: "5",
    successPayments: "5",
  });
  const [bulkPaginationRows, setBulkPaginationRows] = useState({
    pending: "5",
    success: "5",
    failed: "5",
    actionRequired: "5",
    duplicate: "5",
  });
  const [totalData, setTotalData] = useState({});
  const [bulkTotalData, setBulkTotalData] = useState({});
  const [selectedValue, setSelectedValue] = useState(3);
  const [currentPage, setCurrentPage] = useState({
    failedAuthorizations: 1,
    failedCaptures: 1,
    successAuthorizations: 1,
    upcomingPayments: 1,
    successPayments: 1,
    successCaptures: 1,
  });
  const [bulkCurrentPage, setBulkCurrentPages] = useState({
    pending: 1,
    success: 1,
    failed: 1,
    actionRequired: 1,
    duplicate: 1,
  });

  const accordionData = [
    {
      key: "failedAuthorizations",
      heading: "Failed Authorizations",
      number: "5",
    },
    { key: "failedCaptures", heading: "Failed Captures", number: "5" },
    {
      key: "successAuthorizations",
      heading: "Successful Authorizations",
      number: "4",
    },
    { key: "successPayments", heading: "Successful Payments", number: "4" },
    { key: "successCaptures", heading: "Successful Captures", number: "4" },
    { key: "upcomingPayments", heading: "Upcoming Payments", number: "4" },
  ];

  const bulkAccordionData = [
    {
      key: "pending",
      heading: "Pending",
    },
    { key: "success", heading: "Success" },
    {
      key: "failed",
      heading: "Failed",
    },
    { key: "actionRequired", heading: "Need Attention" },
    { key: "duplicate", heading: "Duplicate" },
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
            successPayments: 0,
            successCaptures: 0,
          });
          setHomeData({
            failedAuthorizations: [],
            failedCaptures: [],
            successAuthorizations: [],
            upcomingPayments: [],
            successPayments: [],
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

  const getBulkData = async (key, pageNumber, pageLimit) => {
    let limit = pageLimit || bulkPaginationRows[key];
    const res = await GetBulkRecords(key, pageNumber, limit);
    if (res?.status === 200) {
      if (!res?.data?.data) {
        setBulkTotalData({
          pending: 0,
          success: 0,
          failed: 0,
          actionRequired: 0,
          duplicate: 0,
        });
        setBulkData({
          pending: [],
          success: [],
          failed: [],
          actionRequired: [],
          duplicate: [],
        });
      } else {
        key === "default"
          ? setBulkTotalData(res?.data?.data?.count)
          : setBulkTotalData((prev) => ({
              ...prev,
              [key]: res?.data?.data?.count[key],
            }));

        key === "default"
          ? setBulkData(res?.data?.data)
          : setBulkData((prev) => ({
              ...prev,
              [key]: res?.data?.data?.[key],
            }));
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
    setBulkPaginationRows({
      pending: 5,
      success: 5,
      failed: 5,
      actionRequired: 5,
      duplicate: 5,
    });
    setCurrentPage({
      failedAuthorizations: 1,
      failedCaptures: 1,
      successAuthorizations: 1,
      upcomingPayments: 1,
      successPayments: 1,
      successCaptures: 1,
    });
    setBulkCurrentPages({
      pending: 1,
      success: 1,
      failed: 1,
      actionRequired: 1,
      duplicate: 1,
    });
    getHomeData("default", 1, 5, true);
    getBulkData("default", 1, 5);
  }, [selectedValue]);

  const handlePageChange = (key, page) => {
    setCurrentPage((prev) => ({ ...prev, [key]: page }));
    getHomeData(key, page);
  };
  const handleBulkPageChange = (key, page) => {
    setBulkCurrentPages((prev) => ({ ...prev, [key]: page }));
    getBulkData(key, page);
  };

  const handleRowChange = (key, newRow) => {
    setCurrentPage((prev) => ({ ...prev, [key]: 1 }));
    setPaginationRows((prev) => ({ ...prev, [key]: newRow }));
    getHomeData(key, 1, newRow);
  };

  const handleBulkRowChange = (key, newRow) => {
    setBulkCurrentPages((prev) => ({ ...prev, [key]: 1 }));
    setBulkPaginationRows((prev) => ({ ...prev, [key]: newRow }));
    getBulkData(key, 1, newRow);
  };

  const renderAccordion = (data, index) => (
    <Grid item xs={12} lg={6} sx={{ marginBottom: "0.5rem" }} key={data.key}>
      <AccordionUsage
        paginationRows={paginationRows[data?.key]}
        setPaginationRows={(newRow) => handleRowChange(data?.key, newRow)}
        index={index}
        totalPages={Math.ceil(totalData[data?.key] / paginationRows[data?.key])}
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
          data?.heading !== "Successful Captures" &&
          data?.heading !== "Successful Authorizations" &&
          data?.heading !== "Successful Payments"
        }
        showDueDate={
          data?.heading !== "Successful Captures" &&
          data?.heading !== "Successful Authorizations" &&
          data?.heading !== "Failed Captures" &&
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
              paddingRight: "1rem",
              paddingBottom: "1rem",
              borderRadius: "10px",
            }}
            spacing={smallScreen ? 0 : 2}
          >
            <Grid
              container
              sx={{ justifyContent: "space-between", padding: "0 1rem" }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "700",
                  fontSize: "1.5rem",
                  color: Colors.BLACK,
                  mt: "1.5rem",
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
            {accordionData?.map(renderAccordion)}
          </Grid>
          <Grid
            container
            item
            xs={12}
            sx={{
              margin: "1rem 0rem",
              backgroundColor: Colors.PALE_GRAY,
              paddingRight: "1rem",
              paddingBottom: "1rem",
              borderRadius: "10px",
            }}
            spacing={smallScreen ? 0 : 2}
          >
            <Grid
              item
              xs={12}
              sx={{
                fontFamily: "Nunito",
                fontWeight: "700",
                fontSize: "1.5rem",
                color: Colors.BLACK,
                mt: "1.5rem",
              }}
            >
              Bulk Upload
            </Grid>
            {bulkAccordionData?.map((data, index) => (
              <Grid
                item
                xs={12}
                lg={6}
                sx={{ marginBottom: "0.5rem" }}
                key={data.key}
              >
                <BulkImportAccordions
                  paginationRows={bulkPaginationRows[data?.key]}
                  setPaginationRows={(newRow) =>
                    handleBulkRowChange(data?.key, newRow)
                  }
                  index={index}
                  totalPages={Math.ceil(
                    bulkTotalData[data?.key] / bulkPaginationRows[data?.key]
                  )}
                  totalData={bulkTotalData[data?.key]}
                  arrayName={data?.key}
                  currentPage={bulkCurrentPage[data?.key]}
                  setCurrentPage={(page) =>
                    handleBulkPageChange(data?.key, page)
                  }
                  tableHeading={data?.heading}
                  rowArray={bulkData[data?.key]}
                />
              </Grid>
            ))}
          </Grid>
          <Grid
            container
            item
            xs={12}
            sx={{
              margin: "1rem 0rem",
              backgroundColor: Colors.PALE_GRAY,
              paddingRight: "1rem",
              paddingBottom: "1rem",
              borderRadius: "10px",
            }}
            spacing={smallScreen ? 0 : 2}
          >
            <Grid
              item
              xs={12}
              sx={{
                fontFamily: "Nunito",
                fontWeight: "700",
                fontSize: "1.5rem",
                color: Colors.BLACK,
                mt: "1.5rem",
              }}
            >
              URL's
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: "0.5rem" }}>
              <UrlAccordion tableHeading={"Debtors Urls"} />
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default HomeDetails;
