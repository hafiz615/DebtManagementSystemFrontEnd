import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Grid, Typography, Box, CircularProgress } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { UserListPage } from "../constants/appConstants";
import { Colors } from "../config/default";
import CaseHistory from "./caseHistory";
import { GetClientById, GetCreditorById } from "../services/services";
import { isEmpty } from "lodash";
import { formatDollarAmount } from "../common";

export default function ClientListDetails() {
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const [clientData, setClientData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [totalData, setTotalData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [caseHistory, setCaseHistory] = useState([]);
  
  const totalPages = Math.ceil(totalData / 5);
  const [limit, setLimit] = useState(5);
  const [tableLoading, setTableLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const { userRole, id } = useParams();

  const searchClientDetails = async () => {
    setTableLoading(true);
    setCaseHistory([]);
    let filter = false;
    let search = true;
    const payload = {
      text: searchText,
    };

    let res;
    let page = currentPage;

    if (userRole === "client") {
      res = await GetClientById(id, search, filter, limit, page, payload);
    } else {
      res = await GetCreditorById(id, search, filter, limit, page, payload);
    }
    if (res?.status === 200) {
      setCaseHistory(res?.data?.data?.caseHistory);
    }
    setTableLoading(false);
  };
  const GetClientDetails = async () => {
    setLoading(true);
    let filter = false;
    let payload = {};
    let search = false;
    setLimit(5);

    payload = {
      text: "",
    };

    let getClientData;
    let page = currentPage;

    if (userRole === "client") {
      getClientData = await GetClientById(
        id,
        search,
        filter,
        limit,
        page,
        payload
      );
    } else {
      getClientData = await GetCreditorById(
        id,
        search,
        filter,
        limit,
        page,
        payload
      );
    }
    if (getClientData?.status === 200) {
      setClientData(getClientData?.data?.data);

      setCaseHistory(getClientData?.data?.data?.caseHistory);
      if (userRole === "client") {
        setTotalData(getClientData?.data?.data?.debtorTotalCases);
      } else {
        setTotalData(getClientData?.data?.data?.creditorTotalCases);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    GetClientDetails(false);
  }, []);

  useEffect(() => {
    searchClientDetails();
  }, [currentPage, searchText]);

  const handleKeyPress = (e) => {
    setSearchText(e.target.value);
  };

  const clearSearchFromApi = () => {
    setSearchText("");
    GetClientDetails();
  };

  const truncateText = (text, length) => {
    if (text?.length > length) {
      return text.substring(0, length) + "...";
    }
    return text;
  };
  const { AUTHORITY_TEXT } = UserListPage;
  const dataUser = clientData?.debtor || clientData?.creditor;
  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        paddingLeft: "2rem",
        paddingRight: "2rem",
      }}
    >
      {loading || isEmpty(clientData) ? (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "90vh",
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
            container
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
              {dataUser?.fullName}
            </Typography>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sx={{
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <Grid
              container
              item
              xs={12}
              lg={7}
              sx={{ justifyContent: "space-evenly" }}
            >
              <Grid item xs={12} lg={5.5}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "6rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    Email
                  </div>

                  <span
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "300",
                      fontSize: "0.9rem",
                      color: Colors.DIM_LIGHT_GRAY,
                      marginTop: "0.5rem",
                    }}
                  >
                    {truncateText(dataUser?.email, 25)}
                  </span>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "6rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    Total Debt
                  </div>

                  <span
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "300",
                      fontSize: "0.9rem",
                      color: Colors.DIM_LIGHT_GRAY,
                      marginTop: "0.5rem",
                    }}
                  >
                    {formatDollarAmount(dataUser?.totalDebt)}
                  </span>
                </Box>
                {userRole === "client" && (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          fontFamily: "Nunito",
                          fontWeight: "600",
                          color: Colors.DARK_GRAY,
                          width: "6rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        SSN
                      </div>

                      <span
                        style={{
                          fontFamily: "Nunito",
                          fontWeight: "300",
                          fontSize: "0.9rem",
                          color: Colors.DIM_LIGHT_GRAY,
                          marginTop: "0.5rem",
                        }}
                      >
                        {dataUser?.SSN}
                      </span>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          fontFamily: "Nunito",
                          fontWeight: "600",
                          color: Colors.DARK_GRAY,
                          width: "6rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        Address
                      </div>

                      <span
                        style={{
                          fontFamily: "Nunito",
                          fontWeight: "300",
                          fontSize: "0.9rem",
                          color: Colors.DIM_LIGHT_GRAY,
                          marginTop: "0.5rem",
                          wordBreak: "break-word",
                        }}
                      >
                        {truncateText(dataUser?.address, 40)}
                      </span>
                    </Box>
                  </>
                )}
              </Grid>

              <Grid item xs={12} lg={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "10rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    Outstanding Debt
                  </div>

                  <span
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "300",
                      fontSize: "0.9rem",
                      color: Colors.DIM_LIGHT_GRAY,
                      marginTop: "0.5rem",
                    }}
                  >
                    {formatDollarAmount(dataUser?.outstandingDebt)}
                  </span>
                </Box>
                {userRole === "client" && (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          fontFamily: "Nunito",
                          fontWeight: "600",
                          color: Colors.DARK_GRAY,
                          width: "10rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        Company Name
                      </div>

                      <span
                        style={{
                          fontFamily: "Nunito",
                          fontWeight: "300",
                          fontSize: "0.9rem",
                          color: Colors.DIM_LIGHT_GRAY,
                          marginTop: "0.5rem",
                        }}
                      >
                        {dataUser?.companyName}
                      </span>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          fontFamily: "Nunito",
                          fontWeight: "600",
                          color: Colors.DARK_GRAY,
                          width: "10rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        Status
                      </div>

                      <span
                        style={{
                          fontFamily: "Nunito",
                          fontWeight: "300",
                          fontSize: "0.9rem",
                          color: Colors.DIM_LIGHT_GRAY,
                          marginTop: "0.5rem",
                        }}
                      >
                        {dataUser?.status}
                      </span>
                    </Box>
                  </>
                )}
              </Grid>
            </Grid>

            <Grid
              container
              item
              xs={12}
              lg={5}
              sx={{ justifyContent: "space-between" }}
            >
              <Grid container sx={{ justifyContent: "space-evenly" }}>
                {[
                  {
                    title: "Failed Payments",
                    value: clientData?.paymentCounts?.failedPayments,
                    color: Colors.BLACK,
                  },
                  {
                    title: "Failed Authorizations",
                    value: clientData?.paymentCounts?.failedAuthorizations,
                    color: Colors.BLACK,
                  },
                  {
                    title: "Successful Payments",
                    value: clientData?.paymentCounts?.successfulPayments,
                    color: Colors.SKY_BLUE,
                  },
                  {
                    title: "Successful Authorizations",
                    value: clientData?.paymentCounts?.successfulAuthorizations,
                    color: Colors.SKY_BLUE,
                  },
                ]?.map((item, index) => (
                  <Grid
                    key={index}
                    container
                    item
                    xs={12}
                    lg={5}
                    sx={{
                      backgroundColor: Colors?.WHITE,
                      justifyContent: "space-around",
                      alignItems: "center",
                      borderRadius: "10px",
                      marginBottom: "1rem",
                    }}
                  >
                    <Typography sx={{ width: "7rem" }}>
                      {item?.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: item.color,
                        fontWeight: "700",
                        fontFamily: "Nunito",
                        fontSize: "3rem",
                      }}
                    >
                      {String(item?.value).padStart(2, "0")}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <CaseHistory
              tableLoading={tableLoading}
              searchText={searchText}
              handleKeyPress={handleKeyPress}
              clearSearchFromApi={clearSearchFromApi}
              data={caseHistory}
              userRole={userRole}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}
