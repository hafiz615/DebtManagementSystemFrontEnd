import React, { useState } from "react";

import { Grid, Card, Typography } from "@mui/material";

import Dropdown from "../dropdown";
import { Colors } from "../../config/default";

export default function MappingDetails() {
  const [selectedValue, setSelectedValue] = useState("Col A");

  const menuItems = [
    { label: "5", value: 5 },
    { label: "7", value: 7 },
  ];

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
  const creditorDetail = [
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
    <Grid xs={12}>
      <Grid
        item
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
          <p style={{ fontWeight: "600", fontFamily: "Nunito" }}>
            Debtor Details
          </p>
          <Grid container sx={{ gap: "1em" }}>
            {debtorDetails?.map((debtDetails) => (
              <Grid
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
                  {debtDetails?.name}
                </Typography>
                <Dropdown
                  width="6rem"
                  height="2rem"
                  menuItems={menuItems}
                  defaultSelectedItem={"4/2/2024"}
                  selectedValue={selectedValue}
                  setSelectedValue={setSelectedValue}
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                />
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
          <p style={{ fontWeight: "600", fontFamily: "Nunito" }}>
            Creditors Details
          </p>
          <Grid container sx={{ gap: "1em" }}>
            {creditorDetail?.map((creditDetails) => (
              <Grid
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
                  {creditDetails?.name}
                </Typography>
                <Dropdown
                  width="6rem"
                  height="2rem"
                  menuItems={menuItems}
                  defaultSelectedItem={"4/2/2024"}
                  selectedValue={selectedValue}
                  setSelectedValue={setSelectedValue}
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                />
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
            <Dropdown
              width="6rem"
              height="2rem"
              menuItems={menuItems}
              defaultSelectedItem={"4/2/2024"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
            />
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
                  mt: "25px",
                  gap: "1em",
                }}
              >
                {automationPlan?.map((item) => (
                  <Grid
                    item
                    xs={12}
                    md={5.5}
                    lg={2.75}
                    container
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Typography sx={{ fontFamily: "Nunito", fontSize: "14px" }}>
                      {item?.name}
                    </Typography>
                    <Dropdown
                      width="6rem"
                      height="2rem"
                      menuItems={menuItems}
                      defaultSelectedItem={"4/2/2024"}
                      selectedValue={selectedValue}
                      setSelectedValue={setSelectedValue}
                      backgroundColor={Colors.BG_LIGHT_GRAY}
                      hoverColor={Colors.BG_LIGHT_GRAY}
                    />
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
