import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import { Typography, Grid, Checkbox, FormControlLabel } from "@mui/material";
import TextButton from "../button";
import { styled } from "@mui/material/styles";

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

export default function JustificationModal() {
  const typographyOptions = ["Gemini", "GPT-04", "Llama"];

  const [checkboxState, setCheckboxState] = useState({
    Gemini: false,
    "GPT-04": false,
    Llama: false,
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    setCheckboxState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  //   const handleSave = () => {
  //     console.log("Checkbox State:", checkboxState);
  //   };

  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Justification Modal
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
          {typographyOptions.map((name) => (
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
            marginRight="1rem"
            // onClick={handleSave}
          />
        </Grid>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
