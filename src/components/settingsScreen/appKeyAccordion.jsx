import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import { Grid } from "@mui/material";
import TextButton from "../button";
import { useToast } from "../../toast/toastContext";
import { styled } from "@mui/material/styles";
import { GetPortalAccessKey, SavePortalKey } from "../../services/services";

const StyledAccordion = styled(Accordion)({
  "&:before": {
    display: "none",
  },
  width: "100%",
  borderRadius: "1rem !important",
  backgroundColor: Colors.WHITE,
  marginTop: "1rem",
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

export default function AppKeyAccordion() {
  const { showToast } = useToast();
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);

  const savePortalAccessKey = async () => {
    setLoading(true);
    const params = { key: key };
    const response = await SavePortalKey(params);
    if (response?.status === 200) {
      showToast(response?.data?.message, "success");
      getAccessKey();
    } else if (response.status === 400) {
      const errorMessage = response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  const getAccessKey = async () => {
    const response = await GetPortalAccessKey();
    if (response?.status === 200) {
      setKey(response?.data?.data);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && key) {
      savePortalAccessKey();
    }
  };

  useEffect(() => {
    getAccessKey();
  }, []);

  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Portal Access Key
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
            placeholder="Paste Key Here"
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
            value={key}
            onChange={(e) => setKey(e.target.value)}
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
            disabled={!key}
            onClick={savePortalAccessKey}
            loading={loading}
          />
        </Grid>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
