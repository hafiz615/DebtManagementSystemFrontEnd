import React from "react";

import { Grid, Typography } from "@mui/material";

import { Colors } from "../../config/default";

export default function ClientImport() {
  const basicDetails = [
    { name: "First Name", value: "Rummaz" },
    { name: "Last Name", value: "khan" },
    { name: "Gender", value: "Male" },
    { name: "Age", value: "24" },
    { name: "SSN", value: "3123948424" },
  ];

  const contactInformation = [
    { name: "Primary #", value: "03211017632" },
    { name: "Email", value: "rummaz@gmail.com" },
    { name: "Address", value: "ghazi road" },
  ];

  const businessInformation = [
    { name: "Business Name", value: "The Pathans" },
    { name: "Business Type", value: "tech support" },
    { name: "Work Email", value: "Rummaz@luminogics.com" },
    { name: "EIN Number", value: "13231123" },
    { name: "Address", value: "ghazi chowl" },
  ];

  const automationPlan = [
    { name: "Debt", value: "$2000" },
    { name: "Time Period", value: "Monthly" },
    { name: "Authorization Date", value: "5/2/2024" },
    { name: "Captured Date", value: "8/2/2024" },
  ];

  return (
    <Grid xs={12}>
      <p style={{ fontWeight: "600", fontFamily: "Nunito" }}>Basic Details</p>
      <Grid container sx={{ gap: "1em" }}>
        {basicDetails?.map((item) => (
          <Grid
            xs={12}
            md={4}
            lg={2.5}
            sx={{
              display: "flex",
              mb: "10px",
              gap: "1em",
            }}
          >
            <Typography style={{ fontSize: "14px", fontFamily: "Nunito" }}>
              {item?.name}
            </Typography>
            <Typography
              style={{
                fontSize: "14px",
                color: Colors.DIM_LIGHT_GRAY,
                fontFamily: "Nunito",
              }}
            >
              {item?.value}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <p style={{ fontWeight: "600", fontFamily: "Nunito" }}>
        Contact Information
      </p>
      <Grid container sx={{ gap: "1em" }}>
        {contactInformation?.map((item) => (
          <Grid
            xs={12}
            md={4}
            lg={2.5}
            sx={{
              display: "flex",
              mb: "10px",
              gap: "1em",
            }}
          >
            <Typography style={{ fontSize: "14px", fontFamily: "Nunito" }}>
              {item?.name}
            </Typography>
            <Typography
              style={{
                fontSize: "14px",
                color: Colors.DIM_LIGHT_GRAY,
                fontFamily: "Nunito",
              }}
            >
              {item?.value}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <p style={{ fontWeight: "600", fontFamily: "Nunito" }}>
        Buisness Information
      </p>
      <Grid container sx={{ gap: "1em" }}>
        {businessInformation?.map((item) => (
          <Grid
            xs={12}
            md={4}
            lg={2.5}
            sx={{
              display: "flex",
              mb: "10px",
              gap: "1em",
            }}
          >
            <Typography style={{ fontSize: "14px", fontFamily: "Nunito" }}>
              {item?.name}
            </Typography>
            <Typography
              style={{
                fontSize: "14px",
                color: Colors.DIM_LIGHT_GRAY,
                fontFamily: "Nunito",
              }}
            >
              {item?.value}
            </Typography>
          </Grid>
        ))}
      </Grid>
      <Grid
        sx={{
          backgroundColor: Colors.WHITE,
          padding: "10px",
          m: "1em 0em",
          borderRadius: "10px",
        }}
      >
        <p style={{ fontWeight: "600", fontFamily: "Nunito" }}>
          Payment Plan Automation
        </p>
        <div
          style={{
            display: "flex",
            marginLeft: "25px",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <p style={{ fontFamily: "Nunito" }}>Total Receivable</p>
          <Typography sx={{ fontFamily: "Nunito" }}>$10,000</Typography>
        </div>
        <Grid
          sx={{
            border: `1px solid ${Colors.DIM_LIGHT_GRAY}`,
            height: "30vh",
            margin: "0px 25px",
            borderRadius: "10px",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#E5E5E5",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: Colors.WHITE,
              borderRadius: "8px",
            },
          }}
        >
          {Array.from({ length: 20 }, (_, index) => (
            <Grid
              container
              xs={12}
              sx={{
                padding: "0px 10px",
                alignItems: "center",
                gap: "1.5em",
                mt: "25px",
              }}
            >
              {automationPlan?.map((item) => (
                <Grid
                  item
                  xs={12}
                  md={5}
                  lg={2.5}
                  container
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography sx={{ fontFamily: "Nunito" }}>
                    {item?.name}
                  </Typography>
                  <Typography
                    sx={{ color: Colors.DIM_LIGHT_GRAY, fontFamily: "Nunito" }}
                  >
                    {item?.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
