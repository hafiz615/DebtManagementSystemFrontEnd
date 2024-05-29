import React from "react";

import {
  Grid,
  Typography,
  Radio,
  Divider,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Box,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Colors } from "../config/default";
import TextButton from "./button";

export default function AddCustomField({ handleClose }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Grid>
      <div>
        <Typography
          sx={{ fontWeight: "700", marginBottom: "1em", fontFamily: "Nunito" }}
        >
          Add Custom Field
        </Typography>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab sx={{ fontFamily: "Nunito" }} label="New" />
          <Tab sx={{ fontFamily: "Nunito" }} label="Shared" />
        </Tabs>
      </Box>
      <Divider />
      <input
        type="email"
        placeholder="Name"
        style={{
          backgroundColor: Colors.BG_LIGHT_GRAY,
          height: "2rem",
          color: Colors.DIM_LIGHT_GRAY,
          paddingLeft: "1rem",
          border: "none",
          outline: "none",
          borderRadius: "5px",
          marginTop: "1em",
          width: "calc(50% - .5rem)",
        }}
      />

      <div style={{ display: "flex", gap: "1rem", marginTop: "1em" }}>
        <input
          type="email"
          placeholder="Type"
          style={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            height: "2rem",
            color: Colors.DIM_LIGHT_GRAY,
            paddingLeft: "1rem",
            border: "none",
            outline: "none",
            borderRadius: "5px",
            width: "50%",
          }}
        />

        <input
          type="email"
          placeholder="Target"
          style={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            height: "2rem",
            color: Colors.DIM_LIGHT_GRAY,
            paddingLeft: "1rem",
            border: "none",
            outline: "none",
            borderRadius: "5px",
            width: "50%",
          }}
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
        />
      </div>
      <div style={{ fontFamily: "Nunito" }}>
        <Radio />
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
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
          onClick={handleClose}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      </div>
    </Grid>
  );
}
