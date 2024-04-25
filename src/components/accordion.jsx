import * as React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { ExpandMore, Launch } from "@mui/icons-material";
import { Grid, Typography, Box } from "@mui/material";

import CustomizedTables from "./table";
import { Colors } from "../config/default";

export default function AccordionUsage({ tableHeading, paymentNumber, index }) {
  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(0),
  }));
  const [expanded, setExpanded] = React.useState(index < 2);

  const handleChange = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  return (
    <Accordion
      defaultExpanded={index < 2}
      expanded={expanded}
      onChange={handleChange}
      sx={{
        borderRadius: "1rem !important",
        backgroundColor: Colors.WHITE,
      }}
    >
      <AccordionSummary
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
        expandIcon={<ExpandMore />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <Grid item xs={6}>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                color: Colors.NAVY_BLUE,
              }}
            >
              {tableHeading}
            </Typography>
          </Grid>

          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                borderRadius: "10px",
                height: "2.5rem",
                width: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "0.5rem",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "500",
                  fontSize: "1rem",
                  fontFamily: "Nunito",
                  color: Colors.NAVY_BLUE,
                }}
              >
                {paymentNumber}
              </Typography>
            </Box>
            <Launch
              sx={{
                color: Colors.DARK_GRAY,
                marginLeft: "0.5rem",
                marginRight: "0.5rem",
              }}
            />
          </Grid>
        </Grid>
      </AccordionSummary>

      <AccordionDetails>
        <CustomizedTables />
      </AccordionDetails>
    </Accordion>
  );
}
