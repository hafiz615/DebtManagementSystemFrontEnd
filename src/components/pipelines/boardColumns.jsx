import React from "react";
import { useDrop } from "react-dnd";
import DraggableItem from "./draggableItem";
import { Grid, Typography } from "@mui/material";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";
import { Colors } from "../../config/default";
import ScrollbarStyles from "../customScroll";

const BoardColumns = ({ columnId, items, moveItem }) => {
  const [, drop] = useDrop({
    accept: "ITEM",
    drop: (item) => {
      if (item.columnId !== columnId) {
        moveItem(item.id, item.columnId, columnId);
        item.columnId = columnId;
      }
    },
  });

  return (
    <Grid xs={3} item ref={drop} sx={{ padding: "10px" }}>
      <Typography
        sx={{
          fontSize: FONT_SIZE_LARGE,
          fontFamily: "Nunito",
          fontWeight: "700",
          marginBottom: "10px",
        }}
      >
        {columnId}
      </Typography>
      <Typography
        sx={{
          fontSize: FONT_SIZE_LARGE,
          fontFamily: "Nunito",
          marginBottom: "10px",
        }}
      >
        {items?.length} Opportunities
      </Typography>
      <div
        style={{
          width: "100%",
          backgroundColor: Colors.SKY_BLUE,
          marginBottom: "10px",
          padding: "8px",
          display: "flex",
          borderRadius: "10px",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: FONT_SIZE_LARGE,
            fontFamily: "Nunito",
            color: Colors.WHITE,
          }}
        >
          Annualized Value
        </Typography>
        <Typography
          sx={{
            fontSize: FONT_SIZE_LARGE,
            fontFamily: "Nunito",
            color: Colors.WHITE,
          }}
        >
          ${items?.length}
        </Typography>
      </div>

      <Grid
        sx={{
          height: "50vh",
          width: "100%",
          backgroundColor: Colors.BG_LIGHT_GRAY,
          borderRadius: "10px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#E5E5E5",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: Colors.WHITE,
            borderRadius: "8px",
          },
        }}
      >
        {items.map((item) => (
          <DraggableItem key={item.id} item={item} columnId={columnId} />
        ))}
      </Grid>
    </Grid>
  );
};

export default BoardColumns;
