import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import { Colors } from "../../config/default";
import MuiModels from "../models";
import useMediaQuery from "@mui/material/useMediaQuery";

const ItemType = "ROW";

const DraggableRow = ({
  id,
  text,
  index,
  moveRow,
  arrayStatus,
  statusId,
  GetStatuses,
}) => {
  const ref = useRef(null);
  const extraSmallScreen = useMediaQuery(
    "(min-width:300px) and (max-width:500px)"
  );

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
      <td className="dataTable" style={{ width: "85%" }}>
        {text}
      </td>
      <td
        className="dataTable"
        style={{ display: "flex", width: extraSmallScreen ? "35%" : "14.5%" }}
      >
        <MuiModels
          show="editStatus"
          text={text}
          statusId={statusId}
          GetStatuses={GetStatuses}
        />
        {arrayStatus?.length > 1 && (
          <MuiModels
            show="deleteStatus"
            arrayStatus={arrayStatus}
            text={text}
            statusId={statusId}
            GetStatuses={GetStatuses}
          />
        )}
      </td>
    </tr>
  );
};

export default DraggableRow;
