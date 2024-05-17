import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Grid, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../../config/default";
import { UserListPage } from "../../constants/appConstants";
import Dropdown from "../dropdown";

function BulkImportCase() {
  const [selectedValue, setSelectedValue] = useState("3");

  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;

  const menuItems = [
    { label: "5", value: 5 },
    { label: "7", value: 7 },
  ];

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
          Mapping
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: "1.5rem",
        }}
      >
        <p style={{ fontWeight: "600" }}>Basic Details</p>
        <div style={{ display: "flex", gap: "15px", padding: "0px 10px" }}>
          <p>first Name</p>
          <Dropdown
            width="10%"
            menuItems={menuItems}
            defaultSelectedItem={"4/2/2024"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.WHITE}
            hoverColor={Colors.WHITE}
          />
          <p>Last Name</p>
          <Dropdown
            width="10%"
            menuItems={menuItems}
            defaultSelectedItem={"4/2/2024"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.WHITE}
            hoverColor={Colors.WHITE}
          />
          <p>Gender</p>
          <Dropdown
            width="10%"
            menuItems={menuItems}
            defaultSelectedItem={"4/2/2024"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.WHITE}
            hoverColor={Colors.WHITE}
          />
          <p>Age</p>
          <Dropdown
            width="10%"
            menuItems={menuItems}
            defaultSelectedItem={"4/2/2024"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.WHITE}
            hoverColor={Colors.WHITE}
          />
          <p>SSID Number</p>
          <Dropdown
            width="10%"
            menuItems={menuItems}
            defaultSelectedItem={"4/2/2024"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.WHITE}
            hoverColor={Colors.WHITE}
          />
        </div>
        <p style={{ fontWeight: "600" }}>Contact Information</p>
        <div style={{ display: "flex", gap: "15px", padding: "0px 10px" }}>
          <p>Primary #</p>
          <Dropdown
            width="10%"
            menuItems={menuItems}
            defaultSelectedItem={"4/2/2024"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.WHITE}
            hoverColor={Colors.WHITE}
          />
          <p>Email</p>
          <Dropdown
            width="10%"
            menuItems={menuItems}
            defaultSelectedItem={"4/2/2024"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.WHITE}
            hoverColor={Colors.WHITE}
          />
          <p>Address 1</p>
          <Dropdown
            width="10%"
            menuItems={menuItems}
            defaultSelectedItem={"4/2/2024"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.WHITE}
            hoverColor={Colors.WHITE}
          />
        </div>
        <p style={{ fontWeight: "600" }}>Buisness Information</p>
        <div
          style={{
            display: "flex",
            gap: "15px",
            padding: "0px 10px",
          }}
        >
          <p>Buisness Name</p>
          <Dropdown
            width="10%"
            menuItems={menuItems}
            defaultSelectedItem={"4/2/2024"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.WHITE}
            hoverColor={Colors.WHITE}
          />
          <p>Buisness Type</p>
          <Dropdown
            width="10%"
            menuItems={menuItems}
            defaultSelectedItem={"4/2/2024"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.WHITE}
            hoverColor={Colors.WHITE}
          />
          <p>Work Email</p>
          <Dropdown
            width="10%"
            menuItems={menuItems}
            defaultSelectedItem={"4/2/2024"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.WHITE}
            hoverColor={Colors.WHITE}
          />
          <p>EIN Number</p>
          <Dropdown
            width="10%"
            menuItems={menuItems}
            defaultSelectedItem={"4/2/2024"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.WHITE}
            hoverColor={Colors.WHITE}
          />
          <p>Address 1</p>
          <Dropdown
            width="10%"
            menuItems={menuItems}
            defaultSelectedItem={"4/2/2024"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.WHITE}
            hoverColor={Colors.WHITE}
          />
        </div>
        <Grid
          sx={{
            backgroundColor: Colors.WHITE,
            padding: "10px",
            m: "1em 0em",
            borderRadius: "10px",
          }}
        >
          <p style={{ fontWeight: "600" }}>Payment Plan Automation</p>
          <div style={{ display: "flex", marginLeft: "25px" }}>
            <p>Total Receivable</p>
            <Dropdown
              width="10%"
              menuItems={menuItems}
              defaultSelectedItem={"4/2/2024"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.WHITE}
              hoverColor={Colors.WHITE}
            />
          </div>
          <Grid
            sx={{
              border: "1px solid grey",
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0px 10px",
                }}
              >
                <p>Debt</p>
                <Dropdown
                  width="10%"
                  menuItems={menuItems}
                  defaultSelectedItem={"4/2/2024"}
                  selectedValue={selectedValue}
                  setSelectedValue={setSelectedValue}
                  backgroundColor={Colors.WHITE}
                  hoverColor={Colors.WHITE}
                />
                <p>Time Period</p>
                <Dropdown
                  width="10%"
                  menuItems={menuItems}
                  defaultSelectedItem={"4/2/2024"}
                  selectedValue={selectedValue}
                  setSelectedValue={setSelectedValue}
                  backgroundColor={Colors.WHITE}
                  hoverColor={Colors.WHITE}
                />
                <p>Authorization Date</p>
                <Dropdown
                  width="10%"
                  menuItems={menuItems}
                  defaultSelectedItem={"4/2/2024"}
                  selectedValue={selectedValue}
                  setSelectedValue={setSelectedValue}
                  backgroundColor={Colors.WHITE}
                  hoverColor={Colors.WHITE}
                />
                <p>Captured Date</p>
                <Dropdown
                  width="10%"
                  menuItems={menuItems}
                  defaultSelectedItem={"4/2/2024"}
                  selectedValue={selectedValue}
                  setSelectedValue={setSelectedValue}
                  backgroundColor={Colors.WHITE}
                  hoverColor={Colors.WHITE}
                />
              </div>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default BulkImportCase;
