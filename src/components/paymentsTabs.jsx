import * as React from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import { Colors } from "../config/default";
import PaymentTabsTable from "./paymentsTabTable";

const AntTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: Colors.SKY_BLUE,
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },
    fontWeight: "500",
    color: Colors.DARK_GRAY,
    fontFamily: ["Nunito"].join(","),
    "&:hover": {
      color: Colors.SKY_BLUE,
      opacity: 1,
    },
    "&.Mui-selected": {
      color: Colors.SKY_BLUE,
      fontWeight: "500",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
  })
);

export default function PaymentsTabs() {
  const [value, setValue] = React.useState(0);
  const headers = [
    "Debtor",
    "Due Date",
    "Try Date",
    "Total Debt",
    "SSID",
    "Case Owner",
    "Actions",
  ];

  function createData(
    debtor,
    dueDate,
    tryDate,
    totalDebt,
    ssid,
    caseOwner,
    actions
  ) {
    return { debtor, dueDate, tryDate, totalDebt, ssid, caseOwner, actions };
  }
  const tableData = [
    createData(
      "User Name",
      "4/2/2024",
      "4/6/2024",
      "$3,254.00",
      "721-07-4426",
      "Negotiator",
      "+18143008957"
    ),
    createData(
      "User Name",
      "4/2/2024",
      "4/6/2024",
      "$3,254.00",
      "721-07-4426",
      "Negotiator",
      "+18143008957"
    ),
    createData(
      "User Name",
      "4/2/2024",
      "4/6/2024",
      "$3,254.00",
      "721-07-4426",
      "Negotiator",
      "+18143008957"
    ),
    createData(
      "User Name",
      "4/2/2024",
      "4/6/2024",
      "$3,254.00",
      "721-07-4426",
      "Negotiator",
      "+18143008957"
    ),
    createData(
      "User Name",
      "4/2/2024",
      "4/6/2024",
      "$3,254.00",
      "721-07-4426",
      "Negotiator",
      "+18143008957"
    ),
    createData(
      "User Name",
      "4/2/2024",
      "4/6/2024",
      "$3,254.00",
      "721-07-4426",
      "Negotiator",
      "+18143008957"
    ),
    createData(
      "User Name",
      "4/2/2024",
      "4/6/2024",
      "$3,254.00",
      "721-07-4426",
      "Negotiator",
      "+18143008957"
    ),

    createData(
      "User Name",
      "4/2/2024",
      "4/6/2024",
      "$3,254.00",
      "721-07-4426",
      "Negotiator",
      "+18143008957"
    ),
    createData(
      "User Name",
      "4/2/2024",
      "4/6/2024",
      "$3,254.00",
      "721-07-4426",
      "Negotiator",
      "+18143008957"
    ),
    createData(
      "User khan",
      "4/2/2024",
      "4/6/2024",
      "$3,254.00",
      "721-07-4426",
      "Negotiator",
      "+18143008957"
    ),
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box
        sx={{
          marginLeft: "2.5rem",
        }}
      >
        <AntTabs
          value={value}
          onChange={handleChange}
          aria-label="ant example"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ width: { xs: "22rem", md: "50rem" } }}
        >
          <AntTab
            sx={{
              bgcolor: Colors.WHITE,
              width: "max-content",
              borderTopLeftRadius: "10px",
              fontWeight: "600",
              height: "3.5rem",
            }}
            label="Failed Authorizations"
          />

          <AntTab
            sx={{
              bgcolor: Colors.WHITE,
              width: "max-content",
              fontWeight: "600",
              height: "3.5rem",
            }}
            label="Successful Authorizations"
          />
          <AntTab
            sx={{
              bgcolor: Colors.WHITE,
              width: "max-content",
              fontWeight: "600",
              height: "3.5rem",
            }}
            label="Failed Payments"
          />
          <AntTab
            sx={{
              bgcolor: Colors.WHITE,
              width: "max-content",
              borderTopRightRadius: "10px",
              fontWeight: "600",
              height: "3.5rem",
            }}
            label="Successful Payments"
          />
        </AntTabs>
      </Box>
      <Box
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px ",
        }}
      >
        {value === 0 && (
          <PaymentTabsTable data={tableData} headerData={headers} />
        )}
        {value === 1 && (
          <PaymentTabsTable data={tableData} headerData={headers} />
        )}
        {value === 2 && (
          <PaymentTabsTable data={tableData} headerData={headers} />
        )}
        {value === 3 && (
          <PaymentTabsTable data={tableData} headerData={headers} />
        )}
      </Box>
    </Box>
  );
}
