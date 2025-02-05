import React, { useState, useEffect } from "react";
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  Typography,
  CircularProgress,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { io } from "socket.io-client";
import { Colors } from "../config/default";
import ScrollbarStyles from "./customScroll";
import { useNavigate } from "react-router-dom";
import {
  baseUrl,
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_SMALL,
} from "../constants/appConstants";
import {
  GetAllNotifications,
  MarkAsReadNotifications,
} from "../services/services";
import { useToast } from "../toast/toastContext";

const NotificationsBell = ({ notificationsLength, setNotificationLength }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const BASE_URL = baseUrl();
  const { showToast } = useToast();
  const updatedBaseUrl = BASE_URL?.replace(/\/api$/, "");

  const handleChange = async (event, newValue) => {
    setValue(newValue);
    setLoading(true);
    const payload = {
      type: newValue === 0 ? "EMAIL" : "SMS",
    };
    const res = await GetAllNotifications(payload);
    if (res?.status === 200) {
      setNotificationLength(0);
      setNotifications(res?.data?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const socketInstance = io(updatedBaseUrl);
    setSocket(socketInstance);

    socketInstance.on("notify", (arg) => {
      setNotificationLength(arg?.notificationCount);
      showToast(arg?.notification?.text, "success");
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  const handleOpen = async (event) => {
    setLoading(true);
    setAnchorEl(event.currentTarget);
    const payload = {
      type: value === 0 ? "EMAIL" : "SMS",
    };
    const res = await GetAllNotifications(payload);
    if (res?.status === 200) {
      setNotificationLength(0);
      setNotifications(res?.data?.data);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (caseId, id) => {
    const response = await MarkAsReadNotifications(id);
    localStorage.setItem("route", "all-cases");
    navigate(`/all-cases/${caseId}`);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <div>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={notificationsLength} color="error">
          <NotificationsIcon />
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
          Notifications
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
              label="Email"
            />
            <Tab
              sx={{
                textTransform: "none",
                fontSize: FONT_SIZE_MEDIUM,
                color: Colors.SKY_BLUE,
                "&.Mui-selected": { color: Colors.SKY_BLUE },
              }}
              label="SMS"
            />
          </Tabs>
        </Box>

        {loading ? (
          <List
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 300,
              height: 300,
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
              width: 300,
              maxHeight: 300,
              overflow: "auto",
              backgroundColor: Colors.BG_LIGHT_GRAY,
              ...ScrollbarStyles,
            }}
          >
            {notifications?.length > 0 ? (
              notifications?.map((notification, index) => (
                <ListItem
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                  onClick={() =>
                    notification?.caseId
                      ? handleNotificationClick(
                          notification?.caseId,
                          notification?._id
                        )
                      : undefined
                  }
                  key={index}
                  divider
                >
                  <div style={{ width: "100%" }}>
                    <Typography
                      sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
                    >
                      {notification?.text}
                    </Typography>
                    {!notification?.isRead && (
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_SMALL,
                          color: "red",
                          mt: "5px",
                          fontWeight: "600",
                          textAlign: "right",
                        }}
                      >
                        New
                      </Typography>
                    )}
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
                  No notifications
                </Typography>
              </ListItem>
            )}
          </List>
        )}
      </Popover>
    </div>
  );
};

export default NotificationsBell;
