import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { Colors } from "../../config/default";
import PaymentPlan from "./paymentPlan";
import PaymentsAccounts from "./paymentsAccounts";

export default function Transactions({ caseData, caseDataId, GetCaseDetails }) {
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
          <Tab
            sx={{
              fontWeight: "600",
              textTransform: "none",
              fontFamily: "Nunito",

              "&.Mui-selected": {
                color: value ? Colors.SKY_BLUE : "inherit",
              },
            }}
            label="Accounts"
            value="Accounts"
          />
        </Tabs>
      </Box>
      <div style={{ height: "60vh" }}>
        {value === "Create Plan" ? <PaymentPlan caseData={caseData} /> : ""}
        {value === "Accounts" ? (
          <PaymentsAccounts
            caseData={caseData?.debtor}
            caseDataId={caseDataId}
            GetCaseDetails={GetCaseDetails}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
