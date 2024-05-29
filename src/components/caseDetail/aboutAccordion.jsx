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
        backgroundColor: Colors.BG_LIGHT_GRAY,
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
          borderRadius: "10px",
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
          <Typography sx={{ color: Colors.WHITE, fontFamily: "Nunito" }}>
            About
          </Typography>
          <IconButton>
            <EditIcon sx={{ color: Colors.WHITE, fontSize: "16px" }} />
          </IconButton>
        </div>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: Colors.BG_LIGHT_GRAY,
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
              <Grid
                sx={{
                  fontSize: "11px",
                  fontFamily: "Nunito",
                  color: Colors.BLACK,
                }}
              >
                {item?.name}
              </Grid>
              <Grid
                sx={{
                  fontSize: "11px",
                  fontFamily: "Nunito",
                  color: Colors.DIM_LIGHT_GRAY,
                }}
              >
                {item?.value}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
