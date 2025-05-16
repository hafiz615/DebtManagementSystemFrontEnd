import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { Colors } from "../../config/default";
import PaymentPlan from "./paymentPlan";

export default function Transactions({ caseData }) {
  const [value, setValue] = useState("Create Plan");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          width: "100%",
          backgroundColor: Colors.WHITE,
          marginTop: "16px",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{
            style: {
              backgroundColor: Colors.SKY_BLUE,
            },
          }}
        >
          <Tab
            sx={{
              fontWeight: "600",
              textTransform: "none",
              fontFamily: "Nunito",

              "&.Mui-selected": {
                color: value ? Colors.SKY_BLUE : "inherit",
              },
            }}
            label="Create Plan"
            value="Create Plan"
          />
        </Tabs>
      </Box>
      <div style={{ height: "60vh" }}>
        {value === "Create Plan" ? <PaymentPlan caseData={caseData} /> : ""}
      </div>
    </div>
  );
}
