import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Grid } from "@mui/material";
import { Colors } from "../../config/default";
import Dropdown from "./../dropdown";
import AmountTextField from "../amountTextField";
import PaymentProcess from "../radioPayment";
import { GetAllStatuses } from "../../services/services";

export default function PaymentFields({
  thisCaseData,
  handleCaseDataChange,
  caseIndex,
}) {
  const [status, setStatus] = useState(thisCaseData.status);
  const [feePayment, setFeePayment] = useState("To Pay");
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
              marginRight: "1.5rem", // Increased marginRight
            }}
          >
            Total Receivable
          </Typography>
          <AmountTextField
            value={parseInt(thisCaseData.totalDebt)}
            onChange={(e) =>
              handleCaseDataChange(
                caseIndex,
                "totalDebt",
                parseInt(e.target.value)
              )
            }
            onKeyDown={handleNumberInput}
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
            Paid
          </Typography>
          <AmountTextField
            value={parseInt(thisCaseData.paidAmount)}
            onChange={(e) =>
              handleCaseDataChange(
                caseIndex,
                "paidAmount",
                parseInt(e.target.value)
              )
            }
            onKeyDown={handleNumberInput}
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
            Remaining
          </Typography>

          <AmountTextField
            marginRight={smallScreen ? "0rem" : "2rem"}
            value={parseInt(thisCaseData.totalDebt - thisCaseData.paidAmount)}
            onChange={(e) =>
              handleCaseDataChange(
                caseIndex,
                "remaining",
                parseInt(e.target.value)
              )
            }
            onKeyDown={handleNumberInput}
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
            Last Payment Date
          </Typography>

          <input
            type="date"
            placeholder="4/2/2024"
            value={thisCaseData.lastPaymentDate}
            onChange={(e) =>
              handleCaseDataChange(caseIndex, "lastPaymentDate", e.target.value)
            }
            max={today}
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border: "none",
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
              marginRight: "1.5rem", // Increased marginRight
            }}
          >
            Status
          </Typography>
          <Dropdown
            menuWidth={smallScreen ? "17rem" : "14.8rem"}
            selectedValue={thisCaseData.status}
            setSelectedValue={setStatus}
            menuItems={menu}
            placeholder="Choose Status"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            width="100%"
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
          />
        </Grid>
      </Grid>
    </>
  );
}
