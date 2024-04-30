import * as React from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import CustomizedTables from "./paymentTable";
import TextButton from "./button";
import { Colors } from "../config/default";

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
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&.Mui-focusVisible": {
      backgroundColor: "red",
    },
  })
);

export default function CustomizedTabs() {
  const [value, setValue] = React.useState(0);
  const headers = ["Name", "DOB", "Gender", "Email", "SSID"];
  const tableData = [
    "User Name",
    "4/2/2024",
    "Male",
    "user@email.com",
    "721-07-4426",
    "Negotiator",
    "+18143008957",

    // Add more rows as needed
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
              label="User Listing"
              sx={{
                bgcolor: Colors.WHITE,
                width: "max-content",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                marginLeft: "1rem",
                height: "3.5rem",
              }}
            />
          </AntTabs>
        </Box>
        <TextButton
          buttonText="ADD USERS"
          marginBottom="1rem"
          startIcon={<AddIcon />}
        />
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
