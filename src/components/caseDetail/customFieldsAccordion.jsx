import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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
  const { id } = useParams();
  const getFields = async () => {
    const result = await GetCustomFieldsByTarget("case");
    if (result?.status === 200) {
      setCustomFieldsData(result?.data?.data);
    }
  };
  useEffect(() => {
    getFields();
  }, [id]);

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              color: Colors.WHITE,
              fontFamily: "Nunito",
              fontWeight: "700",
            }}
          >
            CUSTOM FIELDS
          </Typography>
          <div style={{ display: "flex" }} onClick={(e) => e.stopPropagation()}>
            {customField?.length > 0 && (
              <MuiModels
                buttonName="editCaseCustomField"
                show="EditCaseCustomField"
                customFieldsData={customFieldsData}
                GetCaseDetails={GetCaseDetails}
                caseData={caseData}
              />
            )}

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
          backgroundColor: Colors.WHITE,
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
                    color: Colors.DIM_LIGHT_GRAY,
                    fontWeight: "500",
                  }}
                >
                  {item?.value}
                </Typography>
              </Grid>
            ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
