import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Grid } from "@mui/material";
import { Colors } from "../../config/default";
import ListTableDynamic from "../listTableDynamic";
import MuiModels from "../models";

export default function CustomFieldsAccordion({customFields, refreshData}) {
  const headerData = [
    { key: "name", heading: "Name", width: "15%" },
    { key: "type", heading: "Type", width: "15%"}
  ];
  return (
    <Accordion
      sx={{
        width: "100%",
        borderRadius: "1rem !important",
        backgroundColor: Colors.WHITE,
        marginBottom: "1rem",
        boxShadow: "none",
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
          <MuiModels
            buttonName="Add Custom Fields"
            show="addCustomField"
            button="customField"
            handleModalClose={refreshData}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ justifyContent: "flex-end", marginTop: "1rem" }}
        >
          <ListTableDynamic
            headerData={headerData}
            data={customFields}
            requiredCustomFieldIcons={true}
            handleModalClose={refreshData}
          />
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
