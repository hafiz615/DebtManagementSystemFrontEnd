import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import { Grid } from "@mui/material";
import TextButton from "../button";
import { useToast } from "../../toast/toastContext";
import { styled } from "@mui/material/styles";
import { VerifySenderIdentity } from "../../services/services.js";

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

export default function AddUrlsAccordion() {
  const { showToast } = useToast();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const VerifySenderInformation = async () => {
    setLoading(true);
    const params = { url };
    const VerifySenderInfoResponse = await VerifySenderIdentity(params);
    if (VerifySenderInfoResponse?.status === 200) {
      showToast(VerifySenderInfoResponse?.data?.message, "success");
      setUrl("");
    } else if (VerifySenderInfoResponse?.response?.status === 400) {
      const errorMessage = VerifySenderInfoResponse?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && url) {
      VerifySenderInformation();
    }
  };

  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Add Url
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Grid
          container
          sx={{
            paddingLeft: { xs: "0.5rem", sm: "2rem" },
            paddingRight: { xs: "0.5rem", sm: "2rem" },
          }}
        ></Grid>
        <Grid
          container
          item
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <input
            type="text"
            placeholder="Paste Url Here"
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border: "none",
              outline: "none",
              borderRadius: "5px",
              width: "100%",
              fontFamily: "Nunito",
              marginTop: "1rem",
            }}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <TextButton
            buttonText="SAVE"
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            paddingLeft="2rem"
            paddingRight="2rem"
            height="2rem"
            marginRight="1rem"
            marginTop="1rem"
            disabled={!url}
            onClick={VerifySenderInformation}
            loading={loading}
          />
        </Grid>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
