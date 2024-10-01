import React from "react";

import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Colors } from "../../config/default";
import { formatDollarAmount } from "../../common";

export default function AnalyticsAccordion({ loading, paymentDetails }) {
  const analyticsData = [
    {
      name: "Successful Authorizations",
      value: paymentDetails?.paymentCounts?.successAuthorizations || 0,
    },
    {
      name: "Successful Captures",
      value: paymentDetails?.paymentCounts?.successCaptures || 0,
    },
    {
      name: "Successful Payments",
      value: paymentDetails?.paymentCounts?.successPayments || 0,
    },
    {
      name: "Failed Authorizations",
      value: paymentDetails?.paymentCounts?.failedAuthorizations || 0,
    },
    {
      name: "Failed Captures",
      value: paymentDetails?.paymentCounts?.failedCaptures || 0,
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
        <Typography
          sx={{ color: Colors.WHITE, fontFamily: "Nunito", fontWeight: "700" }}
        >
          ANALYTICS
        </Typography>
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
          {loading ? (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "90vh",
              }}
            >
              <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
            </Grid>
          ) : (
            <>
              {analyticsData?.map((item) => (
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
                      fontWeight: "500",
                      color: Colors.DIM_LIGHT_GRAY,
                    }}
                  >
                    {item?.value}
                  </Typography>
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
