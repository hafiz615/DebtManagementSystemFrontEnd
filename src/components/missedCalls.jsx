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
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { Colors } from "../config/default";
import ScrollbarStyles from "./customScroll";
import { useNavigate } from "react-router-dom";
import { FONT_SIZE_LARGE, FONT_SIZE_MEDIUM } from "../constants/appConstants";
import { GetMissedCalls } from "../services/services";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import { formatDateString, truncateText } from "../common";
import { PhoneDisabled } from "@mui/icons-material";

const MissedCalls = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [missedCallList, setMissedCallsList] = useState();
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleOpen = async (event) => {
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

  const handleChange = async (event, newValue) => {
    setValue(newValue);
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
        <PhoneMissedIcon sx={{ color: Colors.WHITE }} />
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
        <Box sx={{ width: "100%", backgroundColor: Colors.BG_LIGHT_GRAY }}>
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            sx={{
              "& .MuiTabs-indicator": { backgroundColor: Colors.SKY_BLUE },
            }}
          >
            <Tab
              sx={{
                textTransform: "none",
                fontSize: FONT_SIZE_MEDIUM,
                color: Colors.SKY_BLUE,
                "&.Mui-selected": { color: Colors.SKY_BLUE },
              }}
              label="Missed"
            />
            <Tab
              sx={{
                textTransform: "none",
                fontSize: FONT_SIZE_MEDIUM,
                color: Colors.SKY_BLUE,
                "&.Mui-selected": { color: Colors.SKY_BLUE },
              }}
              label="Rejected"
            />
          </Tabs>
        </Box>

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
              missedCallList?.[value === 0 ? "noAnswer" : "busy"]?.map(
                (missedCalls, index) => (
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
                          fontSize: FONT_SIZE_LARGE,
                          fontWeight: "600",
                        }}
                      >
                        {formatDateString(missedCalls?.time)}
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
                          }}
                        >
                          <Tooltip title={"Call From"} placement="top-end">
                            {missedCalls?.from}
                          </Tooltip>
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Nunito",
                            fontSize: FONT_SIZE_LARGE,
                            fontWeight: "600",
                          }}
                        >
                          <Tooltip
                            title={missedCalls?.companyName || ""}
                            placement="top-end"
                          >
                            {truncateText(missedCalls?.companyName, 15) || "--"}
                          </Tooltip>
                        </Typography>
                      </div>
                      <div>
                        <Typography
                          sx={{
                            fontFamily: "Nunito",
                            fontSize: FONT_SIZE_LARGE,
                          }}
                        >
                          <Tooltip title={"Call To"} placement="top-end">
                            {missedCalls?.recepientNumber}
                          </Tooltip>
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Nunito",
                            fontSize: FONT_SIZE_LARGE,
                            fontWeight: "600",
                          }}
                        >
                          <Tooltip
                            title={missedCalls?.recepientName || ""}
                            placement="top-end"
                          >
                            {truncateText(missedCalls?.recepientName, 15) ||
                              "--"}
                          </Tooltip>
                        </Typography>
                      </div>
                    </div>
                  </ListItem>
                )
              )
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
