import React, { useState, useEffect } from "react";
import { Grid, Card, Typography } from "@mui/material";
import Dropdown from "../dropdown";
import { Colors } from "../../config/default";
import { generateColumnNames } from "../../common";

export default function MappingDetails() {
  const [dropdownStates, setDropdownStates] = useState({});
  const [columnNames, setColumnNames] = useState([]);
  const [csvData, setCsvData] = useState([]);

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

  useEffect(() => {
    const numColumns = parseInt(localStorage.getItem("Columns"), 10) || 0;
    const csvDataFromLocal = localStorage.getItem("csvData");
    if (csvDataFromLocal) {
      setCsvData(JSON.parse(csvDataFromLocal));
    }
    setColumnNames(generateColumnNames(numColumns));
    const initialDropdownStates = {};
    [...debtorDetails, ...creditorDetails, ...automationPlan].forEach(
      (detail) => {
        initialDropdownStates[`debtor-${detail.name}`] = "Col A";
        initialDropdownStates[`creditor-${detail.name}`] = "Col A";
        initialDropdownStates[`automation-${detail.name}`] = "Col A";
      }
    );
    setDropdownStates(initialDropdownStates);
  }, []);

  const handleDropdownChange = (category, itemName, selectedValue) => {
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [`${category}-${itemName}`]: selectedValue,
    }));
  };
  console.log(dropdownStates, "dropdownstate");

  const getColumnData = (columnIndex) => {
    return csvData.map((row) => {
      const keys = Object.keys(row);
      return row[keys[columnIndex]];
    });
  };

  const renderDropdown = (category, itemName) => (
    <Dropdown
      width="6rem"
      height="2rem"
      menuItems={columnNames}
      selectedValue={dropdownStates[`${category}-${itemName}`] || "Col A"}
      setSelectedValue={(value) =>
        handleDropdownChange(category, itemName, value)
      }
      backgroundColor={Colors.BG_LIGHT_GRAY}
      hoverColor={Colors.BG_LIGHT_GRAY}
    />
  );

  const renderData = (category, itemName) => {
    const selectedColumn = dropdownStates[`${category}-${itemName}`];

    if (selectedColumn) {
      const columnIndex = columnNames.findIndex(
        (col) => col.value === selectedColumn
      );
      console.log(` ${itemName} have this${columnIndex} column index `);

      if (columnIndex !== -1) {
        const data = getColumnData(columnIndex);
      }
    }
    return null;
  };
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
                {renderDropdown("debtor", debtDetail.name)}
                {renderData("debtor", debtDetail.name)}
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
                <Typography sx={{ fontFamily: "Nunito", fontSize: "14px" }}>
                  {creditDetail.name}
                </Typography>
                {renderDropdown("creditor", creditDetail.name)}
                {renderData("creditor", creditDetail.name)}
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
            {renderDropdown("automation", "Total Receivable")}
            {renderData("automation", "Total Receivable")}
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
                mt: "25px",
                gap: "1em",
              }}
            >
              {automationPlan.map((item) => (
                <Grid
                  key={item.name}
                  item
                  xs={12}
                  md={5.5}
                  lg={2.75}
                  container
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography sx={{ fontFamily: "Nunito", fontSize: "14px" }}>
                    {item.name}
                  </Typography>
                  {renderDropdown("automation", item.name)}
                  {renderData("automation", item.name)}
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
