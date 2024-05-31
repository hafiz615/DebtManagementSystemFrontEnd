import React from "react";

import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";

import { Colors } from "../../config/default";

export default function AboutAccordion({ caseDetails }) {
  const aboutData = [
    { name: "Case Code", value: caseDetails?.caseCode || "-" },
    { name: "Status", value: caseDetails?.status || "-" },
    { name: "Case Owner", value: caseDetails?.caseOwner || "-" },
    // { name: "Negotiator", value: "5" },
    // { name: "Manager", value: "6" },
    { name: "Total Debt", value: caseDetails?.totalDebt || "-" },
    { name: "Remaining Debt", value: caseDetails?.remaining || "-" },
    { name: "Paid Debt", value: caseDetails?.paidAmount || "-" },
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
          {aboutData?.map((item) => (
            <Grid
              container
              xs={12}
              sx={{ justifyContent: "space-between", mb: "10px" }}
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
