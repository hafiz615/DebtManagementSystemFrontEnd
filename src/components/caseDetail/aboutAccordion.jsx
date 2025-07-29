import React from "react";

import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Colors } from "../../config/default";
import MuiModels from "../models";
import { formatDollarAmount } from "../../common";

export default function AboutAccordion({ caseDetails, GetCaseDetails }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const aboutData = [
    {
      name: "Weekly Budget",
      value:
        formatDollarAmount(
          caseDetails?.debtor?.basicInformation?.weeklyBudget
        ) || "-",
    },
    {
      name: "Pipeline Status",
      value: caseDetails?.status || "-",
    },
    {
      name: "Creditor",
      value: caseDetails?.creditor?.basicInformation?.fullName || "-",
    },

    { name: "Manager", value: caseDetails?.manager || "-" },
    { name: "CSM", value: caseDetails?.caseOwner || "-" },

    { name: "Negotiator", value: caseDetails?.negotiator || "-" },
    {
      name: "Contract Date",
      value: caseDetails?.creditor?.lastFundedDate
        ? formatDate(caseDetails?.creditor?.lastFundedDate)
        : "-",
    },
    {
      name: "Contract Amount",
      value: caseDetails?.contractDetails?.loan_amount || "-",
    },
    {
      name: "Funded Amount",
      value: caseDetails?.contractDetails?.funded_amount || "-",
    },
    {
      name: "Total Paid",
      value: formatDollarAmount(caseDetails?.paidAmount) || "-",
    },
    {
      name: "Current Balance",
      value:
        formatDollarAmount(
          caseDetails?.totalDebt - caseDetails?.remainingAmountPaid
        ) || "-",
    },
    {
      name: "Amount paid by SRT",
      value: formatDollarAmount(caseDetails?.amountDeliveredToCreditor) || "-",
    },
    {
      name: "Fee's Collected Amount",
      value:
        formatDollarAmount(caseDetails?.amountNotDeliveredToCreditor) || "-",
    },
  ];
  return (
    <Accordion
      sx={{
        boxShadow: "none",
        marginBottom: "10px",
        borderRadius: "1rem !important",
        backgroundColor: Colors.WHITE,
      }}
      defaultExpanded
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: Colors.WHITE }} />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          height: "20px",
          backgroundColor: Colors.SKY_BLUE,
          borderRadius: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              color: Colors.WHITE,
              fontFamily: "Nunito",
              fontWeight: "700",
            }}
          >
            ABOUT
          </Typography>
        </div>
        <div style={{ display: "flex" }} onClick={(e) => e.stopPropagation()}>
          <MuiModels
            show="editAbout"
            data={caseDetails}
            GetCaseDetails={GetCaseDetails}
          />
        </div>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: Colors.WHITE,
          boxShadow: " 0 2px 5px -3px rgba(0, 0, 0, 0.5)",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      >
        <Grid>
          {aboutData?.map((item, index) => (
            <Grid
              container
              sx={{ justifyContent: "space-between", mb: "10px" }}
              key={index}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  fontFamily: "Nunito",
                  color: Colors.DARK_GRAY,
                  fontWeight: "700",
                }}
              >
                {item?.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontFamily: "Nunito",
                  color: Colors.DIM_LIGHT_GRAY,
                  fontWeight: "600",
                }}
              >
                {item?.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
