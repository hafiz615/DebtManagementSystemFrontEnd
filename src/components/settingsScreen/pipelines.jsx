import React, { useState } from "react";

import { Grid, Typography, IconButton, CircularProgress } from "@mui/material";
import { Add, Difference } from "@mui/icons-material";

import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../../constants/appConstants";
import { Colors } from "../../config/default";
import Dropdown from "../dropdown";
import TextButton from "../button";
import DraggablePipelineRow from "./draggablePipelineRow";
import MuiModels from "../models";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";

export default function Pipelines({ pipelineList, setPipelineList }) {
  const [selectedValue, setSelectedValue] = useState("Active");
  const [inputChange, setInputChange] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const menuItems = [
    { label: "Active", value: "Active" },
    { label: "Won", value: "Won" },
    { label: "Lost", value: "Lost" },
  ];

  const moveRow = (dragIndex, hoverIndex) => {
    const draggedItem = pipelineList[dragIndex];
    setPipelineList(
      update(pipelineList, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedItem],
        ],
      })
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputChange(value);
    setIsButtonDisabled(value.trim() === "" || value.startsWith(" "));
  };

  return (
    <Grid sx={{ mb: "1rem" }}>
      <Grid container sx={{ justifyContent: "space-between" }}>
        <div>
          <Typography
            sx={{
              fontSize: FONT_SIZE_LARGE,
              fontFamily: "Nunito",
              fontWeight: "700",
            }}
          >
            Negotiations
          </Typography>
        </div>
        <div style={{ display: "flex" }}>
          <MuiModels show="editMainPipeline" button="create" iconSize="16px" />
          <IconButton>
            <Difference sx={{ fontSize: FONT_SIZE_XL }} />
          </IconButton>
          <MuiModels
            show="deleteMainPipeline"
            button="delete"
            iconSize="16px"
          />
        </div>
      </Grid>
      <Grid container sx={{ justifyContent: "space-between", m: "10px 0px" }}>
        <input
          type="text"
          placeholder="Status Name"
          style={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            height: "2.5rem",
            color: Colors.DIM_LIGHT_GRAY,
            paddingLeft: "1rem",
            border: "none",
            outline: "none",
            borderRadius: "5px",
            width: "67%",
            fontFamily: "Nunito",
          }}
          value={inputChange}
          onChange={handleInputChange}
        />
        <Dropdown
          menuWidth="10%"
          menuItems={menuItems}
          placeholder="Type"
          backgroundColor={Colors.BG_LIGHT_GRAY}
          hoverColor={Colors.BG_LIGHT_GRAY}
          width="15%"
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
        <TextButton
          buttonText="Add Status"
          height="2.5rem"
          width="15%"
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          startIcon={<Add />}
          disabled={isButtonDisabled}
        />
      </Grid>
      <Grid>
        <DndProvider backend={HTML5Backend}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr
                style={{
                  display: "flex",
                  fontFamily: "Nunito",
                  fontWeight: "700",
                  fontSize: FONT_SIZE_LARGE,
                }}
              >
                <th style={{ width: "30%", textAlign: "left" }}>Name</th>
                <th style={{ width: "70%", textAlign: "left" }}>Status</th>
                <th
                  style={{
                    width: "5%",
                    marginRight: "2rem",
                    textAlign: "left",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <Grid
                sx={{
                  height: "auto",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#E5E5E5",
                    borderRadius: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: Colors.WHITE,
                    borderRadius: "8px",
                    marginTop: ".5rem",
                    marginBottom: ".5rem",
                  },
                }}
              >
                {pipelineList?.map((item, index) => (
                  <DraggablePipelineRow
                    pipelineList={pipelineList}
                    moveRow={moveRow}
                    item={item}
                    index={index}
                    id={index}
                  />
                ))}
              </Grid>
            </tbody>
          </table>
        </DndProvider>
      </Grid>
    </Grid>
  );
}
