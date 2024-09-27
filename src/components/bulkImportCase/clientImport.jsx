import React, { useEffect, useState } from "react";

import { Grid, Typography, Card } from "@mui/material";

import { Colors } from "../../config/default";
import {
  formatCsvValues,
  generateColumnNames,
  sanitizePhoneNumber,
  sanitizeBudget,
} from "../../common";

export default function ClientImport({ setApiData, allDropdownStates }) {
  const csvDataFromLocal = JSON.parse(localStorage.getItem("csvData"));
  const numColumns = parseInt(localStorage.getItem("Columns"), 10) || 0;
  const apiDataSet = { debtors: [] };
  const columnNaming = generateColumnNames(numColumns);

  const debtorDetails = [
    { name: "Full Name" },
    { name: "Email" },
    { name: "SSID" },
    { name: "Status" },
    { name: "State" },
    { name: "City" },
    { name: "Zip Code" },
    { name: "Phone #" },
    { name: "Address" },
    { name: "Weekly Budget" },
    { name: "Company" },
    { name: "EIN" },
    { name: "Business Category" },
    { name: "Description" },
  ];

  const getColumnData = (columnIndex, rowIndex) => {
    if (!csvDataFromLocal?.data || csvDataFromLocal?.data?.length === 0) {
      return null;
    }
    const keys = Object.keys(csvDataFromLocal?.data[rowIndex]);
    return csvDataFromLocal?.data[rowIndex][keys[columnIndex]];
  };

  const getDataBySelectedDropdown = (itemName, index) => {
    const selectedColumn = allDropdownStates[`${itemName}`];
    const columnIndex = columnNaming?.findIndex(
      (col) => col.value === selectedColumn
    );
    return getColumnData(columnIndex, index);
  };

  const createPayloadData = () => {
    const newDebtors = csvDataFromLocal?.data
      ?.map((row, index) => ({ row, index }))
      ?.filter(({ row }) => Object.values(row)?.some((value) => value))
      ?.map(({ row, index }) => ({
        basicInformation: {
          fullName: getDataBySelectedDropdown("Full Name", index) || "",
          email: getDataBySelectedDropdown("Email", index) || "",
          SSID: formatCsvValues(getDataBySelectedDropdown("SSID", index)) || "",
          status: getDataBySelectedDropdown("Status", index) || "",
          state: getDataBySelectedDropdown("State", index) || "",
          city: getDataBySelectedDropdown("City", index) || "",
          zipCode: getDataBySelectedDropdown("Zip Code", index) || "",
          phone:
            sanitizePhoneNumber(getDataBySelectedDropdown("Phone #", index)) ||
            "",
          address: getDataBySelectedDropdown("Address", index) || "",
          weeklyBudget:
            sanitizeBudget(getDataBySelectedDropdown("Weekly Budget", index)) ||
            0,
        },
        businessInformation: {
          companyName: getDataBySelectedDropdown("Company", index) || "",
          EIN: formatCsvValues(getDataBySelectedDropdown("EIN", index)) || "",
          businessCategory: getDataBySelectedDropdown("Category", index) || "",
          description: getDataBySelectedDropdown("Description", index) || "",
        },
        driveUrl: getDataBySelectedDropdown("URL", index),
        contacts: [],
      }));

    apiDataSet.debtors = newDebtors;
    setApiData(apiDataSet);
  };

  useEffect(() => {
    createPayloadData();
  }, []);

  const renderData = (itemName, index) => {
    const selectedColumn = allDropdownStates
      ? allDropdownStates[`${itemName}`]
      : null;
    const columnIndex = columnNaming?.findIndex(
      (col) => col.value === selectedColumn
    );
    const data = getColumnData(columnIndex, index);

    return (
      <Typography
        sx={{
          fontSize: "14px",
          fontFamily: "Nunito",
          color: data ? Colors.DIM_LIGHT_GRAY : Colors.ORANGE_COLOR,
        }}
      >
        {data || "Not Found In Csv"}
      </Typography>
    );
  };

  return (
    <Grid
      item
      xs={12}
      sx={{
        marginTop: ".5rem",
        height: "60vh",
      }}
    >
      {csvDataFromLocal?.data
        ?.map((row, originalRowIndex) => ({ row, originalRowIndex }))
        ?.filter(({ row }) => Object.values(row).some((value) => value))
        ?.map(({ row, originalRowIndex }, actualIndex) => (
          <Card
            key={originalRowIndex}
            sx={{
              boxShadow: "none",
              borderRadius: "1rem",
              padding: "1rem",
              m: "1rem 0px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontWeight: "600", fontFamily: "Nunito" }}>
                Debtor {actualIndex + 1} Details
              </Typography>
            </div>
            <Grid container sx={{ gap: "1em", mt: "1em" }}>
              {debtorDetails?.map((debtDetail, debtDetailIndex) => (
                <Grid
                  key={`${originalRowIndex}-${debtDetailIndex}`}
                  item
                  xs={12}
                  sm={5}
                  md={4}
                  lg={2.5}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1em",
                    mb: { xs: "0px", sm: "10px" },
                    justifyContent: { xs: "space-between", sm: "unset" },
                  }}
                >
                  <Typography
                    style={{ fontSize: "14px", fontFamily: "Nunito" }}
                  >
                    {debtDetail?.name}
                  </Typography>
                  {renderData(debtDetail?.name, originalRowIndex)}
                </Grid>
              ))}
            </Grid>
          </Card>
        ))}
    </Grid>
  );
}
