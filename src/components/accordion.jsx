import * as React from "react";
import { useNavigate } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { ExpandMore, Launch } from "@mui/icons-material";
import { Grid, Typography, Box } from "@mui/material";

import CustomizedTables from "./paymentTable";
import { Colors } from "../config/default";

export default function AccordionUsage({ tableHeading, paymentNumber, index }) {
  const headers = ["Name", "Due Date", "Amount", "SSID", "Failure Reason"];
  const tableData = [
    "User Name",
    "4/2/2024",
    "$3,254.00",
    "721-07-4426",
    "Lorium Ipsum",

    // Add more rows as needed
  ];

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(0),
  }));
  const [expanded, setExpanded] = React.useState(index < 2);

  const handleChange = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  let backgroundColor;
  if (paymentNumber === "5") {
    backgroundColor = "#FBE1DA"; // Reddish color
  } else if (paymentNumber === "4") {
    backgroundColor = "#A5D8DD"; // Bluish color
  } else {
    backgroundColor = "#7E909A"; // Grayish color
  }

  const navigate = useNavigate();

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
                color: Colors.BLACK,
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
                backgroundColor,
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
                  fontWeight: "600",
                  fontSize: "1rem",
                  fontFamily: "Nunito",
                  color: Colors.BLACK,
                }}
              >
                {paymentNumber}
              </Typography>
            </Box>
            <Launch
              sx={{
                color: Colors.DIM_LIGHT_GRAY,
                marginLeft: "0.5rem",
                marginRight: "0.5rem",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/authorization-details");
              }}
            />
          </Grid>
        </Grid>
      </AccordionSummary>

      <AccordionDetails>
        <CustomizedTables data={tableData} headerData={headers} />
      </AccordionDetails>
    </Accordion>
  );
}
