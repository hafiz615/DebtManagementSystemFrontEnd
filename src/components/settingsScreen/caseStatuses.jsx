import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Add } from "@mui/icons-material";
import { Grid } from "@mui/material";
import TextButton from "../button";
import { styled } from "@mui/material/styles";
import StatusLists from "./statusesList";
import { AddStatus, GetAllStatuses } from "../../services/services";
import { useToast } from "../../toast/toastContext";

const StyledAccordion = styled(Accordion)({
  "&:before": {
    display: "none", // Remove the default line
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
  borderBottom: "1px solid #EAEBEB", // Remove bottom border
});

const StyledAccordionDetails = styled(AccordionDetails)({
  borderTop: "none", // Remove top border
});

export default function CaseStatuses() {
  const { showToast } = useToast();
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:900px)");
  const [loading, setLoading] = useState(false);
  const [buttonReload, setButtonReload] = useState(false);
  const [arrayStatus, setArrayStatus] = useState([]);
  const [statusId, setStatusId] = useState("");
  const [addStatus, setAddStatus] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const GetStatuses = async () => {
    setLoading(true);
    const AllStatuses = await GetAllStatuses();
    if (AllStatuses?.status === 200) {
      setArrayStatus(AllStatuses?.data?.data?.status);
      setStatusId(AllStatuses?.data?.data?._id);
    } else {
      const errorMessage = AllStatuses?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    GetStatuses();
  }, []);

  const handleAddStatus = async () => {
    setButtonReload(true);
    const params = { status: addStatus };
    const AddResponse = await AddStatus(params);

    if (AddResponse?.status === 200) {
      GetStatuses();
      setAddStatus("");
      setIsButtonDisabled(true); // Reset button disabled state after adding status
    } else {
      const errorMessage = AddResponse?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setButtonReload(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setAddStatus(value);
    setIsButtonDisabled(value.trim() === "" || value.startsWith(" "));
  };

  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Case Statuses
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Grid
          container
          item
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Status Name"
            value={addStatus}
            onChange={handleInputChange}
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border: "none",
              outline: "none",
              borderRadius: "5px",
              width: "83%",
            }}
          />
          <TextButton
            buttonText="Add Status"
            height="2.5rem"
            width="15%"
            marginTop={smallScreen && "1rem"}
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            startIcon={buttonReload ? "" : <Add />}
            onClick={handleAddStatus}
            loading={buttonReload}
            disabled={isButtonDisabled}
          />
        </Grid>
        <Grid
          container
          item
          sx={{
            marginTop: "1.5rem",
          }}
        >
          <StatusLists
            arrayStatus={arrayStatus}
            statusId={statusId}
            setArrayStatus={setArrayStatus}
            loading={loading}
            GetStatuses={GetStatuses}
          />
        </Grid>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
