import * as React from "react";
import Accordion from "@mui/material/Accordion";

import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Grid, Typography, Box } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import CustomizedTables from "./table";

export default function AccordionUsage({ tableHeading, paymentNumber }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      sx={{
        borderRadius: "1rem !important",
        backgroundColor: expanded ? "#FFFFFF" : "#F0F0F0",
      }}
    >
      <AccordionSummary
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #EAEBEB",
        }}
        expandIcon={<ExpandMoreIcon />}
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
            <Typography>{tableHeading}</Typography>
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
                backgroundColor: "#C4C4C4",
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
                }}
              >
                {paymentNumber}
              </Typography>
            </Box>
            <LaunchIcon
              sx={{
                color: "#9F9F9F",
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
