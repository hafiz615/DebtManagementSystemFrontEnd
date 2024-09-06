import React, { useState, useEffect } from "react";
import { Grid, Card, Typography } from "@mui/material";
import Dropdown from "../dropdown";
import { Colors } from "../../config/default";
import {
  findColumnName,
  generateColumnNames,
  getColumnFieldIndex,
} from "../../common";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function MappingDetails() {
  const [dropdownStates, setDropdownStates] = useState({});
  const [columnNames, setColumnNames] = useState([]);
  const csvDataFromLocal = localStorage?.getItem("csvData");
  const smallScreen = useMediaQuery("(min-width:200px) and (max-width:760px)");

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
      initialDropdownStates[`debtor-Full Name-0`] =
        getFieldIndex("debtor_name");
      initialDropdownStates[`debtor-Email-0`] = getFieldIndex("debtor_email");
      initialDropdownStates[`debtor-SSN-0`] = getFieldIndex("debtor_ssn");
      initialDropdownStates[`debtor-Status-0`] = getFieldIndex("debtor_status");
      initialDropdownStates[`debtor-Address-0`] =
        getFieldIndex("debtor_address");
      initialDropdownStates[`debtor-Company-0`] = getFieldIndex(
        "debtor_business_name"
      );
      initialDropdownStates[`debtor-EIN-0`] = getFieldIndex(
        "debtor_business_ein"
      );
      initialDropdownStates[`debtor-Business Category-0`] = getFieldIndex(
        "debtor_business_category"
      );
      initialDropdownStates[`debtor-State-0`] = getFieldIndex(
        "debtor_business_state"
      );
      initialDropdownStates[`debtor-City-0`] = getFieldIndex(
        "debtor_business_city"
      );
      initialDropdownStates[`debtor-Zip Code-0`] = getFieldIndex(
        "debtor_business_zipcode"
      );
      initialDropdownStates[`debtor-Phone #-0`] = getFieldIndex(
        "debtor_business_phone"
      );
      initialDropdownStates[`creditor-Full Name-0`] =
        getFieldIndex("creditor_name");
      initialDropdownStates[`creditor-Company Name-0`] = getFieldIndex(
        "creditor_business_name"
      );
      initialDropdownStates[`creditor-Address-0`] = getFieldIndex(
        "debtor_business_phone"
      );
      initialDropdownStates[`creditor-Email-0`] =
        getFieldIndex("creditor_email");
      initialDropdownStates[`creditor-Business Category-0`] = getFieldIndex(
        "creditor_business_category"
      );
      initialDropdownStates[`creditor-Notes-0`] =
        getFieldIndex("creditor_notes");
      initialDropdownStates[`creditor-Funded-0`] = getFieldIndex("date_funded");
      initialDropdownStates[`creditor-Phone #-0`] =
        getFieldIndex("creditor_phone");
      initialDropdownStates[`automation-Total Receivable-0`] = getFieldIndex(
        "total_remaining_amount"
      );
      initialDropdownStates[`automation-Debt-0`] =
        getFieldIndex("payment_1_amount");
      initialDropdownStates[`automation-Time Period-0`] =
        getFieldIndex("payment_1_interval");
      initialDropdownStates[`automation-Start Date-0`] = getFieldIndex(
        "payment_1_start_date"
      );
      initialDropdownStates[`automation-Frequency-0`] = getFieldIndex(
        "payment_1_frequency"
      );
      for (let i = 1; i < paymentPlansCount; i++) {
        automationPlan.forEach((item) => {
          initialDropdownStates[`automation-${item.name}-${i}`] = getFieldIndex(
            `payment_${i + 1}_${item.name.toLowerCase().replace(" ", "_")}`
          );
        });
      }
      setDropdownStates(initialDropdownStates);
      localStorage.setItem(
        "dropdownState",
        JSON.stringify(initialDropdownStates)
      );
    }
  }, []);

  const handleDropdownChange = (category, itemName, selectedValue, index) => {
    setDropdownStates((prevStates) => {
      const newState = {
        ...prevStates,
        [`${category}-${itemName}-${index}`]: selectedValue,
      };
      localStorage.setItem("dropdownState", JSON.stringify(newState));
      return newState;
    });
  };

  const renderDropdown = (category, itemName, index) => (
    <Dropdown
      width={smallScreen ? "6.5" : "6.2rem"}
      height={smallScreen ? "2.5rem" : "2rem"}
      menuItems={columnNames}
      selectedValue={
        dropdownStates[`${category}-${itemName}-${index}`] || "Col A"
      }
      setSelectedValue={(value) =>
        handleDropdownChange(category, itemName, value, index)
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
                xs={12}
                sm={5}
                md={4}
                lg={2.5}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: smallScreen ? "0px" : "10px",
                }}
              >
                <Typography style={{ fontSize: "14px", fontFamily: "Nunito" }}>
                  {debtDetail.name}
                </Typography>
                {renderDropdown("debtor", debtDetail.name, 0)}
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
                xs={12}
                sm={5}
                md={4}
                lg={2.5}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: smallScreen ? "0px" : "10px",
                }}
              >
                <Typography sx={{ fontFamily: "Nunito", fontSize: "14px" }}>
                  {creditDetail.name}
                </Typography>
                {renderDropdown("creditor", creditDetail.name, 0)}
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
            {renderDropdown("automation", "Total Receivable", 0)}
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
            {Array.isArray(new Array(paymentPlansCount)) &&
              paymentPlansCount > 0 &&
              [...Array(paymentPlansCount)]?.map((_, index) => (
                <Grid
                  container
                  xs={12}
                  sx={{
                    padding: "0px 10px",
                    alignItems: "center",
                    mt: "25px",
                    gap: "1em",
                  }}
                  key={index}
                >
                  {automationPlan?.map((item, itemIndex) => (
                    <Grid
                      key={itemIndex}
                      item
                      xs={12}
                      sm={5}
                      md={5.5}
                      lg={2.75}
                      container
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Typography
                        sx={{ fontFamily: "Nunito", fontSize: "14px" }}
                      >
                        {item?.name}
                      </Typography>
                      {renderDropdown("automation", item?.name, index)}
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
