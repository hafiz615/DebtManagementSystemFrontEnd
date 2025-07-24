import React, { useState, useEffect } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { Colors } from "../../config/default";
import PaymentPlan from "./paymentPlan";
import PaymentsAccounts from "./paymentsAccounts";
import AnalyticsAccordion from "./analyticsAccordion";
import { GetCasePaymentsAnalytics } from "../../services/services";
import BouncePayments from "./bouncePayments";
import PaymentCardPopup from "../paymentCardPopup";

export default function Transactions({
  caseData,
  caseDataId,
  GetCaseDetails,
  accountsResponse,
  GetDebtorAccounts,
  loading,
}) {
  const debtorId = caseData?.debtor?._id;
  const [value, setValue] = useState("Create Plan");
  const [paymentDetails, setPaymentDetails] = useState();

  const GetCasePaymentsAnalyticsData = async () => {
    const res = await GetCasePaymentsAnalytics(debtorId);
    setPaymentDetails(res?.data?.data);
  };

  useEffect(() => {
    GetCasePaymentsAnalyticsData();
  }, []);

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
            label="Analytics"
            value="Analytics"
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
          <Tab
            sx={{
              fontWeight: "600",
              textTransform: "none",
              fontFamily: "Nunito",

              "&.Mui-selected": {
                color: value ? Colors.SKY_BLUE : "inherit",
              },
            }}
            label="Manual Payments"
            value="manualPayments"
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
            label="Bounce Payments"
            value="bouncePayments"
          />
        </Tabs>
      </Box>
      <div style={{ height: "60vh" }}>
        {value === "Create Plan" ? (
          <PaymentPlan
            caseData={caseData}
            accountsResponse={accountsResponse}
          />
        ) : (
          ""
        )}
        {value === "Analytics" ? (
          <AnalyticsAccordion
            loading={loading}
            paymentDetails={paymentDetails}
          />
        ) : (
          ""
        )}
        {value === "Accounts" ? (
          <PaymentsAccounts
            caseData={caseData?.debtor}
            caseDataId={caseDataId}
            GetCaseDetails={GetCaseDetails}
            accountsResponse={accountsResponse}
            GetDebtorAccounts={GetDebtorAccounts}
          />
        ) : (
          ""
        )}
        {value === "manualPayments" ? (
          <PaymentCardPopup
            caseId={caseDataId}
            debtorId={debtorId}
            GetCaseDetails={GetCaseDetails}
          />
        ) : (
          ""
        )}
        {value === "bouncePayments" ? (
          <BouncePayments debtorId={debtorId} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
