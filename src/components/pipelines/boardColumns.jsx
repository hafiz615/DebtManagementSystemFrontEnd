import React, { useEffect } from "react";
import { useDrop } from "react-dnd";
import DraggableItem from "./draggableItem";
import { Grid, Typography } from "@mui/material";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";
import { Colors } from "../../config/default";
import useMediaQuery from "@mui/material/useMediaQuery";

const BoardColumns = ({ columnId, items, moveItem, columnRef }) => {
  const smallScreen = useMediaQuery(
    "(min-width:1000px) and (max-width:1200px)"
  );
  const extraSmallScreen = useMediaQuery(
    "(min-width:760px) and (max-width:1000px)"
  );
  const mobileView = useMediaQuery("(min-width:300px) and (max-width:760px)");

  const SCROLL_SPEED = 7;
  const SCROLL_THRESHOLD = 10;

  const [, drop] = useDrop({
    accept: "ITEM",
    drop: (item) => {
      if (item.columnId !== columnId) {
        moveItem(item.id, item.columnId, columnId);
        item.columnId = columnId;
      }
    },
  });

  useEffect(() => {
    const handleDrag = (e) => {
      const { clientX } = e;
      const { left, right } = columnRef.current.getBoundingClientRect();
      const scrollLeft = columnRef.current.scrollLeft;

      if (clientX - left < SCROLL_THRESHOLD) {
        columnRef.current.scrollLeft = scrollLeft - SCROLL_SPEED;
      } else if (right - clientX < SCROLL_THRESHOLD) {
        columnRef.current.scrollLeft = scrollLeft + SCROLL_SPEED;
      }
    };
    window.addEventListener("dragover", handleDrag);
    return () => {
      window.removeEventListener("dragover", handleDrag);
    };
  }, []);

  const widthStyling = mobileView
    ? "100%"
    : extraSmallScreen
    ? "50%"
    : smallScreen
    ? "33%"
    : "25%";

  return (
    <Grid
      item
      ref={drop}
      sx={{
        padding: "10px",
        minWidth: widthStyling,
      }}
    >
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
