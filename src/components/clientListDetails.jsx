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
              lg={5.5}
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
                    {clientData?.debtor?.SSID}
                  </span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "6rem",
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
                    }}
                  >
                    {clientData?.debtor?.email}
                  </span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "6rem",
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
                    }}
                  >
                    Phone No
                  </div>

                  <span
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "300",
                      fontSize: "0.9rem",
                      color: Colors.DIM_LIGHT_GRAY,
                    }}
                  >
                    {clientData?.debtor?.phone}
                  </span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "6rem",
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
                    }}
                  >
                    {clientData?.debtor?.address}
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
                    }}
                  >
                    Country
                  </div>

                  <span
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "300",
                      fontSize: "0.9rem",
                      color: Colors.DIM_LIGHT_GRAY,
                    }}
                  >
                    {clientData?.debtor?.country}
                  </span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "10rem",
                    }}
                  >
                    City
                  </div>

                  <span
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "300",
                      fontSize: "0.9rem",
                      color: Colors.DIM_LIGHT_GRAY,
                    }}
                  >
                    {clientData?.debtor?.city}
                  </span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "10rem",
                    }}
                  >
                    State
                  </div>

                  <span
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "300",
                      fontSize: "0.9rem",
                      color: Colors.DIM_LIGHT_GRAY,
                    }}
                  >
                    {clientData?.debtor?.state}
                  </span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "10rem",
                    }}
                  >
                    Zip Code
                  </div>

                  <span
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "300",
                      fontSize: "0.9rem",
                      color: Colors.DIM_LIGHT_GRAY,
                    }}
                  >
                    {clientData?.debtor?.zipCode}
                  </span>
                </Box>
              </Grid>
            </Grid>

            <Grid
              container
              item
              xs={12}
              lg={6}
              sx={{ justifyContent: "space-between" }}
            >
              <Grid container sx={{ justifyContent: "space-around" }}>
                {[
                  {
                    title: "Failed Payments",
                    value: clientData?.paymentsCount?.failedPayments,
                    color: Colors.BLACK,
                  },
                  {
                    title: "Failed Authorizations",
                    value: clientData?.paymentsCount?.failedAuthorizations,
                    color: Colors.BLACK,
                  },
                  {
                    title: "Successful Payments",
                    value: clientData?.paymentsCount?.successPayments,
                    color: Colors.SKY_BLUE,
                  },
                  {
                    title: "Successful Authorizations",
                    value: clientData?.paymentsCount?.successAuthorizations,
                    color: Colors.SKY_BLUE,
                  },
                ].map((item, index) => (
                  <Grid
                    key={index}
                    container
                    item
                    xs={12}
                    lg={5.8}
                    sx={{
                      backgroundColor: Colors?.WHITE,
                      justifyContent: "space-around",
                      alignItems: "center",
                      borderRadius: "10px",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Typography>{item.title}</Typography>
                    <Typography
                      sx={{
                        color: item.color,
                        fontWeight: "700",
                        fontFamily: "Nunito",
                        fontSize: "4rem",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <CaseHistory data={clientData?.columns} />
          </Grid>
        </>
      )}
    </Grid>
  );
}
