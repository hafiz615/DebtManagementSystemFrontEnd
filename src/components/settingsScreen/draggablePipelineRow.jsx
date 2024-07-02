import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import { Typography } from "@mui/material";

import { Colors } from "../../config/default";
import MuiModels from "../models";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";
import { DeleteStatusesPipeline } from "../../services/services";
import Prompt from "../prompt";
import { useToast } from "../../toast/toastContext";

export default function DraggablePipelineRow({
  pipelineList,
  moveRow,
  item,
  id,
  index,
  GetPipelines,
  pipelineId,
}) {
  const ref = useRef(null);
  const { showToast } = useToast();
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

  const handleDelete = async () => {
    const params = {
      original: { name: item?.name, type: item?.type },
      update: { name: item?.name, type: item?.type },
    };
    const deleteStatusResponse = await DeleteStatusesPipeline(
      params,
      pipelineId
    );
    if (deleteStatusResponse?.status === 200) {
      showToast(deleteStatusResponse?.data?.message, "success");
      GetPipelines();
    } else {
      const errorMessage = deleteStatusResponse?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  return (
    <tr
      ref={ref}
      style={{
        opacity,
        display: "flex",
        justifyContent: "space-between",
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
      <td style={{ textAlign: "left", fontFamily: "Nunito", width: "19%" }}>
        {item?.name}
      </td>
      <td style={{ width: "65%" }}>
        <Typography
          sx={{
            border: `2px solid ${
              item?.type === "Lost" ? Colors.ORANGE_COLOR : Colors.SKY_BLUE
            }`,
            width: "4rem",
            textAlign: "center",
            textTransform: "none",
            fontFamily: "Nunito",
            borderRadius: "5px",
            color:
              item?.type === "Lost" ? Colors.ORANGE_COLOR : Colors.SKY_BLUE,
            fontSize: FONT_SIZE_LARGE,
          }}
        >
          {item?.type}
        </Typography>
      </td>
      <td
        style={{
          display: "flex",
          textAlign: "left",
          width: "15%",
        }}
      >
        <MuiModels
          item={item}
          GetPipelines={GetPipelines}
          pipelineId={pipelineId}
          show="editPipeline"
          button="create"
          iconSize="1.2rem"
        />
        <Prompt
          heading="Delte Pipeline"
          text={`Are you sure you want to Delete ${item?.name}?`}
          handleDelete={handleDelete}
          item={item?.id}
        />
      </td>
    </tr>
  );
}
