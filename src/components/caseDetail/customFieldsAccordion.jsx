import React, { useState, useEffect } from "react";

import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Colors } from "../../config/default";
import MuiModels from "../models";
import { GetCustomFieldsByTarget } from "../../services/services";

export default function CustomFieldsAccordion({ caseData, GetCaseDetails }) {
  const [customFieldsData, setCustomFieldsData] = useState([]);
  const customField = caseData?.customFields;
  const getFields = async () => {
    const result = await GetCustomFieldsByTarget("case");
    if (result?.status === 200) {
      setCustomFieldsData(result?.data?.data);
    }
  };
  useEffect(() => {
    getFields();
  }, []);

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
            Custom Fields
          </Typography>
          <div style={{ display: "flex" }} onClick={(e) => e.stopPropagation()}>
            <MuiModels
              buttonName="editCaseCustomField"
              show="EditCaseCustomField"
              customFieldsData={customFieldsData}
              GetCaseDetails={GetCaseDetails}
              caseData={caseData}
            />
            <MuiModels
              buttonName="CaseCustomFields"
              show="CaseCustomField"
              customFieldsData={customFieldsData}
              GetCaseDetails={GetCaseDetails}
            />
          </div>
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
          {customField &&
            customField?.map((item) => (
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
