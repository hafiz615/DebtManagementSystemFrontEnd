import React, { useState } from "react";
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  Typography,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Colors } from "../config/default";
import ScrollbarStyles from "./customScroll";
import { useNavigate } from "react-router-dom";
import { FONT_SIZE_LARGE, FONT_SIZE_MEDIUM } from "../constants/appConstants";
import { GetMissedCalls } from "../services/services";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import { formatDateString, truncateText } from "../common";

const MissedCalls = ({ missedCallCount, setMissedCallCount }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [missedCallList, setMissedCallsList] = useState();
  const navigate = useNavigate();

  const handleOpen = async (event) => {
    setMissedCallCount(0);
    setLoading(true);
    setAnchorEl(event.currentTarget);
    const res = await GetMissedCalls();
    if (res?.status === 200) {
      setMissedCallsList(res?.data?.data);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRowClick = async (caseId) => {
    localStorage.setItem("route", "all-cases");
    navigate(`/all-cases/${caseId}`);
  };
  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <Badge badgeContent={missedCallCount} color="error">
          <PhoneMissedIcon sx={{ color: Colors.WHITE }} />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: "600",
            p: "10px 0px",
            backgroundColor: Colors.BG_LIGHT_GRAY,
          }}
        >
          Call Notification
        </Typography>

        {loading ? (
          <List
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 350,
              height: 350,
              overflow: "auto",
              backgroundColor: Colors.BG_LIGHT_GRAY,
              ...ScrollbarStyles,
            }}
          >
            <CircularProgress sx={{ color: Colors.SKY_BLUE }} />
          </List>
        ) : (
          <List
            sx={{
              width: 350,
              maxHeight: 350,
              overflow: "auto",
              backgroundColor: Colors.BG_LIGHT_GRAY,
              ...ScrollbarStyles,
            }}
          >
            {missedCallList ? (
              missedCallList?.map((missedCalls, index) => (
                <ListItem
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                  onClick={() =>
                    missedCalls?.caseId
                      ? handleRowClick(missedCalls?.caseId)
                      : undefined
                  }
                  key={index}
                  divider
                >
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: ".5rem",
                    }}
                  >
                    <PhoneMissedIcon
                      sx={{
                        color: Colors.ORANGE_COLOR,
                        fontSize: "16px",
                        mr: "10px",
                      }}
                    />

                    <Typography
                      sx={{
                        fontFamily: "Nunito",
                        fontSize: FONT_SIZE_MEDIUM,
                        fontWeight: "600",
                      }}
                    >
                      {new Date(
                        missedCalls?.callId?.callStartTime
                      ).toLocaleString("en-US", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Typography>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_LARGE,
                          fontWeight: "600",
                        }}
                      >
                        <Tooltip title={"Call From"} placement="top-end">
                          {truncateText(missedCalls?.callId?.calleeName, 15) ||
                            "--"}
                        </Tooltip>
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_LARGE,
                        }}
                      >
                        <Tooltip title={"Call From"} placement="top-end">
                          {missedCalls?.callId?.callFrom}
                        </Tooltip>
                      </Typography>
                    </div>
                    <div>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_LARGE,
                          fontWeight: "600",
                          textAlign: "right",
                        }}
                      >
                        <Tooltip title={"Call To"} placement="top-end">
                          {truncateText(missedCalls?.callId?.callerName, 15) ||
                            "--"}
                        </Tooltip>
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_LARGE,
                        }}
                      >
                        <Tooltip title={"Call To"} placement="top-end">
                          {missedCalls?.callId?.callTo[0]}
                        </Tooltip>
                      </Typography>
                    </div>
                  </div>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  No Missed Calls
                </Typography>
              </ListItem>
            )}
          </List>
        )}
      </Popover>
    </div>
  );
};

export default MissedCalls;
