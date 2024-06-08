import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Grid } from "@mui/material";
import { Colors } from "../../config/default";
import ListTableDynamic from "../listTableDynamic";
import MuiModels from "../models";
import { styled } from "@mui/material/styles";
const StyledAccordion = styled(Accordion)({
  "&:before": {
    display: "none", // Remove the default line
  },
  width: "100%",
  borderRadius: "1rem !important",
  backgroundColor: Colors.WHITE,
  marginBottom: "1rem",
  boxShadow: "none",
});
const StyledAccordionSummary = styled(AccordionSummary)({
  fontFamily: "Nunito",
  fontWeight: "600",
  borderTopRightRadius: "1rem",
  borderTopLeftRadius: "1rem",
  borderBottomLeftRadius: "1rem",
  borderBottomRightRadius: "1rem",
  borderBottom: "1px solid #EAEBEB", // Remove bottom border
});

const StyledAccordionDetails = styled(AccordionDetails)({
  borderTop: "none", // Remove top border
});
export default function CustomFieldsAccordion({ customFields, refreshData }) {
  const headerData = [
    { key: "name", heading: "Name", width: "15%" },
    { key: "type", heading: "Type", width: "15%" },
  ];
  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Custom Fields
      </StyledAccordionSummary>
      <StyledAccordionDetails>
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
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
