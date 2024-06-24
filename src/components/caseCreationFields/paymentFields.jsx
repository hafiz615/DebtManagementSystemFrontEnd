import React from "react";

import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Grid } from "@mui/material";

import { Colors } from "../../config/default";
import Dropdown from "./../dropdown";
import AmountTextField from "../amountTextField";
import PaymentProcess from "../radioPayment";

export default function PaymentFields({
  totalReceivable,
  setTotalReceivable,
  paidAmount,
  setPaidAmount,
  remainingAmount,
  setRemainingAmount,
  lastPaymentDate,
  setLastPaymentDate,
  selectedValue,
  setSelectedValue,
  setFeePayment,
  feePayment,
}) {
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:1440px)");

  const menuItems = [
    { label: "Customer", value: "Customer" },
    { label: "On hold", value: "On hold" },
    { label: "Canceled", value: "Canceled" },
    { label: "Declared Bankrupcy", value: "Declared Bankrupcy" },
  ];
  const handleNumberInput = (e) => {
    const invalidChars = ["e", "E", ".", "+", "-"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };
  const today = new Date().toISOString().split("T")[0];
  return (
    <>
      <Typography
        sx={{
          fontFamily: "Nunito",
          fontWeight: "600",
        }}
        gutterBottom
      >
        Debt Details
      </Typography>

      <Grid container xs={12}>
        <Grid
          item
          xs={12}
          lg={4}
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginLeft: "2rem",
              width: "50%",
            }}
          >
            Total Receivable
          </Typography>

          <AmountTextField
            width="60%"
            value={totalReceivable}
            onChange={(e) => setTotalReceivable(e.target.value)}
            onKeyDown={handleNumberInput}
          />
        </Grid>

        <Grid
          item
          xs={12}
          lg={4}
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginLeft: "2rem",
              width: "50%",
            }}
          >
            Paid
          </Typography>
          <AmountTextField
            width="60%"
            value={paidAmount}
            onChange={(e) => setPaidAmount(parseInt(e.target.value))}
            onKeyDown={handleNumberInput}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={4}
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginLeft: "2rem",
              width: "50%",
            }}
          >
            Remaining
          </Typography>

          <AmountTextField
            marginRight={smallScreen ? "0rem" : "2rem"}
            width="60%"
            value={remainingAmount}
            onChange={(e) => setRemainingAmount(e.target.value)}
            onKeyDown={handleNumberInput}
          />
        </Grid>
      </Grid>

      <Grid container xs={12} sx={{ marginTop: "1rem" }}>
        <Grid
          item
          xs={12}
          lg={4}
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginLeft: "2rem",
              width: "50%",
            }}
          >
            Last Payment Date
          </Typography>

          <input
            type="date"
            placeholder="4/2/2024"
            value={lastPaymentDate}
            onChange={(e) => setLastPaymentDate(e.target.value)}
            max={today}
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border: "none",
              outline: "none",
              borderRadius: "5px",
              width: "60%",
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={4}
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginLeft: "2rem",
              width: "50%",
            }}
          >
            Status
          </Typography>
          <Dropdown
            menuWidth="14.8rem"
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            menuItems={menuItems}
            placeholder="Choose Status"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            width="60%"
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={4}
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginLeft: "2rem",
              width: "45%",
            }}
          >
            Fee Payment
          </Typography>

          <PaymentProcess
            feePayment={feePayment}
            setFeePayment={setFeePayment}
          />
        </Grid>
      </Grid>
    </>
  );
}
