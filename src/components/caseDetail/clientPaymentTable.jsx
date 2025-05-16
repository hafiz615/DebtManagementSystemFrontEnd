import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { FONT_SIZE_MEDIUM } from "../../constants/appConstants";

const ClientPaymentTable = () => {
  const rows = [
    {
      amount: "$500",
      date: "Apr 4, 25",
      timePeriod: "Weekly",
      serviceFee: "$92.00",
      legalFee: "$0.00",
      commission: "$208.00",
      creditorPayments: "$200.00",
    },
    {
      amount: "$500",
      date: "Apr 11, 25",
      timePeriod: "Weekly",
      serviceFee: "$92.00",
      legalFee: "$0.00",
      commission: "$208.00",
      creditorPayments: "$200.00",
    },
    {
      amount: "$500",
      date: "Apr 18, 25",
      timePeriod: "Weekly",
      serviceFee: "$92.00",
      legalFee: "$0.00",
      commission: "$208.00",
      creditorPayments: "$200.00",
    },
    {
      amount: "$500",
      date: "Apr 25, 25",
      timePeriod: "Weekly",
      serviceFee: "$92.00",
      legalFee: "$0.00",
      commission: "$208.00",
      creditorPayments: "$200.00",
    },
    {
      amount: "$500",
      date: "May 2, 25",
      timePeriod: "Weekly",
      serviceFee: "$92.00",
      legalFee: "$0.00",
      commission: "$208.00",
      creditorPayments: "$200.00",
    },
  ];

  const cellStyle = {
    padding: "12px",
    fontFamily: "Nunito",
    fontSize: FONT_SIZE_MEDIUM,
    borderBottom: "1px solid #e0e0e0",
  };

  return (
    <Box sx={{ width: "100%", mt: 1 }}>
      <Card
        sx={{
          width: "100%",
          borderRadius: 3,
          boxShadow: "none",
          bgcolor: "white",
        }}
      >
        <CardContent>
          <table
            style={{
              width: "100%",
              textAlign: "left",
              borderCollapse: "collapse",
            }}
          >
            <thead style={{ backgroundColor: "#f5f5f5" }}>
              <tr>
                {[
                  "Amount",
                  "Date",
                  "Time Period",
                  "Service Fee",
                  "Legal Fee",
                  "Commission",
                  "Creditor Payments",
                ].map((header) => (
                  <th key={header} style={cellStyle}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa",
                  }}
                >
                  {Object.values(row).map((value, i) => (
                    <td key={i} style={cellStyle}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClientPaymentTable;
