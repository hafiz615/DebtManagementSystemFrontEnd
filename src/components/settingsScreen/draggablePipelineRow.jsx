import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import { Typography } from "@mui/material";

import { Colors } from "../../config/default";
import MuiModels from "../models";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";

export default function DraggablePipelineRow({
  pipelineList,
  moveRow,
  item,
  id,
  index,
}) {
  const ref = useRef(null);

  const ItemType = "ROW";

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;
  drag(drop(ref));
  return (
    <tr
      ref={ref}
      style={{
        opacity,
        display: "flex",
        alignItems: "center",
        color: Colors.DARK_GRAY,
        backgroundColor: Colors.BG_LIGHT_GRAY,
        fontWeight: "500",
        fontSize: "14px",
        width: "100%",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        marginBottom: "0.3rem",
        borderRadius: "5px",
      }}
    >
      <td style={{ width: "28%", textAlign: "left", fontFamily: "Nunito" }}>
        {item?.name}
      </td>
      <td style={{ width: "68%" }}>
        <Typography
          sx={{
            border: `2px solid ${
              item?.status === "Lost" ? Colors.ORANGE_COLOR : Colors.SKY_BLUE
            }`,
            width: "4rem",
            textAlign: "center",
            textTransform: "none",
            fontFamily: "Nunito",
            borderRadius: "5px",
            color:
              item?.status === "Lost" ? Colors.ORANGE_COLOR : Colors.SKY_BLUE,
            fontSize: FONT_SIZE_LARGE,
          }}
        >
          {item?.status}
        </Typography>
      </td>
      <td style={{ display: "flex", width: "8%", textAlign: "left" }}>
        <MuiModels data={item} show="editPipeline" button="create" />
        <MuiModels
          data={item}
          pipelineList={pipelineList}
          show="deletePipeline"
          button="delete"
        />
      </td>
    </tr>
  );
}
