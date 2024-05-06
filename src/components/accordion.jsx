import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEqual } from "lodash";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { ExpandMore, Launch } from "@mui/icons-material";
import { Grid, Typography, Box } from "@mui/material";

// import CustomizedTables from "./paymentTable";
import { Colors } from "../config/default";
// import { DashboardTableHeaders } from "../constants/appConstants";
import DataTable from "./table";
const rowArray = [
  {
    name: "User Name",
    dueDate: "4/2/2024",
    amount: "$3,254.00",
    ssid: "721-07-4426",
    failureReason: "Lorium Ipsum",
  },
  {
    name: "User Name",
    dueDate: "4/2/2024",
    amount: "$3,254.00",
    ssid: "721-07-4426",
    failureReason: "Lorium Ipsum",
  },
  {
    name: "User Name",
    dueDate: "4/2/2024",
    amount: "$3,254.00",
    ssid: "721-07-4426",
    failureReason: "Lorium Ipsum",
  },
  {
    name: "User Name",
    dueDate: "4/2/2024",
    amount: "$3,254.00",
    ssid: "721-07-4426",
    failureReason: "Lorium Ipsum",
  },
  {
    name: "User Name",
    dueDate: "4/2/2024",
    amount: "$3,254.00",
    ssid: "721-07-4426",
    failureReason: "Lorium Ipsum",
  },
  {
    name: "User Name",
    dueDate: "4/2/2024",
    amount: "$3,254.00",
    ssid: "721-07-4426",
    failureReason: "Lorium Ipsum",
  },
  {
    name: "User Name",
    dueDate: "4/2/2024",
    amount: "$3,254.00",
    ssid: "721-07-4426",
    failureReason: "Lorium Ipsum",
  },
  {
    name: "User Name",
    dueDate: "4/2/2024",
    amount: "$3,254.00",
    ssid: "721-07-4426",
    failureReason: "Lorium Ipsum",
  },
];
const columns = [
  {
    field: "name",
    headerName: <span style={{ fontWeight: "600" }}>Name</span>,

    flex: 1,
    minWidth: 90,
  },
  {
    field: "dueDate",
    headerName: <span style={{ fontWeight: "600" }}>Due Date</span>,
    flex: 1,
    minWidth: 90,
  },
  {
    field: "amount",
    headerName: <span style={{ fontWeight: "600" }}>Amount</span>,
    flex: 1,
    minWidth: 90,
  },
  {
    field: "ssid",
    headerName: <span style={{ fontWeight: "600" }}>SSID</span>,
    flex: 1,
    minWidth: 90,
  },
  {
    field: "failureReason",
    headerName: <span style={{ fontWeight: "600" }}>Failure Reason</span>,
    flex: 1,
    minWidth: 90,
  },
];
export default function AccordionUsage({ tableHeading, paymentNumber, index }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const generatedData = rowArray?.map((item, index) => ({
      id: index,
      name: item?.name,
      dueDate: item?.dueDate,
      amount: item?.amount,
      ssid: item?.ssid,
      failureReason: item?.failureReason,
    }));
    if (!isEqual(generatedData, rowArray)) {
      setRows(generatedData);
    }
  }, []);
  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(0),
  }));
  const [expanded, setExpanded] = React.useState(index < 2);

  const handleChange = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  let backgroundColor;
  if (paymentNumber === "5") {
    backgroundColor = "rgba(234, 106, 71, 0.5)"; // Reddish color
  } else if (paymentNumber === "4") {
    backgroundColor = "rgba(165, 216, 221, 0.5)"; // Bluish color
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
                localStorage.setItem("route", "authorization-details");
                navigate("/authorization-details");
              }}
            />
          </Grid>
        </Grid>
      </AccordionSummary>

      <AccordionDetails>
        {/* <CustomizedTables
          data={tableData}
          headerData={headers}
          showTableData={true}
        /> */}
        <DataTable rows={rows} columns={columns} />
      </AccordionDetails>
    </Accordion>
  );
}
