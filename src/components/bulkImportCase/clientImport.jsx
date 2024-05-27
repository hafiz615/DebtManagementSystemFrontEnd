import React from "react";

import { Grid, Typography, Card } from "@mui/material";

import { Colors } from "../../config/default";

export default function ClientImport() {
  const debtorDetails = [
    { name: "Full Name" },
    { name: "Email" },
    { name: "SSN" },
    { name: "Status" },
    { name: "Country" },
    { name: "State" },
    { name: "City" },
    { name: "Zip Code" },
    { name: "Phone #" },
    { name: "Address" },
  ];

  const creditorDetails = [
    { name: "Full Name" },
    { name: "Company Name" },
    { name: "Address" },
    { name: "Email" },
    { name: "Business Category" },
    { name: "Notes" },
    { name: "Funded" },
    { name: "Phone #" },
  ];

  const automationPlan = [
    { name: "Debt", value: "$2000" },
    { name: "Time Period", value: "Monthly" },
    { name: "Authorization Date", value: "5/2/2024" },
    { name: "Captured Date", value: "8/2/2024" },
  ];

  return (
    <Grid
      xs={12}
      sx={{
        marginTop: ".5rem",
      }}
    >
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "1rem",
          padding: "1rem",
        }}
      >
        <Typography sx={{ fontWeight: "600", fontFamily: "Nunito" }}>
          Debtor Details
        </Typography>
        <Grid container sx={{ gap: "1em", mt: "1em" }}>
          {debtorDetails.map((debtDetail) => (
            <Grid
              key={debtDetail.name}
              xs={6}
              md={4}
              lg={2.5}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: "10px",
              }}
            >
              <Typography style={{ fontSize: "14px", fontFamily: "Nunito" }}>
                {debtDetail.name}
              </Typography>
              <Typography
                style={{
                  fontSize: "14px",
                  fontFamily: "Nunito",
                  color: Colors.DIM_LIGHT_GRAY,
                }}
              >
                ----
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Card>
      <Card
        sx={{
          boxShadow: "none",
          padding: "1rem",
          mt: "1em",
          borderRadius: "1rem",
        }}
      >
        <Typography sx={{ fontWeight: "600", fontFamily: "Nunito" }}>
          Creditors Details
        </Typography>
        <Grid container sx={{ gap: "1em", mt: "1em" }}>
          {creditorDetails.map((creditDetail) => (
            <Grid
              key={creditDetail.name}
              xs={6}
              md={4}
              lg={2.5}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: "10px",
              }}
            >
              <Typography sx={{ fontSize: "14px", fontFamily: "Nunito" }}>
                {creditDetail.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontFamily: "Nunito",
                  color: Colors.DIM_LIGHT_GRAY,
                }}
              >
                ----
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Card>

      <Grid
        sx={{
          backgroundColor: Colors.WHITE,
          padding: "10px",
          m: "1em 0em",
          borderRadius: "10px",
        }}
      >
        <Typography sx={{ fontWeight: "600", fontFamily: "Nunito" }}>
          Payment Plan Automation
        </Typography>
        <div
          style={{
            display: "flex",
            marginLeft: "25px",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <p style={{ fontFamily: "Nunito" }}>Total Receivable</p>
          <Typography sx={{ fontFamily: "Nunito" }}>----</Typography>
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
                  ----
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
