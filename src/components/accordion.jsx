import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEqual } from "lodash";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { ExpandMore, Launch } from "@mui/icons-material";
import { Grid, Typography, Box } from "@mui/material";
import { formatDollarAmount } from "../common";

import { Colors } from "../config/default";

// import DataTable from "./table";
import ListTable from "./listTable";

const headers = ["Name", "Due Date", "Amount", "SSN", "Failure Reason"];

export default function AccordionUsage({
  tableHeading,
  arrayName,
  paymentNumber,
  index,
  rowArray,
  showFailureReason,
  totalPages,
  currentPage,
  setCurrentPage,
}) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const generatedData = rowArray?.map((item, index) => ({
      id: index,
      name: item?.fullName || "-",
      dueDate: new Date(item?.dueDate).toLocaleDateString() || "-",
      amount: formatDollarAmount(item?.amount),
      ssid: item?.SSID || "-",
      failureReason:
        arrayName === "failedAuthorizations"
          ? item?.failedReasonAuthorization
          : item?.failedReasonCaptured || "-",
    }));
    if (!isEqual(generatedData, rowArray)) {
      setRows(generatedData);
    }
  }, [rowArray]);
  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(0),
  }));
  const [expanded, setExpanded] = React.useState([0, 3]);

  const handleChange = (index) => {
    setExpanded((prevExpanded) =>
      prevExpanded.includes(index)
        ? prevExpanded.filter((i) => i !== index)
        : [...prevExpanded, index]
    );
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
      // defaultExpanded={expanded.includes(index)}
      onChange={() => handleChange(index)}
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
                marginLeft: "0.5rem",
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
                borderRadius: "50%",
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
                {rows?.length}
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
        <ListTable
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          apiPagination={true}
          data={rows}
          headerData={headers}
          showFailureReason={showFailureReason}
          arrayName={arrayName}
          accordionHeight="40vh"
        />
        {/* <DataTable rows={rows} columns={columns} /> */}
      </AccordionDetails>
    </Accordion>
  );
}
