import React, { useState } from "react";

import { Grid, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Colors } from "../config/default";
import Dropdown from "./dropdown";
import TextButton from "./button";

export default function AddTask({ handleClose, field, data }) {
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
          {data ? data?.taskName : "Add Task"}
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
        {field === "addTask" ? (
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
              type="email"
              placeholder="Title 5"
              style={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                height: "2rem",
                color: Colors.DIM_LIGHT_GRAY,
                paddingLeft: "1rem",
                border: "none",
                outline: "none",
                borderRadius: "5px",
                width: "65%",
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
            minWidth: "100%",
            maxWidth: "100%",
          }}
        />
      </div>
      <div style={{ marginTop: "1.5em", float: "right" }}>
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
