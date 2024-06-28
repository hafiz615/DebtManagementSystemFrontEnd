import React, { useState } from "react";

import { Grid, Typography, IconButton, CircularProgress } from "@mui/material";
import { Add, Difference } from "@mui/icons-material";

import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../../constants/appConstants";
import { Colors } from "../../config/default";
import Dropdown from "../dropdown";
import TextButton from "../button";
import DraggablePipelineRow from "./draggablePipelineRow";
import MuiModels from "../models";

export default function Pipelines({ pipelineList, setPipelineList }) {
  const [selectedValue, setSelectedValue] = useState("Active");
  const menuItems = [
    { label: "Active", value: "Active" },
    { label: "Won", value: "Won" },
    { label: "Lost", value: "Lost" },
  ];

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
          <MuiModels
            show="editMainPipeline"
            button="create"
            iconSize="16px"
            //   text={text}
            //   statusId={statusId}
            //   GetStatuses={GetStatuses}
          />
          <IconButton>
            <Difference sx={{ fontSize: FONT_SIZE_XL }} />
          </IconButton>
          <MuiModels
            show="deleteMainPipeline"
            button="delete"
            iconSize="16px"
            //   text={text}
            //   statusId={statusId}
            //   GetStatuses={GetStatuses}
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
            width: "73%",
          }}
        />
        <Dropdown
          menuWidth="10%"
          menuItems={menuItems}
          placeholder="Type"
          backgroundColor={Colors.BG_LIGHT_GRAY}
          hoverColor={Colors.BG_LIGHT_GRAY}
          width="12%"
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
        <TextButton
          buttonText="Add Status"
          height="2.5rem"
          width="12%"
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          startIcon={<Add />}
        />
      </Grid>
      <Grid>
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
              <th style={{ width: "60%", textAlign: "left" }}>Status</th>
              <th
                style={{ width: "10%", marginRight: "2rem", textAlign: "left" }}
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
              {/* {loading ? (
                <Grid
                  container
                  xs={12}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "40vh",
                  }}
                >
                  <CircularProgress size={40} sx={{ color: Colors.SKY_BLUE }} />
                </Grid>
              ) : (
                arrayStatus?.map((item, index) => ( */}
              <DraggablePipelineRow
              // key={index}
              // index={index}
              // id={index}
              // text={item}
              // moveRow={moveRow}
              // arrayStatus={arrayStatus}
              // statusId={statusId}
              // GetStatuses={GetStatuses}
              />
              {/* ))
              )} */}
              {/* {arrayStatus?.length === 0 && (
              <Typography
                sx={{
                  textAlign: "center",
                  fontFamily: "Nunito",
                  fontSize: "14px",
                }}
              >
                No Record Exists
              </Typography>
            )} */}
            </Grid>
          </tbody>
        </table>
      </Grid>
    </Grid>
  );
}
