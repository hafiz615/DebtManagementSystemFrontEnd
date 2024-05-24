import React, { useState, useEffect } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Grid } from "@mui/material";
import { Colors } from "../../config/default";
import TextButton from "../button";
import ListTable from "../listTable";
const headers = ["Name", "Types"];
function createData(name, types) {
  return {
    name,
    types,
  };
}
const tableData = [
  createData("Date of First Payment", "Date"),
  createData("EIN", "Text (single line)"),
  createData("Date of First Payment", "Date"),
  createData("EIN", "Text (single line)"),
  createData("Date of First Payment", "Date"),
  createData("EIN", "Text (single line)"),
];
export default function CustomFieldsAccordion() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = () => {
      const generatedData = tableData?.map((item) => ({
        name: item?.name,
        types: item?.types,
      }));
      setRows(generatedData);
    };

    fetchData();
  }, []);

  return (
    <Accordion
      sx={{
        width: "100%",
        borderRadius: "1rem !important",
        backgroundColor: Colors.WHITE,
        marginBottom: "1rem",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          fontFamily: "Nunito",
          fontWeight: "600",
          borderBottomLeftRadius: "1rem",
          borderBottomRightRadius: "1rem",
          borderBottom: "1px solid #6D6D6D",
        }}
      >
        Custom Fields
      </AccordionSummary>
      <AccordionDetails>
        <Grid
          container
          item
          sx={{ justifyContent: "flex-end", marginTop: "1rem" }}
        >
          <TextButton buttonText="New Custom Field" />
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ justifyContent: "flex-end", marginTop: "1rem" }}
        >
          <ListTable
            headerData={headers}
            data={rows}
            requiredCustomFieldIcons={true}
          />
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
