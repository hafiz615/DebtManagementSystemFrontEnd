import React, { useState } from "react";
import {
  Grid,
  Typography,
  Checkbox,
  Divider,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../config/default";
import TextButton from "./button";
import { CreateCustomField } from "../services/services";
import { useToast } from "../toast/toastContext";
import Dropdown from "./dropdown";
import { inputTypesArray } from "../common";

export default function AddCustomField({ handleClose, handleModalClose }) {
  const menuItems = [{ label: "Case", value: "case" }];
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    target: "",
    description: "",
    shared: false,
  });

  const handleChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const customFieldSubmission = await CreateCustomField(formData);
    if (customFieldSubmission?.status === 200) {
      showToast(customFieldSubmission?.data?.message, "success");
      handleClose();
      handleModalClose();
    } else {
      const errorMessage = customFieldSubmission?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  return (
    <Grid>
      <div>
        <Typography
          sx={{
            fontWeight: "700",
            marginBottom: "1em",
            fontFamily: "Nunito",
          }}
        >
          Add Custom Field
        </Typography>
      </div>
      <Divider />
      <input
        type="text"
        placeholder="Name"
        style={{
          backgroundColor: Colors.BG_LIGHT_GRAY,
          height: "2.5rem",
          color: Colors.DIM_LIGHT_GRAY,
          paddingLeft: "1rem",
          border: "none",
          outline: "none",
          borderRadius: "5px",
          marginTop: "1em",
          width: "calc(50% - .5rem)",
        }}
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <div style={{ display: "flex", gap: "1rem", marginTop: "1em" }}>
        <Dropdown
          menuWidth="22rem"
          menuItems={inputTypesArray}
          placeholder="Type"
          backgroundColor={Colors.BG_LIGHT_GRAY}
          hoverColor={Colors.BG_LIGHT_GRAY}
          width="50%"
          selectedValue={formData.type}
          setSelectedValue={(value) => handleChange("type", value)}
        />

        <Dropdown
          menuWidth="22rem"
          menuItems={menuItems}
          placeholder="Target"
          backgroundColor={Colors.BG_LIGHT_GRAY}
          hoverColor={Colors.BG_LIGHT_GRAY}
          width="50%"
          selectedValue={formData.target}
          setSelectedValue={(value) => handleChange("target", value)}
        />
      </div>
      <div style={{ marginTop: "1em" }}>
        <textarea
          placeholder="Description"
          rows="4"
          style={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            border: "none",
            outline: "none",
            minWidth: "100%",
            maxWidth: "100%",
            padding: "1em",
          }}
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
      <div style={{ fontFamily: "Nunito" }}>
        <Checkbox
          checked={formData.shared}
          onChange={(e) => handleChange("shared", e.target.checked)}
        />
        Share
      </div>
      <Accordion
        sx={{
          boxShadow: "none",
          borderBottom: `1px solid ${Colors.LIGHT_GRAY}`,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            borderTop: `1px solid ${Colors.LIGHT_GRAY}`,
            borderBottom: `1px solid ${Colors.LIGHT_GRAY}`,
            fontFamily: "Nunito",
          }}
        >
          Field Options
        </AccordionSummary>
        <AccordionDetails sx={{ fontFamily: "Nunito" }}>
          <Typography
            sx={{ fontWeight: "600", margin: ".5em 0em", fontFamily: "Nunito" }}
          >
            Permission
          </Typography>

          <div style={{ display: "flex" }}>
            <Switch />
            <Typography
              sx={{
                fontWeight: "500",
                margin: ".5em 0em",
                fontFamily: "Nunito",
              }}
            >
              Restrict
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      <div
        style={{
          marginTop: "1em",
          gap: "1em",
          display: "flex",
          justifyContent: "right",
        }}
      >
        <TextButton
          buttonText="Cancel"
          height="2rem"
          width="8rem"
          onClick={handleClose}
          backgroundColor={Colors.ORANGE_COLOR}
          hoverColor={Colors.ORANGE_COLOR}
        />
        <TextButton
          buttonText="Save"
          height="2rem"
          width="8rem"
          onClick={handleSave}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      </div>
    </Grid>
  );
}
