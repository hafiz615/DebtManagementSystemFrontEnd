import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Grid, Typography, Box, CircularProgress } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { UserListPage } from "../constants/appConstants";
import { Colors } from "../config/default";
import CaseHistory from "./caseHistory";
import { GetClientById } from "../services/services";
import { isEmpty } from "lodash";

export default function ClientListDetails() {
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const [clientData, setClientData] = useState({});
  const [loading, setLoading] = useState("");
  const { id } = useParams();

  const GetClientDetails = async () => {
    setLoading(true);
    const getClientData = await GetClientById(id);

    if (getClientData?.status === 200) {
      setClientData(getClientData?.data?.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    GetClientDetails();
  }, []);
  const truncateText = (text, length) => {
    if (text?.length > length) {
      return text.substring(0, length) + "...";
    }
    return text;
  };
  const { AUTHORITY_TEXT } = UserListPage;
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
              {clientData?.debtor?.fullName}
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
                    }}
                  >
                    {clientData?.debtor?.SSN}
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
                    {truncateText(clientData?.debtor?.email, 25)}
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
                    {clientData?.debtor?.status}
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
                    }}
                  >
                    {truncateText(clientData?.debtor?.address, 30)}
                  </span>
                </Box>
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
                    {clientData?.debtor?.companyName}
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
                    {clientData?.debtor?.outstandingDebt}
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
                    {clientData?.debtor?.totalDebt}
                  </span>
                </Box>
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
                ].map((item, index) => (
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
                    <Typography sx={{ width: "7rem" }}>{item.title}</Typography>
                    <Typography
                      sx={{
                        color: item.color,
                        fontWeight: "700",
                        fontFamily: "Nunito",
                        fontSize: "3rem",
                      }}
                    >
                      {String(item.value).padStart(2, "0")}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <CaseHistory data={clientData?.caseHistory} />
          </Grid>
        </>
      )}
    </Grid>
  );
}
