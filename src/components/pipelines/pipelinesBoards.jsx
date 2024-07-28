import React, { useEffect, useRef, useState } from "react";
import { CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { Colors } from "../../config/default";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardColumns from "./boardColumns";
import { useSelector } from "react-redux";
import { UpdateCase } from "../../services/services";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";

export default function PipelinesBoards({
  data,
  loading,
  GetAllPipelineDetail,
  searchText,
  statuses,
  users,
  leads,
  startDate,
  endDate,
  allPipelinesName,
}) {
  const columnRef = useRef(null);
  const mobileView = useMediaQuery("(min-width:300px) and (max-width:760px)");
  const drawerOpen = useSelector((state) => state.drawer.open);
  const [columns, setColumns] = useState({});
  const filteredColumns =
    columns && statuses?.length > 0
      ? Object.keys(columns).filter((key) => statuses.includes(key))
      : columns && Object.keys(columns);

  useEffect(() => {
    setColumns(data);
  }, [data]);

  const moveItem = (itemId, fromColumn, toColumn) => {
    const item = columns[fromColumn].cases.find((i) => i._id === itemId);
    const updatedFromColumn = columns[fromColumn].cases.filter(
      (i) => i._id !== itemId
    );
    const updatedToColumn = [
      ...columns[toColumn].cases,
      { ...item, status: toColumn },
    ];

    setColumns({
      ...columns,
      [fromColumn]: { ...columns[fromColumn], cases: updatedFromColumn },
      [toColumn]: { ...columns[toColumn], cases: updatedToColumn },
    });
    dragAndDropCall(toColumn, itemId);
  };

  const dragAndDropCall = async (toColumn, itemId) => {
    const params = {
      status: toColumn,
    };
    const editCaseResponse = await UpdateCase(params, itemId);
    if (editCaseResponse?.status === 200) {
      GetAllPipelineDetail(false);
    }
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
        {loading ? (
          <Grid
            xs={12}
            container
            sx={{
              height: "inherit",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Grid>
        ) : !columns || !allPipelinesName ? (
          <p
            style={{
              fontFamily: "Nunito",
              fontSize: FONT_SIZE_LARGE,
              width: "100%",
              height: "80%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            No Pipeline Data
          </p>
        ) : (
          filteredColumns?.map((columnId) => (
            <BoardColumns
              key={columnId}
              columnId={columnId}
              items={columns[columnId]}
              moveItem={moveItem}
              columnRef={columnRef}
              GetAllPipelineDetail={GetAllPipelineDetail}
              searchText={searchText}
              users={users}
              leads={leads}
              startDate={startDate}
              endDate={endDate}
            />
          ))
        )}
      </Grid>
    </DndProvider>
  );
}
