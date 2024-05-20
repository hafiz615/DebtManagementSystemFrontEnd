import React from "react";
import { useSelector } from "react-redux";

import { Grid, Typography, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { UserListPage } from "../constants/appConstants";
import { Colors } from "../config/default";

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
        }}
      >
        <Grid container item xs={12} lg={7}>
          <Grid item xs={12} lg={6} sx={{ border: "1px solid red" }}>
            <Typography>
              SSN <span>721-07-4426</span>
            </Typography>
            <Typography>
              Email <span>user@email.com</span>
            </Typography>
            <Typography>
              Status <span>Lorem Ipsum</span>
            </Typography>
            <Typography>
              Address <span>Lorem Ipsum</span>
            </Typography>
          </Grid>
          <Grid item xs={12} lg={6} sx={{ border: "1px solid red" }}>
            <Typography>
              Company Name <span>Loriem Ipsum</span>
            </Typography>
            <Typography>
              Email <span>user@email.com</span>
            </Typography>
            <Typography>
              Status <span>Lorem Ipsum</span>
            </Typography>
            <Typography>
              Address <span>Lorem Ipsum</span>
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs={12}
          lg={5}
          sx={{ justifyContent: "space-between" }}
        >
          {/* <Grid
            container
            item
            xs={12}
            lg={5.8}
            sx={{
              backgroundColor: Colors?.WHITE,
              justifyContent: "space-around",
              alignItems: "center",
              borderRadius: "10px",
            }}
          >
            <Typography>Failed Payments</Typography>

            <Typography
              sx={{
                color: Colors?.BLACK,
                fontWeight: "700",
                fontFamily: "Nunito",
                fontSize: "4rem",
              }}
            >
              05
            </Typography>
          </Grid> */}
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
      </Grid>
    </Grid>
  );
}
