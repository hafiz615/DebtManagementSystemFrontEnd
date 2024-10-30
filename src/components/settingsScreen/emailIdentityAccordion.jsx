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
import {
  VerfiyEmailIdentity,
  VerifySenderIdentity,
} from "../../services/services.js";

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

const textFieldStyling = {
  backgroundColor: Colors.BG_LIGHT_GRAY,
  height: "2.5rem",
  color: Colors.DIM_LIGHT_GRAY,
  paddingLeft: "1rem",
  border: "none",
  outline: "none",
  borderRadius: "5px",
  width: "100%",
  fontFamily: "Nunito",
  marginTop: "10px",
};

const divStyling = {
  display: "flex",
  flexDirection: "column",
  width: "48%",
  marginTop: "10px",
};

export default function EmailIdentityAccordion() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const addEmailIdentity = async () => {
    setLoading(true);
    const params = {
      from_email: email,
      from_name: name,
      address: address,
      city: city,
    };
    const response = await VerfiyEmailIdentity(params);
    if (response?.status === 200) {
      showToast(response?.data?.message, "success");
      setName("");
      setEmail("");
      setCity("");
      setAddress("");
    } else if (response?.response?.status === 400) {
      const errorMessage = response?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && url) {
      addEmailIdentity();
    }
  };

  const disable =
    !name?.trim() || !email?.trim() || !city?.trim() || !address?.trim();

  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Verify Email Identity
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Grid
          container
          item
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <div style={divStyling}>
            <label htmlFor="name" style={{ fontFamily: "Nunito" }}>
              Name*
            </label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              style={textFieldStyling}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div style={divStyling}>
            <label htmlFor="city" style={{ fontFamily: "Nunito" }}>
              City*
            </label>
            <input
              type="text"
              id="city"
              placeholder="City"
              style={textFieldStyling}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div style={divStyling}>
            <label htmlFor="email" style={{ fontFamily: "Nunito" }}>
              Email*
            </label>
            <input
              type="text"
              id="email"
              placeholder="Email"
              style={textFieldStyling}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div style={divStyling}>
            <label htmlFor="address" style={{ fontFamily: "Nunito" }}>
              Address*
            </label>
            <input
              type="text"
              id="address"
              placeholder="Address"
              style={textFieldStyling}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </Grid>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <TextButton
            buttonText="SAVE"
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            paddingLeft="2rem"
            paddingRight="2rem"
            width="8rem"
            height="2rem"
            marginRight="1rem"
            marginTop="1rem"
            disabled={disable}
            onClick={addEmailIdentity}
            loading={loading}
          />
        </div>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
