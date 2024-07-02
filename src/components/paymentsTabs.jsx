import * as React from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import { Colors } from "../config/default";
import PaymentTabsTable from "./paymentsTabTable";
import { FONT_SIZE_SMALL } from "../constants/appConstants";

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
      fontSize: "14px !important",
    },
    [theme.breakpoints.up("xs")]: {
      fontSize: FONT_SIZE_SMALL,
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

export default function PaymentsTabs({
  value,
  setValue,
  data,
  currentPage,
  setCurrentPage,
  totalPages,
  getHomeData,
  loading,
}) {
  const headers = ["Name", "Try Date", "Total Debt", "SSN", "Case Owner"];

  if (value === 4) {
    headers.push("Due Date");
  }
  if (value === 0) {
    headers.push("Retry");
  }
  if (value === 2) {
    headers.push("Retry");
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box
        sx={{
          marginLeft: { xs: "0", md: "2.5rem" },
        }}
      >
        <AntTabs
          value={value}
          onChange={handleChange}
          aria-label="ant example"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ width: { xs: "100%", md: "70rem" } }}
        >
          <AntTab
            sx={{
              bgcolor: Colors.WHITE,
              width: { xs: "20%", sm: "max-content" },
              borderTopLeftRadius: "10px",
              fontWeight: "600",
              height: "3.5rem",
            }}
            label="Failed Authorizations"
          />

          <AntTab
            sx={{
              bgcolor: Colors.WHITE,
              width: { xs: "20%", sm: "max-content" },
              fontWeight: "600",
              height: "3.5rem",
            }}
            label="Successful Authorizations"
          />
          <AntTab
            sx={{
              bgcolor: Colors.WHITE,
              width: { xs: "20%", sm: "max-content" },
              fontWeight: "600",
              height: "3.5rem",
            }}
            label="Failed Payments"
          />
          <AntTab
            sx={{
              bgcolor: Colors.WHITE,
              width: { xs: "20%", sm: "max-content" },
              fontWeight: "600",
              height: "3.5rem",
            }}
            label="Successful Payments"
          />
          <AntTab
            sx={{
              bgcolor: Colors.WHITE,
              width: { xs: "20%", sm: "max-content" },
              borderTopRightRadius: "10px",
              fontWeight: "600",
              height: "3.5rem",
            }}
            label="Upcoming Payments"
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
            data={data?.failedAuthorizations}
            headerData={headers}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            apiPagination={true}
            value={value}
            getHomeData={getHomeData}
            loading={loading}
          />
        )}
        {value === 1 && (
          <PaymentTabsTable
            data={data?.successAuthorizations}
            headerData={headers}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            apiPagination={true}
            loading={loading}
          />
        )}
        {value === 2 && (
          <PaymentTabsTable
            data={data?.failedPayments}
            headerData={headers}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            apiPagination={true}
            value={value}
            getHomeData={getHomeData}
            loading={loading}
          />
        )}
        {value === 3 && (
          <PaymentTabsTable
            data={data?.successPayments}
            headerData={headers}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            apiPagination={true}
            loading={loading}
          />
        )}
        {value === 4 && (
          <PaymentTabsTable
            data={data?.upcomingPayments}
            headerData={headers}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            apiPagination={true}
            value={value}
            loading={loading}
          />
        )}
      </Box>
    </Box>
  );
}
