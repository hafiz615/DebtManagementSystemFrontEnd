import React, { useEffect, useState } from "react";

import { Grid, Typography, Card, IconButton } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { Colors } from "../../config/default";
import { generateColumnNames } from "../../common";

export default function ClientImport({ setApiData }) {
  const [columnNames, setColumnNames] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [currentCase, setCurrentCase] = useState(0);

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

  const getColumnData = (columnIndex) => {
    if (!csvData?.data || csvData.data.length === 0) {
      return null;
    }
    const keys = Object.keys(csvData?.data[currentCase]);
    return csvData?.data[currentCase][keys[columnIndex]];
  };

  const getColumnDataByName = (columnName, index) => {
    const csvDataFromLocal = JSON.parse(localStorage.getItem("csvData"));
    return csvDataFromLocal?.data[index][columnName];
  };

  const paymentPlansCount = parseInt(
    getColumnDataByName("payment_plans_count", 0)
  );

  const getRowsLength = (columnName) => {
    const csvDataFromLocal = JSON.parse(localStorage.getItem("csvData"));
    if (!csvDataFromLocal?.data) {
      return 0;
    }
    return csvDataFromLocal.data.filter((row) => row[columnName] !== undefined)
      .length;
  };

  const rowsInCsv = getRowsLength("debtor_name");

  const apiDataSet = { cases: [] };

  for (let index = 0; index < rowsInCsv; index++) {
    apiDataSet.cases.push({
      debtor: {
        basicInformation: {
          fullName: getColumnDataByName("debtor_name", index),
          email: getColumnDataByName("debtor_email", index),
          SSID: getColumnDataByName("debtor_ssn", index),
          status: getColumnDataByName("debtor_status", index),
          country: getColumnDataByName("debtor_business_country", index),
          state: getColumnDataByName("debtor_business_state", index),
          city: getColumnDataByName("debtor_business_city", index),
          zipCode: getColumnDataByName("debtor_business_zipcode", index),
          phone: getColumnDataByName("debtor_business_phone", index),
          address: getColumnDataByName("debtor_business_address", index),
        },
        businessInformation: {
          companyName: getColumnDataByName("debtor_business_name", index),
          EIN: getColumnDataByName("debtor_business_ein", index),
          businessCategory: getColumnDataByName(
            "debtor_business_category",
            index
          ),
          description: getColumnDataByName(
            "debtor_business_description",
            index
          ),
          country: getColumnDataByName("debtor_business_country", index),
          state: getColumnDataByName("debtor_business_state", index),
          city: getColumnDataByName("debtor_business_city", index),
          zipCode: getColumnDataByName("debtor_business_zipcode", index),
          phone: getColumnDataByName("debtor_business_phone", index),
          address: getColumnDataByName("debtor_business_address", index),
        },
        contacts: [],
      },
      creditor: {
        basicInformation: {
          fullName: getColumnDataByName("creditor_name", index),
          email: getColumnDataByName("creditor_email", index),
          phone: getColumnDataByName("creditor_phone", index),
        },
        businessInformation: {
          companyName: getColumnDataByName("creditor_business_name", index),
          businessCategory: getColumnDataByName(
            "creditor_business_category",
            index
          ),
        },
        notes: getColumnDataByName("creditor_notes", index),
        lastFundedDate: getColumnDataByName("date_funded", index),
        historicalRange: {
          minimum: parseInt(getColumnDataByName("min_hostorical_range", index)),
          maximum: parseInt(getColumnDataByName("max_historical_range", index)),
        },
        contacts: [],
      },
      status: getColumnDataByName("case_status", index),
      totalDebt: parseInt(getColumnDataByName("total_funded_amount", index)),
      lastPaymentDate: getColumnDataByName("last_payment_date", index),
      paidAmount: parseInt(getColumnDataByName("total_paid_amount", index)),
      remaining: parseInt(getColumnDataByName("total_remaining_amount", index)),
      documents: [],
      intervals: [],
    });
  }

  useEffect(() => {
    const numColumns = parseInt(localStorage.getItem("Columns"), 10) || 0;
    const csvDataFromLocal = localStorage.getItem("csvData");
    setCsvData(JSON.parse(csvDataFromLocal));
    const columnNaming = generateColumnNames(numColumns);
    setColumnNames(columnNaming);
    setApiData(apiDataSet);
  }, []);

  const renderData = (category, itemName) => {
    const dropdownStates = JSON.parse(localStorage.getItem("dropdownState"));
    const selectedColumn = dropdownStates
      ? dropdownStates[`${category}-${itemName}-0`]
      : null;
    const columnIndex = columnNames.findIndex(
      (col) => col.value === selectedColumn
    );
    const data = getColumnData(columnIndex);

    return (
      <Typography
        sx={{
          fontSize: "14px",
          fontFamily: "Nunito",
          color: Colors.DIM_LIGHT_GRAY,
        }}
      >
        {data}
      </Typography>
    );
  };

  return (
    <Grid
      xs={12}
      sx={{
        marginTop: ".5rem",
      }}
    >
      {rowsInCsv > 1 ? (
        <Grid container sx={{ justifyContent: "right", alignItems: "center" }}>
          <IconButton
            onClick={() => setCurrentCase((prev) => Math.min(prev - 1, 1))}
            disabled={currentCase === 0}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          <Typography sx={{ color: Colors.DIM_LIGHT_GRAY }}>
            Case {currentCase + 1} of {rowsInCsv}
          </Typography>
          <IconButton
            onClick={() =>
              setCurrentCase((prev) => Math.min(prev + 1, rowsInCsv))
            }
            disabled={currentCase === rowsInCsv - 1}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Grid>
      ) : (
        ""
      )}

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
          {debtorDetails?.map((debtDetail) => (
            <Grid
              key={debtDetail.name}
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
              <Typography style={{ fontSize: "14px", fontFamily: "Nunito" }}>
                {debtDetail.name}
              </Typography>

              {renderData("debtor", debtDetail?.name)}
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
          {creditorDetails?.map((creditDetail) => (
            <Grid
              key={creditDetail.name}
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
              <Typography sx={{ fontSize: "14px", fontFamily: "Nunito" }}>
                {creditDetail?.name}
              </Typography>
              {renderData("creditor", creditDetail?.name)}
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
          {[...Array(paymentPlansCount)]?.map((_, index) => (
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
                  sm={5}
                  lg={2.5}
                  container
                  sx={{
                    gap: "1em",
                    justifyContent: { xs: "space-between", sm: "unset" },
                  }}
                >
                  <Typography sx={{ fontFamily: "Nunito" }}>
                    {item?.name}
                  </Typography>
                  {renderData("automation", item?.name)}
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
