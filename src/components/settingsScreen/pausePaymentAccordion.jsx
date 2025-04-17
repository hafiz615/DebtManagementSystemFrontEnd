import React, { useEffect, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
} from "@mui/material";
import { GetServiceFee, SaveServiceFee } from "../../services/services";
import { useToast } from "../../toast/toastContext";
import { Colors } from "../../config/default";
import TextButton from "../button";

const StyledAccordion = styled(Accordion)({
  "&:before": {
    display: "none",
  },
  width: "100%",
  borderRadius: "1rem !important",
  backgroundColor: Colors.WHITE,
  boxShadow: "none",
  marginTop: "1rem",
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

const textFieldStyling = {
  backgroundColor: Colors.BG_LIGHT_GRAY,
  height: "2.5rem",
  color: Colors.DIM_LIGHT_GRAY,
  paddingLeft: "1rem",
  outline: "none",
  border: "1px solid transparent",
  borderRadius: "5px",
  marginBottom: "1rem",
  width: "50%",
  fontFamily: "Nunito",
};

export default function PausePaymentAccordion() {
  const [fee, setFee] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const getPausePaymentFee = async () => {
    const res = await GetServiceFee();
    if (res?.status === 200) {
      setFee(res?.data?.data?.pausePaymentFee);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      fee: fee,
    };
    const res = await SaveServiceFee(payload, "pausePaymentFee");
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = rawValue ? parseInt(rawValue, 10) : "";
    setFee(numericValue);
  };

  useEffect(() => {
    getPausePaymentFee();
  }, []);

  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Pause Payment Fee
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            min={-1}
            type="text"
            value={fee ? `$${fee.toLocaleString()}` : ""}
            onChange={handleChange}
            placeholder="Enter Amount"
            style={textFieldStyling}
          />
          <TextButton
            buttonText="Save"
            height="2rem"
            width="8rem"
            onClick={handleSave}
            disabled={!fee}
            loading={loading}
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
          />
        </div>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
