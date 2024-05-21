import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { Colors } from "../../config/default";
import Dropdown from "./../dropdown";

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
}) {
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

      <Grid
        container
        item
        xs={12}
        sx={{
          justifyContent: "space-between",
          gap: { xs: "1rem", md: "0" },
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          lg={3.9}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "space-between", lg: "unset" },
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginRight: "2rem",
            }}
          >
            Total Receivable
          </Typography>

          <input
            type="number"
            placeholder="$ Total Receivable Amount"
            value={totalReceivable}
            onChange={(e) => setTotalReceivable(e.target.value)}
            onKeyDown={handleNumberInput}
            min="0"
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
          md={6}
          lg={3.9}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "space-between", lg: "unset" },
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginRight: "1rem",
              marginLeft: "2rem",
            }}
          >
            Paid
          </Typography>
          <input
            type="number"
            placeholder="$ Paid Amount"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            onKeyDown={handleNumberInput}
            min="0"
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
          md={6}
          lg={3.9}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "space-between", lg: "unset" },
            marginTop: { md: "1rem", lg: 0 },
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginRight: "1rem",
            }}
          >
            Remaining
          </Typography>
          <input
            disabled
            type="number"
            placeholder="$ Remaining Amount"
            value={remainingAmount}
            min="0"
            onChange={(e) => setRemainingAmount(e.target.value)}
            onKeyDown={handleNumberInput}
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
      </Grid>

      <Grid
        container
        sx={{
          marginTop: "1rem",
          gap: { xs: "1rem", md: "0" },
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          lg={3.9}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "space-between", lg: "unset" },
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginRight: "1rem",
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
          md={6}
          lg={3.9}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "space-between", lg: "unset" },
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginRight: "1rem",
              marginLeft: "2rem",
            }}
          >
            Status
          </Typography>
          <Dropdown
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            menuItems={menuItems}
            placeholder="Choose Status"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            width="60%"
          />
        </Grid>
      </Grid>
    </>
  );
}
