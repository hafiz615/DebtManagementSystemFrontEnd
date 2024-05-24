import React, { useState } from "react";

import { Grid, Button, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Colors } from "../config/default";
import Dropdown from "./dropdown";

export default function AddTask({ handleClose, show }) {
  const [selectedValue, setSelectedValue] = useState("3");

  const menuItems = [
    { label: "5", value: 5 },
    { label: "7", value: 7 },
  ];
  const status = [
    { label: "On Hold", value: "On Hold" },
    { label: "Blocked", value: "Blocked" },
    { label: "To Do", value: "To Do" },
    { label: "Completed", value: "Completed" },
  ];

  return (
    <Grid>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontWeight: "700", fontFamily: "Nunito" }}>
          Add Task
        </Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </div>
      <div style={{ display: "flex", gap: "1em", marginTop: "1.5em" }}>
        <div
          style={{
            display: "flex",
            width: "50%",
            justifyContent: "space-between",
            fontFamily: "Nunito",
          }}
        >
          Due Date
          <Dropdown
            width="65%"
            menuItems={menuItems}
            defaultSelectedItem={"4/2/2024"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
          />
        </div>
        <div
          style={{
            display: "flex",
            width: "50%",
            justifyContent: "space-between",
            fontFamily: "Nunito",
          }}
        >
          Time
          <Dropdown
            width="65%"
            menuItems={menuItems}
            defaultSelectedItem={"5:20 PM"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "1em", marginTop: "1.5em" }}>
        {show === "addTask" ? (
          <div
            style={{
              display: "flex",
              width: "50%",
              justifyContent: "space-between",
              fontFamily: "Nunito",
            }}
          >
            Title
            <input
              type="number"
              placeholder="Title 5"
              style={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                height: "2rem",
                color: Colors.DIM_LIGHT_GRAY,
                paddingLeft: "1rem",
                border: "none",
                outline: "none",
                borderRadius: "5px",
                width: "calc(65% - 1rem)",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              width: "50%",
              justifyContent: "space-between",
              fontFamily: "Nunito",
            }}
          >
            Status
            <Dropdown
              width="65%"
              menuItems={status}
              defaultSelectedItem={"Completed"}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
            />
          </div>
        )}

        <div
          style={{
            display: "flex",
            width: "50%",
            justifyContent: "space-between",
            fontFamily: "Nunito",
          }}
        >
          Assignee
          <Dropdown
            width="65%"
            menuItems={menuItems}
            defaultSelectedItem={"Assignee Name"}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
          />
        </div>
      </div>
      <div style={{ marginTop: "1.5em", fontFamily: "Nunito" }}>
        Notes
        <textarea
          rows="6"
          style={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            border: "none",
            outline: "none",
            marginTop: "1em",
            width: "100%",
          }}
        />
      </div>
      <div style={{ marginTop: "1.5em", float: "right" }}>
        <Button
          variant="contained"
          style={{ width: "8rem", fontFamily: "Nunito" }}
        >
          SAVE
        </Button>
      </div>
    </Grid>
  );
}
