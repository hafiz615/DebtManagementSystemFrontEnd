import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Grid, Tooltip } from "@mui/material";
import { Colors } from "../../config/default";
import Dropdown from "./../dropdown";
import AmountTextField from "../amountTextField";
import PaymentProcess from "../radioPayment";
import { GetAllStatuses } from "../../services/services";

export default function PaymentFields({
  thisCaseData,
  handleCaseDataChange,
  caseIndex,
  businessErrors,
  showErrors,
}) {
  const [status, setStatus] = useState(thisCaseData.status);
  const [feePayment, setFeePayment] = useState(thisCaseData?.feePayment || "");
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:1440px)");

  const [menuItems, setMenuItems] = useState([]);
  const GetStatuses = async () => {
    const AllStatuses = await GetAllStatuses();
    if (AllStatuses?.status === 200) {
      setMenuItems(AllStatuses?.data?.data?.status);
    }
  };

  const menu = menuItems?.map((name) => ({
    label: name,
    value: name,
  }));

  useEffect(() => {
    GetStatuses();
  }, []);
  useEffect(() => {
    handleCaseDataChange(caseIndex, "feePayment", feePayment);
  }, [feePayment]);
  useEffect(() => {
    handleCaseDataChange(caseIndex, "status", status);
  }, [status]);

  const handleNumberInput = (e) => {
    const invalidChars = ["e", "E", ".", "+", "-"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };
  const today = new Date().toISOString().split("T")[0];
  const hasError = (field) => {
    return businessErrors?.some(
      (error) => error?.index === caseIndex && error?.field === field
    );
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          borderRadius: "10px",
          padding: "1rem",
          backgroundColor: Colors.WHITE,
        }}
      >
        <Grid item xs={12}>
          <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
            Debt Details
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginLeft: "1rem",
            }}
          >
            Payback Amount
          </Typography>
          <AmountTextField
            value={parseInt(thisCaseData?.totalDebt?.toFixed(2))}
            onChange={(e) =>
              handleCaseDataChange(
                caseIndex,
                "totalDebt",
                parseFloat(e.target.value)
              )
            }
            onKeyDown={handleNumberInput}
            border={
              thisCaseData?.totalDebt === 0
                ? "2px solid red"
                : "auto" && hasError("totalDebt") && showErrors
                ? "2px solid red"
                : "none !important"
            }
          />
        </Grid>
        {/* <Grid item xs={12} md={4} lg={3}>
          <Tooltip
            title="Current balance will be calculated based on total receivable - cuurent amount"
            placement="top"
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "500",
                color: Colors.DARK_GRAY,
                marginLeft: "1rem",
              }}
            >
              Paid
            </Typography>

            <AmountTextField
              value={parseFloat(thisCaseData?.paidAmount?.toFixed(2))}
              onChange={(e) => {
                const newPaidAmount = parseFloat(e.target.value) || 0;
                const newCurrentBalance =
                  parseFloat(thisCaseData?.totalDebt?.toFixed(2)) -
                  newPaidAmount;
                handleCaseDataChange(caseIndex, "paidAmount", newPaidAmount);
                handleCaseDataChange(caseIndex, "remaining", newCurrentBalance);
              }}
              onKeyDown={handleNumberInput}
              border={
                hasError("paidAmount") && showErrors
                  ? "2px solid red"
                  : "none !important"
              }
            />
          </Tooltip>
        </Grid> */}
        <Grid item xs={12} md={4} lg={3}>
          <Tooltip
            title="Current balance will be calculated based on total receivable - paid amount"
            placement="top"
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "500",
                color: Colors.DARK_GRAY,
                marginLeft: "1rem",
              }}
            >
              Current Balance
            </Typography>

            <AmountTextField
              marginRight={smallScreen ? "0rem" : "2rem"}
              value={
                thisCaseData?.remaining?.toFixed(2) ||
                parseFloat(thisCaseData?.totalDebt?.toFixed(2)) -
                  (thisCaseData?.paidAmount?.toFixed(2) || 0)
              }
              onChange={(e) => {
                const newCurrentBalance = parseFloat(e.target.value) || 0;
                const newPaidAmount =
                  parseFloat(thisCaseData?.totalDebt?.toFixed(2)) -
                  newCurrentBalance;
                handleCaseDataChange(caseIndex, "remaining", newCurrentBalance);
                handleCaseDataChange(caseIndex, "paidAmount", newPaidAmount);
              }}
              onKeyDown={handleNumberInput}
              border={
                thisCaseData?.remaining === 0
                  ? "2px solid red"
                  : "auto" && hasError("remaining") && showErrors
                  ? "2px solid red"
                  : "none !important"
              }
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginLeft: "1rem",
            }}
          >
            Last Payment Date
          </Typography>

          <input
            type="date"
            placeholder="4/2/2024"
            value={thisCaseData?.lastPaymentDate}
            onChange={(e) =>
              handleCaseDataChange(caseIndex, "lastPaymentDate", e.target.value)
            }
            max={today}
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border:
                hasError("remaining") &&
                hasError("lastPaymentDate") &&
                showErrors
                  ? "2px solid red"
                  : "1px solid transparent",

              outline: "none",
              borderRadius: "5px",
              width: "100%",
            }}
          />
        </Grid>

        <Grid item xs={12} md={4} lg={3}>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginLeft: "1rem",
            }}
          >
            Status
          </Typography>
          <Dropdown
            menuWidth={smallScreen ? "17rem" : "14.8rem"}
            selectedValue={thisCaseData?.status}
            setSelectedValue={setStatus}
            menuItems={menu}
            placeholder="Choose Status"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            width="100%"
            showCaseStatus={thisCaseData?.status === "" && true}
          />
        </Grid>

        <Grid item xs={12} md={4} lg={3}>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginRight: "1.5rem", // Increased marginRight
            }}
          >
            Fee Payment
          </Typography>

          <PaymentProcess
            feePayment={thisCaseData.feePayment}
            setFeePayment={setFeePayment}
            border={hasError("feePayment") && showErrors ? true : false}
          />
        </Grid>
      </Grid>
    </>
  );
}
