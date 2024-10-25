import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import DraggableItem from "./draggableItem";
import { Grid, Tooltip, Typography } from "@mui/material";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";
import { Colors } from "../../config/default";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dropdown from "../dropdown";
import { formatAmountValue } from "../../common";

const BoardColumns = ({
  columnId,
  items,
  moveItem,
  columnRef,
  GetAllPipelineDetail,
  searchText,
  users,
  leads,
  startDate,
  endDate,
}) => {
  const [order, setOrder] = useState("asc");
  const orders = [
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "des" },
  ];

  const filteredCaseCodes = items?.cases?.filter((caseItem) =>
    caseItem?.caseCode?.toLowerCase()?.includes(searchText?.toLowerCase())
  );

  const filteredCasesByUsers = filteredCaseCodes?.filter((caseItem) => {
    if (users.length === 0) {
      return true;
    }
    if (users.includes("All Users")) {
      return true;
    }
    return users.some((user) =>
      caseItem?.caseOwner.toLowerCase()?.includes(user?.toLowerCase())
    );
  });

  const filteredCasesByLeads = filteredCasesByUsers.filter((caseItem) => {
    if (leads.length === 0) {
      return true;
    }
    if (leads.includes("All Leads")) {
      return true;
    }
    return leads.some((lead) =>
      caseItem?.debtor?.basicInformation?.fullName
        ?.toLowerCase()
        ?.includes(lead?.toLowerCase())
    );
  });

  const filteredCasesByDate = filteredCasesByLeads?.filter((caseItem) => {
    if (!startDate && !endDate) {
      return true;
    }
    const updatedAt = new Date(caseItem?.updatedAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      return updatedAt >= start && updatedAt <= end;
    } else if (start) {
      return updatedAt >= start;
    } else if (end) {
      return updatedAt <= end;
    }
    return true;
  });

  const sortedCases = [...filteredCasesByDate].sort((a, b) => {
    if (order === "asc") {
      return a?.debtor?.businessInformation?.companyName.toLowerCase() >
        b?.debtor?.businessInformation?.companyName.toLowerCase()
        ? 1
        : -1;
    } else if (order === "des") {
      return a?.debtor?.businessInformation?.companyName.toLowerCase() <
        b?.debtor?.businessInformation?.companyName.toLowerCase()
        ? 1
        : -1;
    }
    return 0;
  });

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
        moveItem(item._id, item.columnId, columnId);
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

  const remainingPerColumn = sortedCases?.reduce((acc, item) => {
    return acc + (item?.remaining || 0);
  }, 0);
  return (
    <Grid
      item
      ref={drop}
      sx={{
        padding: "10px",
        minWidth: widthStyling,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
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
            {sortedCases?.length} Opportunities
          </Typography>
        </div>
        <Tooltip title="Sort By Debtor Business" placement="top-start">
          <div>
            <Dropdown
              width="1rem"
              menuItems={orders}
              selectedValue={order}
              setSelectedValue={setOrder}
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
            />
          </div>
        </Tooltip>
      </div>
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
          ${formatAmountValue(remainingPerColumn)}
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
        {sortedCases?.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: FONT_SIZE_LARGE,
            }}
          >
            No Cases
          </p>
        ) : (
          sortedCases?.map((item) => (
            <DraggableItem
              key={item._id}
              item={item}
              columnId={columnId}
              GetAllPipelineDetail={GetAllPipelineDetail}
            />
          ))
        )}
      </Grid>
    </Grid>
  );
};

export default BoardColumns;
