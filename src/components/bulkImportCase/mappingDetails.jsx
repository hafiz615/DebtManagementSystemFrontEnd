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

export default function MappingDetails({
  allDropdownStates,
  setAllDropdownStates,
}) {
  const [columnNames, setColumnNames] = useState([]);
  const smallScreen = useMediaQuery("(min-width:200px) and (max-width:760px)");
  const csvData = JSON.parse(localStorage.getItem("csvData"));
  var csvHeaders;

  const debtorDetails = [
    { name: "Full Name" },
    { name: "Email" },
    { name: "SSN" },
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
    { name: "URL" },
  ];

  const getFieldIndex = (headerName) => {
    let columnFieldIndex = getColumnFieldIndex(headerName, csvHeaders);
    let mainIndex = findColumnName(columnFieldIndex);
    return mainIndex;
  };

  const getCsvData = () => {
    const numColumns = parseInt(localStorage.getItem("Columns"), 10) || 0;
    setColumnNames(generateColumnNames(numColumns));
    csvHeaders = csvData?.meta?.fields;
    const initialDropdownStates = {};

    initialDropdownStates[`Full Name`] = getFieldIndex("display_name");
    initialDropdownStates[`Email`] = getFieldIndex(
      "primary_contact_primary_email"
    );
    initialDropdownStates[`SSN`] = getFieldIndex("custom.SSN");
    initialDropdownStates[`Status`] = getFieldIndex("status_label");
    initialDropdownStates[`Weekly Budget`] = getFieldIndex(
      "custom.Weekly Payment"
    );
    // initialDropdownStates[`Address`] =
    //   getFieldIndex("debtor_address");
    initialDropdownStates[`Company`] = getFieldIndex("custom.Plaintiffs");
    initialDropdownStates[`EIN`] = getFieldIndex("custom.EIN");
    // initialDropdownStates[`debtor-Business Category`] = getFieldIndex(
    //   "debtor_business_category"
    // );
    initialDropdownStates[`State`] = getFieldIndex(
      "custom.ClearoutPhone Location"
    );
    initialDropdownStates[`Description`] = getFieldIndex("description");
    // initialDropdownStates[`debtor-City`] = getFieldIndex(
    //   "debtor_business_city"
    // );
    // initialDropdownStates[`debtor-Zip Code`] = getFieldIndex(
    //   "debtor_business_zipcode"
    // );
    initialDropdownStates[`Phone #`] = getFieldIndex(
      "primary_contact_primary_phone"
    );
    initialDropdownStates[`URL`] = getFieldIndex("url");

    setAllDropdownStates(initialDropdownStates);
  };

  useEffect(() => {
    getCsvData();
  }, []);

  const handleDropdownChange = (itemName, selectedValue) => {
    setAllDropdownStates((prevStates) => {
      const newState = {
        ...prevStates,
        [`${itemName}`]: selectedValue,
      };
      return newState;
    });
  };

  const renderDropdown = (itemName) => {
    return (
      <Dropdown
        width={smallScreen ? "6.5" : "6.2rem"}
        height={smallScreen ? "2.5rem" : "2rem"}
        menuItems={columnNames}
        selectedValue={allDropdownStates?.[itemName] || "Col A"}
        setSelectedValue={(value) => handleDropdownChange(itemName, value)}
        backgroundColor={Colors.BG_LIGHT_GRAY}
        hoverColor={Colors.BG_LIGHT_GRAY}
      />
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
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "1rem",
          padding: "1rem",
          m: "1rem 0px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: "600", fontFamily: "Nunito" }}>
            Debtor Details
          </Typography>
        </div>
        <Grid container sx={{ gap: "1em", mt: "1em" }}>
          {debtorDetails?.map((debtDetail, detailIndex) => (
            <Grid
              key={detailIndex}
              item
              xs={12}
              sm={5}
              md={4}
              lg={2.5}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: smallScreen ? "0px" : "10px",
              }}
            >
              <Typography
                style={{
                  width: "50%",
                  fontSize: "14px",
                  fontFamily: "Nunito",
                }}
              >
                {debtDetail?.name}
              </Typography>
              <div style={{ width: "50%" }}>
                {renderDropdown(debtDetail?.name)}
              </div>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Grid>
  );
}
