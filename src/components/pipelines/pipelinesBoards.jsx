import React, { useRef, useState } from "react";
import { Grid, useMediaQuery } from "@mui/material";
import { Colors } from "../../config/default";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardColumns from "./boardColumns";
import { useSelector } from "react-redux";

export default function PipelinesBoards() {
  const columnRef = useRef(null);
  const mobileView = useMediaQuery("(min-width:300px) and (max-width:760px)");
  const drawerOpen = useSelector((state) => state.drawer.open);

  const [columns, setColumns] = useState({
    ActiveNegotiations: [
      { id: "1", text: "Task 1" },
      { id: "2", text: "Task 2" },
    ],
    Productions: [
      { id: "3", text: "Task 3" },
      { id: "4", text: "Task 4" },
    ],
    Basics: [
      { id: "5", text: "Task 5" },
      { id: "6", text: "Task 6" },
    ],
    Vendor: [
      { id: "7", text: "Task 7" },
      { id: "8", text: "Task 8" },
    ],
    Matrix: [
      { id: "9", text: "Task 9" },
      { id: "10", text: "Task 10" },
    ],
    Matrix1: [
      { id: "11", text: "Task 11" },
      { id: "12", text: "Task 12" },
    ],
    Matrix2: [
      { id: "13", text: "Task 13" },
      { id: "14", text: "Task 14" },
    ],
  });

  const moveItem = (itemId, fromColumn, toColumn) => {
    const item = columns[fromColumn].find((i) => i.id === itemId);
    const updatedFromColumn = columns[fromColumn].filter(
      (i) => i.id !== itemId
    );
    const updatedToColumn = [...columns[toColumn], item];

    setColumns({
      ...columns,
      [fromColumn]: updatedFromColumn,
      [toColumn]: updatedToColumn,
    });
  };

  const widthStyling = drawerOpen
    ? "calc(100vw - 250px - 4rem)"
    : "calc(100vw - 70px - 4rem)";

  const wrapStyling = mobileView ? "wrap" : "nowrap";

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid
        ref={columnRef}
        sx={{
          height: "68vh",
          mt: "10px",
          width: widthStyling,
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          overflowX: "auto",
          display: "flex",
          flexWrap: wrapStyling,
          "&::-webkit-scrollbar": {
            width: "0px",
            height: "7px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: Colors.SKY_BLUE,
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: Colors.WHITE,
            borderRadius: "8px",
          },
        }}
      >
        {Object.keys(columns).map((columnId) => (
          <BoardColumns
            key={columnId}
            columnId={columnId}
            items={columns[columnId]}
            moveItem={moveItem}
            columnRef={columnRef}
          />
        ))}
      </Grid>
    </DndProvider>
  );
}
