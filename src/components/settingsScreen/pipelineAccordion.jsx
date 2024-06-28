import React, { useState, useEffect } from "react";

import {
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Add } from "@mui/icons-material";

import Pipelines from "./pipelines";
import TextButton from "../button";
import { Colors } from "../../config/default";
import { useToast } from "../../toast/toastContext";
import { FONT_SIZE_XL } from "../../constants/appConstants";
import MuiModels from "../models";

const StyledAccordion = styled(Accordion)({
  "&:before": {
    display: "none",
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
  borderBottom: "1px solid #EAEBEB",
});

const StyledAccordionDetails = styled(AccordionDetails)({
  borderTop: "none",
});

export default function PipelineAccordion() {
  const [pipelineList, setPipelineList] = useState([]);
  const { showToast } = useToast();
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:900px)");

  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div
          style={{
            width: "98%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontSize: FONT_SIZE_XL,
              fontFamily: "Nunito",
              fontWeight: "700",
            }}
          >
            Pipelines
          </Typography>
          <div onClick={(e) => e.stopPropagation()}>
            <MuiModels show="addPipeline" />
          </div>
        </div>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Grid>
          <Pipelines
            pipelineList={pipelineList}
            setPipelineList={setPipelineList}
          />
        </Grid>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
