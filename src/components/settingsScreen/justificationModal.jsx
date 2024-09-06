import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import { Typography, Grid, Checkbox, FormControlLabel } from "@mui/material";
import TextButton from "../button";
import { styled } from "@mui/material/styles";
import { SelectJustificationModal } from "../../services/services";
import { useToast } from "../../toast/toastContext";

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

export default function JustificationModal({
  getSettings,
  selectJustification,
}) {
  const typographyOptions = ["Gemini", "GPT-04", "Llama", "Claude"];
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [checkboxState, setCheckboxState] = useState({
    Gemini: selectJustification?.gemini || false,
    Llama: selectJustification?.llama || false,
    "GPT-04": selectJustification?.chatgpt || false,
    Claude: selectJustification?.claude || false,
  });
  useEffect(() => {
    const justificationData = {
      Gemini: selectJustification?.gemini,
      Llama: selectJustification?.llama,
      "GPT-04": selectJustification?.chatgpt,
      Claude: selectJustification?.claude,
    };
    setCheckboxState(justificationData);
  }, [selectJustification]);
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    setCheckboxState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const params = {
      gemini: checkboxState?.Gemini ? checkboxState?.Gemini : false,
      llama: checkboxState?.Llama ? checkboxState?.Llama : false,
      chatgpt: checkboxState["GPT-04"] ? checkboxState["GPT-04"] : false,
      claude: checkboxState?.Claude ? checkboxState?.Claude : false,
    };

    const justificationRes = await SelectJustificationModal(params);
    if (justificationRes?.status === 200) {
      showToast(justificationRes?.data?.message, "success");
      getSettings();
    } else {
      const errorMessage = justificationRes?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Justification Models
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Grid
          container
          spacing={2}
          sx={{
            paddingLeft: { xs: "0.5rem", sm: "2rem" },
            paddingRight: { xs: "0.5rem", sm: "2rem" },
          }}
        >
          {typographyOptions?.map((name) => (
            <Grid item xs={12} key={name}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={name}
                    checked={checkboxState[name]}
                    onChange={handleCheckboxChange}
                    sx={{
                      "&.Mui-checked": {
                        color: Colors.SKY_BLUE, // Checked color
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
                    {name}
                  </Typography>
                }
              />
            </Grid>
          ))}
        </Grid>
        <Grid
          container
          item
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <TextButton
            buttonText="SAVE"
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            paddingLeft="2rem"
            paddingRight="2rem"
            height="2rem"
            width="6rem"
            marginRight="1rem"
            onClick={handleSave}
            loading={loading}
          />
        </Grid>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
