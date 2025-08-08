import React, { useState, useCallback } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import { Editor } from "@tinymce/tinymce-react";
import { TEXT_EDITOR_KEY } from "../../constants/appConstants";
import { AddCreditorNote } from "../../services/services";
import { formatDollarAmount } from "../../common";
import debounce from "lodash.debounce";

export default function OtherCreditorsAccordion({ caseData }) {
  const [textEditorData, setTextEditorData] = useState(
    caseData?.creditor?.note
  );

  const aboutData = [
    {
      name: "Pipeline Status",
      value: caseData?.status || "-",
    },
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
      const payload = { note: content };
      await AddCreditorNote(payload, caseData?.creditor?._id);
    }, 1000),
    [caseData?.creditor?._id]
  );

  const handleEditorChange = (content) => {
    setTextEditorData(content);
    debouncedSaveNote(content);
  };

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
            {caseData?.creditor?.businessInformation?.companyName}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: Colors.WHITE,
          boxShadow: "0 2px 5px -3px rgba(0, 0, 0, 0.5)",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      >
        <Grid>
          {aboutData?.map((item, index) => (
            <Grid
              container
              sx={{ justifyContent: "space-between", mb: "10px" }}
              key={index}
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
                  fontWeight: "600",
                }}
              >
                {item?.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Grid>
          <Editor
            apiKey={TEXT_EDITOR_KEY}
            init={{
              menubar: false,
              toolbar:
                "formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat",
              height: 250,
            }}
            value={textEditorData}
            onEditorChange={handleEditorChange}
          />
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
