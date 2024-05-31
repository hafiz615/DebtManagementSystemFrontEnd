import * as React from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";

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
  const paymentsData = useSelector((state) => state?.payments?.payments[0]);
  const [value, setValue] = React.useState(0);
  const headers = [
    "Name",
    "Due Date",
    "Try Date",
    "Total Debt",
    "SSN",
    "Case Owner",
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
          <PaymentTabsTable
            data={paymentsData?.failedAuthorizations}
            headerData={headers}
          />
        )}
        {value === 1 && (
          <PaymentTabsTable
            data={paymentsData?.successAuthorizations}
            headerData={headers}
          />
        )}
        {value === 2 && (
          <PaymentTabsTable
            data={paymentsData?.failedPayments}
            headerData={headers}
          />
        )}
        {value === 3 && (
          <PaymentTabsTable
            data={paymentsData?.successPayments}
            headerData={headers}
          />
        )}
      </Box>
    </Box>
  );
}
