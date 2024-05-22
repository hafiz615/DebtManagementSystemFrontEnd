import React from "react";
import { useSelector } from "react-redux";

import { Grid, Typography, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { UserListPage } from "../constants/appConstants";
import { Colors } from "../config/default";
import CaseHistory from "./caseHistory";

export default function ClientListDetails() {
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
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
          Client Name
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
                721-07-4426
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
                user@gmail.com
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
                Lorem Ipsum
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
                Lorem Ipsum
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
                Company Name
              </div>

              <span
                style={{
                  fontFamily: "Nunito",
                  fontWeight: "300",
                  fontSize: "0.9rem",
                  color: Colors.DIM_LIGHT_GRAY,
                }}
              >
                Lorem Ipsum
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
                Outstanding Debt
              </div>

              <span
                style={{
                  fontFamily: "Nunito",
                  fontWeight: "300",
                  fontSize: "0.9rem",
                  color: Colors.DIM_LIGHT_GRAY,
                }}
              >
                $10,000
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
                Total Debt
              </div>

              <span
                style={{
                  fontFamily: "Nunito",
                  fontWeight: "300",
                  fontSize: "0.9rem",
                  color: Colors.DIM_LIGHT_GRAY,
                }}
              >
                Lorem Ipsum
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
              { title: "Failed Payments", value: "05", color: Colors.BLACK },
              {
                title: "Failed Authorizations",
                value: "05",
                color: Colors.BLACK,
              },
              {
                title: "Successful Payments",
                value: "05",
                color: Colors.SKY_BLUE,
              },
              {
                title: "Successful Authorizations",
                value: "05",
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
        <CaseHistory />
      </Grid>
    </Grid>
  );
}
