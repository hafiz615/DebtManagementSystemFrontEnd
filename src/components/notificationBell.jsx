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
  Tooltip,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  Checkbox,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InfoIcon from "@mui/icons-material/Info";
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
  GetCreditorsFromDebtorId,
  MarkAsReadNotifications,
  saveCaseDetailNotification,
} from "../services/services";
import { useToast } from "../toast/toastContext";
import TextButton from "./button";

const NotificationsBell = ({ notificationsLength, setNotificationLength }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [creditors, setCreditors] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [saveNotificationLoading, setSaveNotificationLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [notificationId, setNotificationId] = useState("");
  const [inboxId, setInboxId] = useState("");
  const navigate = useNavigate();
  const BASE_URL = baseUrl();
  const { showToast } = useToast();
  const updatedBaseUrl = BASE_URL?.replace(/\/api$/, "");

  const handleCheckboxChange = (index) => {
    setSelected(index);
  };

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

  const getDebtorCases = async (debtorId) => {
    setOpenDialog(true);
    const res = await GetCreditorsFromDebtorId(debtorId);
    if (res?.status == 200) {
      setCreditors(res?.data?.data);
    }
  };

  const saveCaseNotification = async () => {
    setSaveNotificationLoading(true);
    const payload = {
      caseId: selected,
      notificationId: notificationId,
      inboxId: inboxId,
    };
    const res = await saveCaseDetailNotification(payload);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      setOpenDialog(false);
      setLoading(true);
      const payload = {
        type: value === 0 ? "EMAIL" : "SMS",
      };
      const resNotification = await GetAllNotifications(payload);
      if (resNotification?.status === 200) {
        setNotificationLength(0);
        setNotifications(resNotification?.data?.data);
      }
      setLoading(false);
    }
    setSaveNotificationLoading(true);
  };

  const handleNotificationClick = async (caseId, id, inboxId, debtorId) => {
    if (debtorId && !caseId) {
      getDebtorCases(debtorId);
      setNotificationId(id);
      setInboxId(inboxId);
    } else if (!caseId && !debtorId) {
      await MarkAsReadNotifications(id);
    } else {
      await MarkAsReadNotifications(id);
      localStorage.setItem("route", "all-cases");
      navigate(`/all-cases/${caseId}`);
    }
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
                    flexDirection: "column",
                  }}
                  onClick={() =>
                    handleNotificationClick(
                      notification?.caseId,
                      notification?._id,
                      notification?.inboxId,
                      notification?.debtorId
                    )
                  }
                  key={index}
                  divider
                >
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
                    >
                      {notification?.text}
                    </Typography>
                    <div style={{ display: "flex", gap: "3px" }}>
                      {notification?.debtorId && !notification?.caseId && (
                        <Tooltip
                          title="Link SMS with its respective case"
                          placement="top"
                        >
                          <InfoIcon sx={{ color: Colors.YELLOW }} />
                        </Tooltip>
                      )}
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
        <Dialog
          sx={{
            "& .MuiDialog-paper": {
              padding: "10px",
              borderRadius: "10px",
              height: "50vh",
              maxWidth: "40vw",
              minWidth: "40vw",
              overflowY: "auto",
              ...ScrollbarStyles,
            },
          }}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        >
          <DialogTitle
            sx={{
              fontFamily: "Nunito",
              fontSize: FONT_SIZE_LARGE,
              fontWeight: "600",
            }}
          >
            Save Sms in the respective case
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
                fontWeight: "600",
                mt: "10px",
              }}
            >
              {Object.keys(creditors)[0]}
            </Typography>
          </DialogTitle>

          <DialogContent>
            {creditors[Object.keys(creditors)[0]]?.map((item, index) => (
              <Box key={index} display="flex" alignItems="center">
                <Checkbox
                  checked={selected === item?.caseId}
                  onChange={() => handleCheckboxChange(item?.caseId)}
                  size="small"
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: "22px" },
                    color: Colors.DIM_LIGHT_GRAY,
                    "&.Mui-checked": {
                      color: Colors.SKY_BLUE,
                    },
                  }}
                />
                <Typography
                  sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
                >
                  {item?.creditorCompanyName}
                </Typography>
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <TextButton
              buttonText="Cancel"
              height="2rem"
              width="8rem"
              onClick={() => setOpenDialog(false)}
              backgroundColor={Colors.ORANGE_COLOR}
              hoverColor={Colors.ORANGE_COLOR}
            />
            <TextButton
              buttonText="Save"
              height="2rem"
              width="8rem"
              disabled={!selected}
              loading={saveNotificationLoading}
              onClick={saveCaseNotification}
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
            />
          </DialogActions>
        </Dialog>
      </Popover>
    </div>
  );
};

export default NotificationsBell;
