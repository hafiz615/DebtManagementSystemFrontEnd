import React, { useState } from "react";
import { Grid } from "@mui/material";
import { Colors } from "../../config/default";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardColumns from "./boardColumns";
import ScrollbarStyles from "../customScroll";

export default function PipelinesBoards() {
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

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid
        container
        sx={{
          height: "68vh",
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          overflowX: "auto",
          ...ScrollbarStyles,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {Object.keys(columns)?.map((columnId) => (
          <BoardColumns
            key={columnId}
            columnId={columnId}
            items={columns[columnId]}
            moveItem={moveItem}
          />
        ))}
      </Grid>
    </DndProvider>
  );
}
