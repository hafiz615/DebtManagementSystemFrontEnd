import React from "react";
import { useDrag } from "react-dnd";

import { IconButton, Typography } from "@mui/material";
import { Difference } from "@mui/icons-material";

import { Colors } from "../../config/default";
import MuiModels from "../models";
import Prompt from "../prompt";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";

const DraggableItem = ({ item, columnId }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ITEM",
    item: { ...item, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;
  return (
    <div
      ref={drag}
      style={{
        opacity,
        backgroundColor: isDragging ? Colors.LIGHT_BLUE_COLOR : Colors.WHITE,
        margin: "10px",
        padding: "10px",
        borderRadius: "10px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: FONT_SIZE_LARGE,
            fontFamily: "Nunito",
            fontWeight: "700",
          }}
        >
          {item.text}
        </Typography>
        <div style={{ display: "flex" }}>
          <MuiModels
            item={item}
            show="editPipelineCase"
            button="create"
            iconSize="1rem"
            // GetPipelines={GetPipelines}
          />
          <Prompt
            heading="Delte Pipeline"
            text={`Are you sure you want to Delete ${item?.text}?`}
            // handleDelete={handleDelete}
            item={item?.id}
            iconSize="1rem"
          />
          <IconButton>
            <Difference sx={{ fontSize: "1rem" }} />
          </IconButton>
        </div>
      </div>
      <div>
        <Typography
          sx={{ fontSize: FONT_SIZE_LARGE, fontFamily: "Nunito", mb: "5px" }}
        >
          $80,000
        </Typography>
      </div>
      <div>
        <Typography
          sx={{
            fontSize: FONT_SIZE_LARGE,
            fontFamily: "Nunito",
            color: Colors.DIM_LIGHT_GRAY,
          }}
        >
          50%
        </Typography>
      </div>
    </div>
  );
};

export default DraggableItem;
