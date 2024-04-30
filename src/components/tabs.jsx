import * as React from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";

import CustomizedTables from "./paymentTable";
import { Colors } from "../config/default";
import BasicModal from "./customPopup";
import { UserListPage } from "../constants/appConstants";

const AntTabs = styled(Tabs)({
  border: "none",

  "& .MuiTabs-indicator": {
    backgroundColor: "white",
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },

    fontFamily: ["Nunito"].join(","),
    "&:hover": {
      color: Colors.BLACK,
      opacity: 1,
    },
    "&.Mui-selected": {
      color: Colors.BLACK,
      // fontWeight: theme.typography.fontWeightMedium,
    },
    "&.Mui-focusVisible": {
      backgroundColor: "red",
    },
  })
);

export default function CustomizedTabs() {
  const [value, setValue] = React.useState(0);
  const headers = [
    "Name",
    "DOB",
    "Gender",
    "Email",
    "SSID",
    "Role",
    "Phone #",
    "Address",
  ];

  const { ANT_TAB_LABEL } = UserListPage;
  function createData(name, dob, gender, email, ssid, role, phone, address) {
    return { name, dob, gender, email, ssid, role, phone, address };
  }
  const tableData = [
    createData(
      "User Name",
      "4/2/2024",
      "Male",
      "user@email.com",
      "721-07-4426",
      "Negotiator",
      "+18143008957",
      "Loriem Ipsum"
    ),
    createData(
      "User Name",
      "4/2/2024",
      "Male",
      "user@email.com",
      "721-07-4426",
      "Negotiator",
      "+18143008957",
      "Loriem Ipsum"
    ),

    createData(
      "User Name",
      "4/2/2024",
      "Male",
      "user@email.com",
      "721-07-4426",
      "Negotiator",
      "+18143008957",
      "Loriem Ipsum"
    ),
    createData(
      "User Name",
      "4/2/2024",
      "Male",
      "user@email.com",
      "721-07-4426",
      "Negotiator",
      "+18143008957",
      "Loriem Ipsum"
    ),
    createData(
      "User Name",
      "4/2/2024",
      "Male",
      "user@email.com",
      "721-07-4426",
      "Negotiator",
      "+18143008957",
      "Loriem Ipsum"
    ),
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <AntTabs
            value={value}
            onChange={handleChange}
            aria-label="ant example"
          >
            <AntTab
              label={ANT_TAB_LABEL}
              sx={{
                bgcolor: Colors.WHITE,
                width: "max-content",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                fontWeight: "600",
                marginLeft: "1rem",
                height: "3.5rem",
              }}
            />
          </AntTabs>
        </Box>

        <BasicModal modelButton="ADD USERS" show={false} />
      </Box>
      <Box
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px ",
        }}
      >
        <CustomizedTables data={tableData} headerData={headers} />;
      </Box>
    </>
  );
}
