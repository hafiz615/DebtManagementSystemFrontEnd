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

const formatCurrency = (value) => {
  if (!value) return `$${new Intl.NumberFormat("en-US").format(0)}`;
  return `$${new Intl.NumberFormat("en-US").format(value)}`;
};

export default function ServiceFeeAccordion() {
  const [serviceFee, setServiceFee] = useState("");
  const [serviceFeeLoading, setServiceFeeLoading] = useState(false);
  const { showToast } = useToast();

  const getServiceFee = async () => {
    const res = await GetServiceFee();
    if (res?.status === 200) {
      setServiceFee(res?.data?.data);
    }
  };

  const handleSave = async () => {
    setServiceFeeLoading(true);
    const payload = {
      serviceFee: serviceFee,
    };
    const res = await SaveServiceFee(payload);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
    }
    setServiceFeeLoading(false);
  };

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = rawValue ? parseInt(rawValue, 10) : "";
    setServiceFee(numericValue);
  };

  useEffect(() => {
    getServiceFee();
  }, []);

  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Service Fee
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            min={-1}
            type="text"
            value={serviceFee ? `$${serviceFee.toLocaleString()}` : ""}
            onChange={handleChange}
            placeholder="Enter Amount"
            style={textFieldStyling}
          />
          <TextButton
            buttonText="Save"
            height="2rem"
            width="8rem"
            onClick={handleSave}
            disabled={!serviceFee}
            loading={serviceFeeLoading}
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
          />
        </div>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
