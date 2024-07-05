import React, { useState, useEffect } from "react";

import { Grid, Typography, IconButton } from "@mui/material";
import { Add, Difference } from "@mui/icons-material";

import { FONT_SIZE_LARGE } from "../../constants/appConstants";
import { Colors } from "../../config/default";
import Dropdown from "../dropdown";
import TextButton from "../button";
import DraggablePipelineRow from "./draggablePipelineRow";
import MuiModels from "../models";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import Prompt from "../prompt";
import {
  AddStatusPipeline,
  CreatePipeline,
  DeletePipeLine,
  EditStatusPipeline,
} from "../../services/services";
import { useToast } from "../../toast/toastContext";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Pipelines({ item, GetPipelines }) {
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:1040px)");
  const extraSmallScreen = useMediaQuery(
    "(min-width:300px) and (max-width:768px)"
  );
  const [selectedValue, setSelectedValue] = useState("Active");
  const [inputChange, setInputChange] = useState("");
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [pipelineList, setPipelineList] = useState([]);
  const [pipelineId, setPipelineId] = useState("");
  const { showToast } = useToast();

  const menuItems = [
    { label: "Active", value: "Active" },
    { label: "Won", value: "Won" },
    { label: "Lost", value: "Lost" },
  ];

  useEffect(() => {
    setPipelineList(item?.status);
    setPipelineId(item?._id);
  }, []);

  const updateRowStatus = async () => {
    if (item?._id || pipelineList) {
      const payload = {
        pipeline: item?.pipeline,
        description: "",
        status: pipelineList,
      };

      await EditStatusPipeline(payload, item?._id);
    }
  };
  useEffect(() => {
    updateRowStatus();
  }, [pipelineList, item?._id]);

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

  const handleDelete = async () => {
    const DeleteRes = await DeletePipeLine(item?._id);
    if (DeleteRes?.status === 200) {
      showToast(DeleteRes?.data?.message, "success");
      GetPipelines();
    } else {
      const errorMessage = DeleteRes?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  const handleAddStatus = async () => {
    setLoading(true);
    const params = { name: inputChange, type: selectedValue };
    const resAddStatusPipeline = await AddStatusPipeline(params, item?._id);
    if (resAddStatusPipeline?.status === 200) {
      showToast(resAddStatusPipeline?.data?.message, "success");
      GetPipelines();
      setInputChange("");
    } else {
      const errorMessage = resAddStatusPipeline?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  const handleDuplicatePipeline = async () => {
    const params = { pipeline: item?.pipeline };
    const resaddPipeline = await CreatePipeline(params);
    if (resaddPipeline?.status === 200) {
      const newId = resaddPipeline?.data?.data?._id;

      const payload = {
        pipeline: item?.pipeline,
        description: "",
        status: pipelineList,
      };
      const resUpdateStatus = await EditStatusPipeline(payload, newId);
      if (resUpdateStatus?.status === 200) {
        GetPipelines();
      }
    }
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
            {item?.pipeline}
          </Typography>
        </div>
        <div style={{ display: "flex" }}>
          <MuiModels
            item={item}
            show="editMainPipeline"
            button="create"
            iconSize="1.2rem"
            GetPipelines={GetPipelines}
          />
          <IconButton onClick={handleDuplicatePipeline}>
            <Difference sx={{ fontSize: "1.2rem" }} />
          </IconButton>

          <Prompt
            heading="Delte Pipeline"
            text={`Are you sure you want to Delete ${item?.pipeline}?`}
            handleDelete={handleDelete}
            item={item?.id}
            disabled={item?.status?.length !== 0}
          />
        </div>
      </Grid>
      <Grid
        container
        item
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mb: "10px",
        }}
      >
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
            width: extraSmallScreen ? "50%" : "67%",
            fontFamily: "Nunito",
          }}
          value={inputChange}
          onChange={handleInputChange}
        />
        <Dropdown
          height="2.5rem"
          menuWidth="10%"
          menuItems={menuItems}
          placeholder="Type"
          backgroundColor={Colors.BG_LIGHT_GRAY}
          hoverColor={Colors.BG_LIGHT_GRAY}
          width={extraSmallScreen ? "22%" : "15%"}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
        <TextButton
          buttonText={smallScreen ? <Add /> : "Add Status"}
          height="2.5rem"
          width={extraSmallScreen ? "22%" : "15%"}
          onClick={handleAddStatus}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          startIcon={loading ? "" : smallScreen ? "" : <Add />}
          loading={loading}
          disabled={isButtonDisabled}
        />
      </Grid>
      <Grid>
        <DndProvider backend={HTML5Backend}>
          {(item?.status === undefined ||
            item?.status === null ||
            item?.status.length === 0) && (
            <p
              style={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
                textAlign: "center",
              }}
            >
              No Pipeline Status Exist...
            </p>
          )}
          {item?.status.length !== 0 && (
            <table style={{ width: "100%" }}>
              <thead>
                <tr
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "Nunito",
                    fontWeight: "700",
                    fontSize: FONT_SIZE_LARGE,
                  }}
                >
                  <th
                    style={{
                      textAlign: "left",
                      width: "20%",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      width: "65%",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      width: "15%",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <Grid
                  sx={{
                    height: item?.status.length > 6 ? "40vh" : "auto",
                    overflowY: item?.status.length > 6 ? "scroll" : "",
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
                      GetPipelines={GetPipelines}
                      pipelineId={pipelineId}
                    />
                  ))}
                </Grid>
              </tbody>
            </table>
          )}
        </DndProvider>
      </Grid>
    </Grid>
  );
}
