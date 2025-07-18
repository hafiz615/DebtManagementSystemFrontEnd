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
  TextField,
  InputAdornment,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
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
  GetAllUserCases,
  GetCreditorsFromDebtorId,
  GetNotificationsCount,
  MarkAsReadNotifications,
  saveCaseDetailNotification,
} from "../services/services";
import { useToast } from "../toast/toastContext";
import TextButton from "./button";
import { useDispatch, useSelector } from "react-redux";
import { setCounts } from "../redux/action/action";
import { Visibility } from "@mui/icons-material";
import emailSound from "../../src/assets/emailNotification.mp3";
import smsSound from "../../src/assets/smsNotification.mp3";
import taskSound from "../../src/assets/task.mp3";

const NotificationsBell = ({
  notificationsLength,
  setNotificationLength,
  setMissedCallCount,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [allCases, setAllCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [caseId, setCaseId] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [saveNotificationLoading, setSaveNotificationLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedCase, setSelectedCase] = useState();
  const [notificationId, setNotificationId] = useState("");
  const [inboxId, setInboxId] = useState("");
  const navigate = useNavigate();
  const BASE_URL = baseUrl();
  const { showToast } = useToast();
  const updatedBaseUrl = BASE_URL?.replace(/\/api$/, "");
  const user = useSelector((state) => state?.signIn?.signIn?.user);
  const dispatch = useDispatch();

  const handleCheckboxChange = (caseId) => {
    setSelected((prevSelected) =>
      prevSelected?.includes(caseId)
        ? prevSelected?.filter((id) => id !== caseId)
        : [...prevSelected, caseId]
    );
  };

  const handleCaseCheckboxChange = (debtor) => {
    setSelectedCase(debtor);
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setSearchTerm("");
    setCaseId("");
    setSmsMessage("");
  };

  const handleChange = async (event, newValue) => {
    setValue(newValue);
    setLoading(true);
    const payload = {
      type: newValue === 0 ? "EMAIL" : newValue === 1 ? "SMS" : "TASK",
    };
    const res = await GetAllNotifications(payload);
    if (res?.status === 200) {
      setNotificationLength(res?.data?.data?.notificationCount?.count);

      setNotifications(res?.data?.data);
    }
    setLoading(false);
  };

  const getNotificationsCount = async () => {
    const response = await GetNotificationsCount();
    if (response?.status === 200) {
      dispatch(
        setCounts(
          response?.data?.data?.smsCount,
          response?.data?.data?.emailCount
        )
      );
    }
  };

  useEffect(() => {
    const socketInstance = io(updatedBaseUrl);
    socketInstance.on("notify", (arg) => {
      if (arg?.notification?.userId === user?._id) {
        setNotificationLength(arg?.notificationCount);
        setMissedCallCount(arg?.missCallCount);
        showToast(arg?.notification?.text, "success");
        getNotificationsCount();

        const type = arg?.notification?.type || arg?.type;

        let soundToPlay = null;
        if (type === "EMAIL") {
          soundToPlay = new Audio(emailSound);
        } else if (type === "SMS") {
          soundToPlay = new Audio(smsSound);
        } else if (type === "TASK") {
          soundToPlay = new Audio(taskSound);
        }

        if (soundToPlay) {
          soundToPlay.currentTime = 0;
          soundToPlay
            .play()
            .catch((err) => console.warn(`Failed to play ${type} sound:`, err));
        }
      }
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
      type: value === 0 ? "EMAIL" : value === 1 ? "SMS" : "TASK",
    };
    const res = await GetAllNotifications(payload);
    if (res?.status === 200) {
      setNotificationLength(res?.data?.data?.notificationCount?.count);
      setNotifications(res?.data?.data);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchTerm("");
  };

  const getAllCases = async () => {
    setOpenDialog(true);
    const res = await GetAllUserCases();
    if (res?.status == 200) {
      setAllCases(res?.data?.data);
      setFilteredCases(res?.data?.data);
    }
  };

  const saveCaseNotification = async () => {
    setSaveNotificationLoading(true);
    const payload = {
      caseIds: selected,
      notificationId: notificationId,
      inboxId: inboxId,
    };
    const res = await saveCaseDetailNotification(payload);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      setCaseId("");
      setSmsMessage("");
      setOpenDialog(false);
      setLoading(true);
      const payload = {
        type: value === 0 ? "EMAIL" : "SMS",
      };
      const resNotification = await GetAllNotifications(payload);
      if (resNotification?.status === 200) {
        setNotifications(resNotification?.data?.data);
      }
      setLoading(false);
      setSearchTerm("");
    }
    setSaveNotificationLoading(false);
  };

  const handleNotificationClick = async (
    caseId,
    id,
    inboxId,
    debtorId,
    isLinked,
    message
  ) => {
    if (value !== 1 && caseId) {
      await MarkAsReadNotifications(id);
      localStorage.setItem("route", "all-cases");
      navigate(`/all-cases/${caseId}`);
      setAnchorEl(false);
    } else if (!caseId && isLinked) {
      await MarkAsReadNotifications(id);
      localStorage.setItem("route", "list-details");
      navigate(`/client/list-details/${debtorId}`);
    } else if (debtorId && !caseId && !isLinked) {
      getAllCases();
      setNotificationId(id);
      setInboxId(inboxId);
      setSmsMessage(message?.text);
    } else if (!caseId && !debtorId) {
      await MarkAsReadNotifications(id);
      getAllCases();
      setNotificationId(id);
      setInboxId(inboxId);
      setSmsMessage(message?.text);
    } else if (value === 1) {
      await MarkAsReadNotifications(id);
      getAllCases();
      setNotificationId(id);
      setInboxId(inboxId);
      setCaseId(caseId);
      setSmsMessage(message?.text);
    }
  };

  const viewCaseDetail = () => {
    localStorage.setItem("route", "all-cases");
    navigate(`/all-cases/${caseId}`);
    setAnchorEl(false);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredCases(allCases);
      return;
    }

    const filteredResults = {};
    Object.keys(allCases).forEach((companyName) => {
      if (companyName.toLowerCase().includes(term.toLowerCase())) {
        filteredResults[companyName] = allCases[companyName];
      }
    });

    setFilteredCases(filteredResults);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  useEffect(() => {
    setSelected([]);
  }, [selectedCase]);

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
              label={
                <Badge
                  badgeContent={notifications?.notificationCount?.emailCount}
                  color="error"
                  overlap="rectangular"
                  sx={{ "& .MuiBadge-badge": { top: 6, right: -6 } }}
                >
                  <Box sx={{ pr: 1 }}>Email</Box>
                </Badge>
              }
            />
            <Tab
              sx={{
                textTransform: "none",
                fontSize: FONT_SIZE_MEDIUM,
                color: Colors.SKY_BLUE,
                "&.Mui-selected": { color: Colors.SKY_BLUE },
              }}
              label={
                <Badge
                  badgeContent={notifications?.notificationCount?.smsCount}
                  color="error"
                  overlap="rectangular"
                  sx={{ "& .MuiBadge-badge": { top: 6, right: -6 } }}
                >
                  <Box sx={{ pr: 1 }}>SMS</Box>
                </Badge>
              }
            />
            <Tab
              sx={{
                textTransform: "none",
                fontSize: FONT_SIZE_MEDIUM,
                color: Colors.SKY_BLUE,
                "&.Mui-selected": { color: Colors.SKY_BLUE },
              }}
              label={
                <Badge
                  badgeContent={notifications?.notificationCount?.taskCount}
                  color="error"
                  overlap="rectangular"
                  sx={{ "& .MuiBadge-badge": { top: 6, right: -6 } }}
                >
                  <Box sx={{ pr: 1 }}>Tasks</Box>
                </Badge>
              }
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
            {notifications?.notifications?.length > 0 ? (
              notifications?.notifications?.map((notification, index) => (
                <ListItem
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                    flexDirection: "column",
                  }}
                  onClick={() =>
                    value !== 1
                      ? handleNotificationClick(
                          notification?.caseId,
                          notification?._id,
                          notification?.inboxId?._id,
                          notification?.debtorId,
                          notification?.isLinked
                        )
                      : null
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
                      sx={{
                        fontFamily: "Nunito",
                        fontSize: FONT_SIZE_LARGE,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      {notification?.text}
                      {value === 1 && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(
                              notification?.caseId,
                              notification?._id,
                              notification?.inboxId?._id,
                              notification?.debtorId,
                              notification?.isLinked,
                              notification?.inboxId
                            );
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      )}
                    </Typography>
                    <div style={{ display: "flex", gap: "3px" }}>
                      {notification?.debtorId &&
                        !notification?.caseId &&
                        !notification?.isLinked && (
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
              height: caseId ? "auto" : "60vh",
              maxWidth: "45vw",
              minWidth: "45vw",
              overflowY: "auto",
              ...ScrollbarStyles,
            },
          }}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        >
          <DialogTitle>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontSize: FONT_SIZE_LARGE,
                  fontWeight: "600",
                }}
              >
                {`Save ${
                  value === 0 ? "Email" : value === 1 ? "Sms" : "Task"
                } in the respective case`}
              </Typography>
              <TextButton
                buttonText="View Case"
                height="2rem"
                width="8rem"
                disabled={!caseId}
                onClick={viewCaseDetail}
                backgroundColor={Colors.SKY_BLUE}
                hoverColor={Colors.SKY_BLUE}
              />
            </div>
            {smsMessage && (
              <>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    mt: "10px",
                    width: "100%",
                    fontWeight: 600,
                  }}
                >
                  Text :
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    mb: "10px",
                    width: "100%",
                  }}
                >
                  {smsMessage}
                </Typography>
              </>
            )}

            {!caseId && (
              <TextField
                fullWidth
                size="small"
                placeholder="Search client company..."
                value={searchTerm}
                onChange={handleSearch}
                sx={{
                  mt: 2,
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&.Mui-focused fieldset": {
                      borderColor: Colors.SKY_BLUE,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: Colors.SKY_BLUE }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </DialogTitle>
          {!caseId && (
            <>
              <DialogContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div style={{ width: "48%" }}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontSize: FONT_SIZE_LARGE,
                      mb: "10px",
                      fontWeight: "600",
                    }}
                  >
                    Client Company Name
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: "90%",
                      overflowY: "auto",
                      ...ScrollbarStyles,
                    }}
                  >
                    {Object.keys(filteredCases)?.length > 0 ? (
                      Object.keys(filteredCases)?.map((item, index) => (
                        <Box key={index} display="flex" alignItems="center">
                          <Checkbox
                            checked={selectedCase === item}
                            onChange={() => handleCaseCheckboxChange(item)}
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
                            sx={{
                              fontFamily: "Nunito",
                              fontSize: FONT_SIZE_MEDIUM,
                            }}
                          >
                            {item}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_MEDIUM,
                          textAlign: "center",
                          color: Colors.DIM_LIGHT_GRAY,
                          mt: 2,
                        }}
                      >
                        No matching companies found
                      </Typography>
                    )}
                  </Box>
                </div>

                <div style={{ width: "48%" }}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontSize: FONT_SIZE_LARGE,
                      mb: "10px",
                      fontWeight: "600",
                    }}
                  >
                    Creditor Company Name
                  </Typography>
                  {allCases?.[selectedCase]?.map((item, index) => (
                    <Box key={index} display="flex" alignItems="center">
                      <Checkbox
                        checked={selected?.includes(item?.caseId)}
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
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_MEDIUM,
                        }}
                      >
                        {item?.creditorCompanyName}
                      </Typography>
                    </Box>
                  ))}
                </div>
              </DialogContent>

              <DialogActions>
                <TextButton
                  buttonText="Cancel"
                  height="2rem"
                  width="8rem"
                  onClick={handleCancel}
                  backgroundColor={Colors.ORANGE_COLOR}
                  hoverColor={Colors.ORANGE_COLOR}
                />
                <TextButton
                  buttonText="Save"
                  height="2rem"
                  width="8rem"
                  disabled={!selected?.length > 0}
                  loading={saveNotificationLoading}
                  onClick={saveCaseNotification}
                  backgroundColor={Colors.SKY_BLUE}
                  hoverColor={Colors.SKY_BLUE}
                />
              </DialogActions>
            </>
          )}
        </Dialog>
      </Popover>
    </div>
  );
};

export default NotificationsBell;
