import React from "react";

import {
  Grid,
  Button,
  Typography,
  Radio,
  Divider,
  Switch,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Colors } from "../config/default";

export default function EditField({ handleClose }) {
  return (
    <Grid>
      <div>
        <Typography sx={{ fontWeight: "700", marginBottom: "1em" }}>
          Edit Field
        </Typography>
      </div>
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
          width: "calc(48% - 1rem)",
        }}
      />

      <div style={{ display: "flex", gap: "1em", marginTop: "1em" }}>
        <input
          type="number"
          placeholder="Type"
          style={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            height: "2rem",
            color: Colors.DIM_LIGHT_GRAY,
            paddingLeft: "1rem",
            border: "none",
            outline: "none",
            borderRadius: "5px",
            width: "calc(100% - 1rem)",
          }}
        />

        <input
          type="number"
          placeholder="Target"
          style={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            height: "2rem",
            color: Colors.DIM_LIGHT_GRAY,
            paddingLeft: "1rem",
            border: "none",
            outline: "none",
            borderRadius: "5px",
            width: "calc(100% - 1rem)",
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
            width: "100%",
            padding: "1em",
          }}
        />
      </div>
      <div>
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
          }}
        >
          Field Options
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontWeight: "600", margin: ".5em 0em" }}>
            Permission
          </Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
          <div style={{ display: "flex" }}>
            <Switch />
            <Typography sx={{ fontWeight: "500", margin: ".5em 0em" }}>
              Restrict
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      <div style={{ marginTop: "1em", float: "right" }}>
        <Button
          variant="contained"
          style={{
            width: "8rem",
            backgroundColor: Colors.BG_LIGHT_GRAY,
            color: Colors.BLACK,
          }}
          onClick={handleClose}
        >
          CANCEL
        </Button>
        <Button
          variant="contained"
          style={{ width: "8rem", marginLeft: "1em" }}
        >
          SAVE
        </Button>
      </div>
    </Grid>
  );
}
