import React, { useState } from "react";

import { Grid } from "@mui/material";

import Dropdown from "../dropdown";
import { Colors } from "../../config/default";

export default function MappingDetails({ fields }) {
  const [selectedValue, setSelectedValue] = useState("3");

  const menuItems = [
    { label: "5", value: 5 },
    { label: "7", value: 7 },
  ];
  return (
    <Grid item xs={12}>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: ".5rem",
        }}
      >
        <p style={{ fontWeight: "600" }}>Basic Details</p>
        <div style={{ display: "flex", gap: "15px", padding: "0px 10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "20%",
              justifyContent: "space-between",
            }}
          >
            <p>first Name</p>
            <Dropdown
              width="40%"
              height="2rem"
              menuItems={menuItems}
              defaultSelectedItem={"4/2/2024"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.WHITE}
              hoverColor={Colors.WHITE}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "20%",
              justifyContent: "space-between",
            }}
          >
            <p>Last Name</p>
            <Dropdown
              width="40%"
              menuItems={menuItems}
              defaultSelectedItem={"4/2/2024"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.WHITE}
              hoverColor={Colors.WHITE}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "20%",
              justifyContent: "space-between",
            }}
          >
            <p>Gender</p>
            <Dropdown
              width="40%"
              menuItems={menuItems}
              defaultSelectedItem={"4/2/2024"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.WHITE}
              hoverColor={Colors.WHITE}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "20%",
              justifyContent: "space-between",
            }}
          >
            <p>Age</p>
            <Dropdown
              width="40%"
              menuItems={menuItems}
              defaultSelectedItem={"4/2/2024"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.WHITE}
              hoverColor={Colors.WHITE}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "20%",
              justifyContent: "space-between",
            }}
          >
            <p>SSID Number</p>
            <Dropdown
              width="40%"
              menuItems={menuItems}
              defaultSelectedItem={"4/2/2024"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.WHITE}
              hoverColor={Colors.WHITE}
            />
          </div>
        </div>
        <p style={{ fontWeight: "600" }}>Contact Information</p>
        <div style={{ display: "flex", gap: "15px", padding: "0px 10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "20%",
              justifyContent: "space-between",
            }}
          >
            <p>Primary #</p>
            <Dropdown
              width="40%"
              menuItems={menuItems}
              defaultSelectedItem={"4/2/2024"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.WHITE}
              hoverColor={Colors.WHITE}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "20%",
              justifyContent: "space-between",
            }}
          >
            <p>Email</p>
            <Dropdown
              width="40%"
              menuItems={menuItems}
              defaultSelectedItem={"4/2/2024"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.WHITE}
              hoverColor={Colors.WHITE}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "20%",
              justifyContent: "space-between",
            }}
          >
            <p>Address 1</p>
            <Dropdown
              width="40%"
              menuItems={menuItems}
              defaultSelectedItem={"4/2/2024"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.WHITE}
              hoverColor={Colors.WHITE}
            />
          </div>
        </div>
        <p style={{ fontWeight: "600" }}>Buisness Information</p>
        <div
          style={{
            display: "flex",
            gap: "15px",
            padding: "0px 10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "20%",
              justifyContent: "space-between",
            }}
          >
            <p>Buisness Name</p>
            <Dropdown
              width="40%"
              menuItems={menuItems}
              defaultSelectedItem={"4/2/2024"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.WHITE}
              hoverColor={Colors.WHITE}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "20%",
              justifyContent: "space-between",
            }}
          >
            <p>Buisness Type</p>
            <Dropdown
              width="40%"
              menuItems={menuItems}
              defaultSelectedItem={"4/2/2024"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.WHITE}
              hoverColor={Colors.WHITE}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "20%",
              justifyContent: "space-between",
            }}
          >
            <p>Work Email</p>
            <Dropdown
              width="40%"
              menuItems={menuItems}
              defaultSelectedItem={"4/2/2024"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.WHITE}
              hoverColor={Colors.WHITE}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "20%",
              justifyContent: "space-between",
            }}
          >
            <p>EIN Number</p>
            <Dropdown
              width="40%"
              menuItems={menuItems}
              defaultSelectedItem={"4/2/2024"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.WHITE}
              hoverColor={Colors.WHITE}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "20%",
              justifyContent: "space-between",
            }}
          >
            <p>Address 1</p>
            <Dropdown
              width="40%"
              menuItems={menuItems}
              defaultSelectedItem={"4/2/2024"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.WHITE}
              hoverColor={Colors.WHITE}
            />
          </div>
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
