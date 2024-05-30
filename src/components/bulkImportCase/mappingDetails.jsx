import React, { useState, useEffect } from "react";
import { Grid, Card, Typography } from "@mui/material";
import Dropdown from "../dropdown";
import { Colors } from "../../config/default";
import {
  findColumnName,
  generateColumnNames,
  getColumnFieldIndex,
} from "../../common";

export default function MappingDetails() {
  const [dropdownStates, setDropdownStates] = useState({});
  const [columnNames, setColumnNames] = useState([]);
  const csvDataFromLocal = localStorage?.getItem("csvData");

  const csvData = JSON?.parse(csvDataFromLocal);
  var csvHeaders;

  const debtorDetails = [
    { name: "Full Name" },
    { name: "Email" },
    { name: "SSN" },
    { name: "Status" },
    { name: "Address" },
    { name: "Company" },
    { name: "EIN" },
    { name: "Business Category" },
    { name: "Country" },
    { name: "State" },
    { name: "City" },
    { name: "Zip Code" },
    { name: "Phone #" },
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
    { name: "Debt" },
    { name: "Time Period" },
    { name: "Start Date" },
    { name: "Frequency" },
  ];

  const getFieldIndex = (headerName) => {
    let columnFieldIndex = getColumnFieldIndex(headerName, csvHeaders);
    let mainIndex = findColumnName(columnFieldIndex);
    return mainIndex;
  };

  const getColumnDataByName = (columnName) => {
    return csvData?.data[0][columnName];
  };

  const paymentPlansCount = parseInt(
    getColumnDataByName("payment_plans_count")
  );

  useEffect(() => {
    const numColumns = parseInt(localStorage.getItem("Columns"), 10) || 0;
    setColumnNames(generateColumnNames(numColumns));
    let csvData = JSON.parse(localStorage.getItem("csvData"));
    let dropdownLocalState = JSON.parse(localStorage.getItem("dropdownState"));
    csvHeaders = csvData?.meta?.fields;

    if (dropdownLocalState) {
      setDropdownStates(dropdownLocalState);
    } else {
      const initialDropdownStates = {};
      initialDropdownStates[`debtor-Full Name`] = getFieldIndex("debtor_name");
      initialDropdownStates[`debtor-Email`] = getFieldIndex("debtor_email");
      initialDropdownStates[`debtor-SSN`] = getFieldIndex("debtor_ssn");
      initialDropdownStates[`debtor-Status`] = getFieldIndex("debtor_status");
      initialDropdownStates[`debtor-Address`] = getFieldIndex("debtor_address");
      initialDropdownStates[`debtor-Company`] = getFieldIndex(
        "debtor_business_name"
      );
      initialDropdownStates[`debtor-EIN`] = getFieldIndex(
        "debtor_business_ein"
      );
      initialDropdownStates[`debtor-Business Category`] = getFieldIndex(
        "debtor_business_category"
      );
      initialDropdownStates[`debtor-Country`] = getFieldIndex(
        "debtor_business_country"
      );
      initialDropdownStates[`debtor-State`] = getFieldIndex(
        "debtor_business_state"
      );
      initialDropdownStates[`debtor-City`] = getFieldIndex(
        "debtor_business_city"
      );
      initialDropdownStates[`debtor-Zip Code`] = getFieldIndex(
        "debtor_business_zipcode"
      );
      initialDropdownStates[`debtor-Phone #`] = getFieldIndex(
        "debtor_business_phone"
      );
      initialDropdownStates[`creditor-Full Name`] =
        getFieldIndex("creditor_name");
      initialDropdownStates[`creditor-Company Name`] = getFieldIndex(
        "creditor_business_name"
      );
      initialDropdownStates[`creditor-Address`] = getFieldIndex(
        "debtor_business_phone"
      );
      initialDropdownStates[`creditor-Email`] = getFieldIndex("creditor_email");
      initialDropdownStates[`creditor-Business Category`] = getFieldIndex(
        "creditor_business_category"
      );
      initialDropdownStates[`creditor-Notes`] = getFieldIndex("creditor_notes");
      initialDropdownStates[`creditor-Funded`] = getFieldIndex("date_funded");
      initialDropdownStates[`creditor-Phone #`] =
        getFieldIndex("creditor_phone");
      initialDropdownStates[`automation-Total Receivable`] = getFieldIndex(
        "total_remaining_amount"
      );
      initialDropdownStates[`automation-Debt`] =
        getFieldIndex("payment_1_amount");
      initialDropdownStates[`automation-Time Period`] =
        getFieldIndex("payment_1_interval");
      initialDropdownStates[`automation-Start Date`] = getFieldIndex(
        "payment_1_start_date"
      );
      initialDropdownStates[`automation-Frequency`] = getFieldIndex(
        "payment_1_frequency"
      );
      setDropdownStates(initialDropdownStates);
      localStorage.setItem(
        "dropdownState",
        JSON.stringify(initialDropdownStates)
      );
    }
  }, []);

  const handleDropdownChange = (category, itemName, selectedValue) => {
    setDropdownStates((prevStates) => {
      const newState = {
        ...prevStates,
        [`${category}-${itemName}`]: selectedValue,
      };
      localStorage.setItem("dropdownState", JSON.stringify(newState));
      return newState;
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
            {[...Array(paymentPlansCount)]?.map((_, index) => (
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
