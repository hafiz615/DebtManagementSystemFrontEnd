import React, { useState, useCallback } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import { Editor } from "@tinymce/tinymce-react";
import { TEXT_EDITOR_KEY } from "../../constants/appConstants";
import { AddCreditorNote } from "../../services/services";
import { formatDollarAmount } from "../../common";
import debounce from "lodash.debounce";

// Style Constants
const S = {
  accordion: {
    boxShadow: "none",
    marginBottom: "10px",
    borderRadius: "1rem !important",
    backgroundColor: Colors.WHITE,
  },
  summary: {
    height: "20px",
    backgroundColor: Colors.SKY_BLUE,
    borderRadius: "1rem",
  },
  expandIcon: { color: Colors.WHITE },
  headerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  title: { color: Colors.WHITE, fontFamily: "Nunito", fontWeight: "700" },
  details: {
    backgroundColor: Colors.WHITE,
    boxShadow: "0 2px 5px -3px rgba(0, 0, 0, 0.5)",
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
  },
  gridContainer: { justifyContent: "space-between", mb: "10px" },
  labelText: {
    fontSize: "11px",
    fontFamily: "Nunito",
    color: Colors.DARK_GRAY,
    fontWeight: "700",
  },
  valueText: {
    fontSize: "11px",
    fontFamily: "Nunito",
    color: Colors.DIM_LIGHT_GRAY,
    fontWeight: "600",
  },
};

const EDITOR_CONFIG = {
  menubar: false,
  toolbar:
    "formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat",
  height: 250,
};

export default function OtherCreditorsAccordion({ caseData, creditorId }) {
  const [textEditorData, setTextEditorData] = useState(
    caseData?.creditor?.note
  );

  const aboutData = [
    { name: "Pipeline Status", value: caseData?.status || "-" },
    {
      name: "Time Period",
      value:
        caseData?.intervals?.length > 0
          ? caseData?.intervals?.[0]?.timePeriod
          : "-",
    },
    {
      name: "Total Paid",
      value: formatDollarAmount(caseData?.paidAmount) || "-",
    },
    {
      name: "Current Balance",
      value:
        formatDollarAmount(
          caseData?.totalDebt - caseData?.remainingAmountPaid
        ) || "-",
    },
  ];

  const debouncedSaveNote = useCallback(
    debounce(async (content) => {
      await AddCreditorNote({ note: content }, creditorId);
    }, 1000),
    [creditorId]
  );

  const handleEditorChange = (content) => {
    setTextEditorData(content);
    debouncedSaveNote(content);
  };

  return (
    <Accordion sx={S.accordion} defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={S.expandIcon} />}
        sx={S.summary}
      >
        <div style={S.headerContainer}>
          <Typography sx={S.title}>
            {caseData?.creditor?.businessInformation?.companyName}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails sx={S.details}>
        <Grid>
          {aboutData?.map((item, index) => (
            <Grid container sx={S.gridContainer} key={index}>
              <Typography sx={S.labelText}>{item?.name}</Typography>
              <Tooltip title={item?.value} placement="top">
                <Typography sx={S.valueText}>{item?.value}</Typography>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
        <Grid>
          <Editor
            apiKey={TEXT_EDITOR_KEY}
            init={EDITOR_CONFIG}
            value={textEditorData}
            onEditorChange={handleEditorChange}
          />
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
