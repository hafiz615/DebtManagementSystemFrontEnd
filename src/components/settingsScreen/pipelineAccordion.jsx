import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import {
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  // useMediaQuery,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Pipelines from "./pipelines";
import { Colors } from "../../config/default";
import { useToast } from "../../toast/toastContext";
import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../../constants/appConstants";
import MuiModels from "../models";
import { GetAllPipelines } from "../../services/services";
import { isEmpty } from "lodash";

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
  const settings = useSelector(
    (state) => state?.permissions?.permissions?.settings
  );
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  // const smallScreen = useMediaQuery("(min-width:315px) and (max-width:900px)");

  const GetPipelines = async () => {
    setLoading(true);
    const resPipeLine = await GetAllPipelines();
    if (resPipeLine.status === 200) {
      setPipeline(resPipeLine?.data?.data);
    } else {
      const errorMessage = resPipeLine?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    GetPipelines();
  }, []);

  return (
    <StyledAccordion sx={{ overflowX: "auto" }}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div
          style={{
            width: "98%",
            display: "flex",
            alignItems: "center",
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
          {settings?.createPipeline && (
            <span onClick={(e) => e.stopPropagation()}>
              <MuiModels show="addPipeline" GetPipelines={GetPipelines} />
            </span>
          )}
        </div>
      </StyledAccordionSummary>
      <StyledAccordionDetails sx={{ width: { xs: "140vw", sm: "auto" } }}>
        {loading ? (
          <Grid
            container
            xs={12}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              height: "40vh",
            }}
          >
            <CircularProgress size={24} sx={{ color: Colors.SKY_BLUE }} />
          </Grid>
        ) : isEmpty(pipeline) ? (
          <p
            style={{
              fontFamily: "Nunito",
              fontSize: FONT_SIZE_LARGE,
              textAlign: "center",
            }}
          >
            No Pipeline Exist...
          </p>
        ) : (
          pipeline?.map((item) => {
            return (
              <Grid>
                <Pipelines GetPipelines={GetPipelines} item={item} />
              </Grid>
            );
          })
        )}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
