import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../config/default";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_XL,
  PAGE_HEIGHT,
} from "../constants/appConstants";
import ScrollbarStyles from "./customScroll";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Menu,
  Button,
} from "@mui/material";
import MuiModels from "./models";
import SearchBar from "./searchBar";
import {
  ArrowBack,
  FilterListOutlined,
  ReplayOutlined,
  Email,
  Drafts,
} from "@mui/icons-material";
import TextButton from "./button";
import {
  GetAllCasesTasks,
  GetAllCc,
  GetAllNotifications,
  GetAllSenders,
  GetEmailData,
  GetEmailDataByThreadId,
  GetNotificationTemplates,
  GetUsers,
  TaskStatus,
} from "../services/services";
import { formatDateString } from "../common";
import { useNavigate } from "react-router-dom";
import Dropdown from "./dropdown";
import { setCounts } from "../redux/action/action";
import CheckIcon from "@mui/icons-material/Check";
import { useToast } from "../toast/toastContext";
import { Paper } from "@mui/material";
import EmailThreading from "./emailThreading";
import {
  Mail,
  ExpandMore,
  ChevronRight,
  MailOutline,
  CallReceived,
} from "@mui/icons-material";
import SendEmailCase from "./caseDetail/sendEmailCase";

const inputStyling = {
  width: "100%",
  padding: "7px 5px",
  borderRadius: "5px",
  backgroundColor: Colors.BG_LIGHT_GRAY,
  border: "none",
  outline: "none",
  fontSize: FONT_SIZE_LARGE,
  fontFamily: "Nunito",
  color: Colors.DIM_LIGHT_GRAY,
  marginBottom: "10px",
};

const boxStyling = {
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
};

const boldTextStyling = {
  fontFamily: "Nunito",
  fontSize: FONT_SIZE_MEDIUM,
  m: "6px 0px",
  fontWeight: 600,
};

const fontStyling = {
  fontFamily: "Nunito",
  fontSize: FONT_SIZE_MEDIUM,
  m: "6px 0px",
};

function Inbox() {
  const userData = useSelector((state) => state?.signIn?.signIn?.user);
  const [inboxData, setInboxData] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [creditorCompany, setCreditorCompany] = useState("");
  const [debtorCompany, setDebtorCompany] = useState("");
  const [caseCode, setCaseCode] = useState("");
  const [negotiator, setNegotiator] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [verifiedSenders, setVerified] = useState([]);
  const [activeTab, setActiveTab] = useState("Inbox");
  const [alltasks, setAllTasks] = useState([]);
  const [users, setUsers] = useState();
  const [userSelected, setUserSelected] = useState();
  const [notificationTemplate, setNotificationTemplate] = useState();
  const [activePreview, setActivePreview] = useState({
    id: 0,
    active: false,
  });
  const [undoStates, setUndoStates] = useState({});
  const [timeouts, setTimeouts] = useState({});
  const [hiddenTasks, setHiddenTasks] = useState({});
  const [cc, setCc] = useState({});
  const [expandedEmails, setExpandedEmails] = useState({});
  const [showSendEmailCase, setShowSendEmailCase] = useState(false);
  const [threadMessages, setThreadMessages] = useState([]);

  const { showToast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { smsCount, emailCount } = useSelector((state) => state.counts);
  const open = Boolean(anchorEl);
  const tabs = ["Inbox", "Tasks"];
  const disabled = caseCode || debtorCompany || creditorCompany || negotiator;
  const sendEmailRef = useRef(null);

  const handleKeyPress = (e) => {
    setSearchText(e.target.value);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getAllInboxData = async (search, filter) => {
    setLoading(true);
    const payload = {
      filter: {
        caseCode: caseCode || "",
        debtorCompanyName: debtorCompany || "",
        creditorCompanyName: creditorCompany || "",
        negotiatorName: negotiator || "",
        userId: userData?._id,
      },
      text: searchText || "",
    };
    const response = await GetEmailData(payload, search, filter);
    if (response?.status === 200) {
      const data = response?.data?.data;
      setInboxData(data);
    }
    setLoading(false);
  };

  const getVerifiedIdentites = async () => {
    const senderRes = await GetAllSenders();
    if (senderRes?.status === 200) {
      setVerified(senderRes?.data?.data);
    }
  };

  const getAllTasks = async () => {
    const res = await GetAllCasesTasks();
    if (res?.status === 200) {
      const data = res?.data?.data;
      setAllTasks(data);
    }
  };

  const getAllUser = async () => {
    const users = await GetUsers();
    if (users?.status === 200) {
      setUsers(users?.data?.data);
    }
  };

  const getNotificationTemplates = async () => {
    const res = await GetNotificationTemplates();
    if (res?.status === 200) {
      setNotificationTemplate(res?.data?.data);
    }
  };

  const getAllNotifications = async () => {
    dispatch(setCounts(smsCount, 0));
    const payload = {
      type: "EMAIL",
      status: "none",
    };
    await GetAllNotifications(payload);
  };

  const getAllCC = async () => {
    const res = await GetAllCc();
    if (res?.status === 200) {
      setCc(res?.data?.data);
    }
  };

  const getTypeIcon = (type) => {
    if (type === "sent") {
      return (
        <MailOutline sx={{ fontSize: 16, color: Colors.SKY_BLUE, mr: 1 }} />
      );
    } else {
      return <CallReceived sx={{ fontSize: 16, color: "#2e7d32", mr: 1 }} />;
    }
  };

  useEffect(() => {
    getAllInboxData(false, true);
    getVerifiedIdentites();
    getAllTasks();
    getAllUser();
    getNotificationTemplates();
    getAllNotifications();
    getAllCC();
  }, []);

  useEffect(() => {
    if (activeTab === "Tasks") {
      const firstKey = alltasks && Object.keys(alltasks)?.[0];
      setSelectedUser(firstKey);
    }
    setActivePreview({
      id: 0,
      active: false,
    });
  }, [activeTab]);

  useEffect(() => {
    if (userSelected) {
      handleUserChange();
    }
  }, [userSelected]);

  const handleClear = async () => {
    setCaseCode("");
    setDebtorCompany("");
    setCreditorCompany("");
    setNegotiator("");
    getAllInboxData();
  };

  const navigateToCaseDetail = (id) => {
    localStorage.setItem("route", "all-cases");
    navigate(`/all-cases/${id}`);
  };

  const handleUserChange = async () => {
    const user = users?.find((user) => user.name === userSelected);
    setLoading(true);
    const payload = {
      filter: {
        caseCode: "",
        debtorCompanyName: "",
        creditorCompanyName: "",
        negotiatorName: "",
        userId: user?._id,
      },
      text: "",
    };
    const response = await GetEmailData(payload, false, true);
    if (response?.status === 200) {
      const data = response?.data?.data;
      setInboxData(data);
    }
    setLoading(false);
  };

  const handleReplyClick = () => {
    setShowSendEmailCase(true);
    setTimeout(() => {
      sendEmailRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCloseReply = () => {
    setShowSendEmailCase(false);
  };

  const toggleEmail = (id) => {
    setExpandedEmails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderBox = (data, selectedUser, setSelectedUser) => {
    return (
      data &&
      Object.keys(data)?.map((key) => {
        return (
          <Box
            key={key}
            onClick={() => {
              setSelectedUser(key);
            }}
            sx={{
              ...boxStyling,
              backgroundColor:
                selectedUser === key ? Colors.lIGHT_PURPLE : "transparent",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: 600,
                fontSize: FONT_SIZE_LARGE,
              }}
            >
              {key}
            </Typography>
          </Box>
        );
      })
    );
  };

  const callTaskStatusApi = async (id, type) => {
    const payload = {};
    const res = await TaskStatus(id, payload, type);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
    } else {
      showToast(res?.response?.data?.message || "Error", "error");
    }
  };

  const handleCompleteStatus = async (id) => {
    setUndoStates((prev) => ({ ...prev, [id]: true }));
    setHiddenTasks((prev) => ({ ...prev, [id]: true }));
    const apiTimeout = setTimeout(async () => {
      await callTaskStatusApi(id, false);
      await getAllTasks(false, false);

      setUndoStates((prev) => ({ ...prev, [id]: false }));
      setHiddenTasks((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }, 3000);
    setTimeouts((prev) => ({ ...prev, [id]: apiTimeout }));
  };

  const handleUndo = async (id) => {
    if (timeouts[id]) clearTimeout(timeouts[id]);
    setUndoStates((prev) => ({ ...prev, [id]: false }));
    setHiddenTasks((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    await callTaskStatusApi(id, true);
    await getAllTasks(false, false);
  };

  const handlePreviewClick = async (threadId) => {
    setLoading(true);
    const res = await GetEmailDataByThreadId(threadId);
    if (res?.status === 200) {
      setThreadMessages(res?.data?.data);
    }
    setLoading(false);
  };

  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        padding: "0 2rem",
        height: PAGE_HEIGHT,
        overflowY: "auto",
        ...ScrollbarStyles,
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1.5rem",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "500",
            color: Colors.DARK_GRAY,
          }}
        >
          Authority level: <span>{userData?.role}</span>
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{
          marginTop: "1.5rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "2rem",
              fontFamily: "Nunito",
              color: Colors.BLACK,
            }}
          >
            Mailbox
          </Typography>
          <IconButton
            onClick={() => {
              getAllInboxData(false, true);
              setUserSelected("");
            }}
          >
            <ReplayOutlined />
          </IconButton>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <SearchBar
            searchCheck={true}
            searchingText={searchText}
            handleKeyPress={handleKeyPress}
            placeholder="Search..."
          />
          <IconButton onClick={handleClick}>
            <FilterListOutlined
              sx={{
                color: Colors.DARK_GRAY,
                fontSize: { xs: "20px", sm: "30px" },
              }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: "12px",
              },
            }}
          >
            <Grid sx={{ padding: ".5rem .75rem", width: "16rem" }}>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontSize: FONT_SIZE_XL,
                  fontWeight: "600",
                }}
              >
                Filter
              </Typography>
              <input
                style={inputStyling}
                placeholder="Search By Case Code"
                type="email"
                value={caseCode}
                onChange={(e) => setCaseCode(e.target.value)}
              />
              <input
                style={inputStyling}
                placeholder="Search By Client Company"
                type="email"
                value={debtorCompany}
                onChange={(e) => setDebtorCompany(e.target.value)}
              />
              <input
                style={inputStyling}
                placeholder="Search By Creditor Company"
                type="email"
                value={creditorCompany}
                onChange={(e) => setCreditorCompany(e.target.value)}
              />
              <input
                style={inputStyling}
                placeholder="Search By Negotiator Name"
                type="email"
                value={negotiator}
                onChange={(e) => setNegotiator(e.target.value)}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextButton
                  buttonText="Clear"
                  height="2rem"
                  width="45%"
                  marginRight="10%"
                  fontColor={Colors.BLACK}
                  onClick={handleClear}
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                />
                <TextButton
                  buttonText="Filter"
                  height="2rem"
                  width="45%"
                  fontColor={Colors.BLACK}
                  onClick={() => getAllInboxData(false, true)}
                  disabled={!disabled}
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                />
              </div>
            </Grid>
          </Menu>
          <MuiModels
            show="sendEmailCase"
            buttonName="composeEmail"
            compose={true}
            iconColor={Colors.BLACK}
            maxHeight="78vh"
            verifiedSenders={verifiedSenders}
            getAllInboxData={() => getAllInboxData(false, true)}
            data={notificationTemplate}
            cc={cc}
          />
        </div>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{
          borderRadius: "10px",
          height: "77vh",
        }}
        spacing={2}
      >
        <Grid item xs={12}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "10px",
              borderRadius: "8px",
              height: "70vh",
              overflowY: "auto",
              ...ScrollbarStyles,
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              padding="10px"
              sx={{
                backgroundColor: Colors.lIGHT_PURPLE,
                borderRadius: "8px",
                justifyContent: "space-between",
              }}
            >
              <Grid container item xs={4}>
                {tabs?.map((tab) => (
                  <Grid
                    item
                    xs={3}
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    sx={{
                      textAlign: "center",
                      cursor: "pointer",
                      padding: "10px",
                      borderRadius: "10px",
                      border:
                        activeTab === tab
                          ? `2px solid ${Colors.SKY_BLUE}`
                          : "none",
                      color: activeTab === tab ? Colors.SKY_BLUE : "inherit",
                    }}
                  >
                    <Typography
                      sx={{
                        textTransform: "none",
                        fontFamily: "Nunito",
                        fontWeight: "600",
                        fontSize: FONT_SIZE_LARGE,
                        color: activeTab === tab ? Colors.SKY_BLUE : "inherit",
                      }}
                    >
                      {tab}
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              {activeTab !== "Tasks" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Typography
                    sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
                  >
                    Viewing Inbox for:
                  </Typography>
                  <Dropdown
                    menuWidth="10rem"
                    menuItems={users?.map((user) => ({
                      label: user?.name,
                      value: user?.name,
                    }))}
                    placeholder={userData?.name}
                    backgroundColor={Colors.BG_LIGHT_GRAY}
                    hoverColor={Colors.BG_LIGHT_GRAY}
                    width="10rem"
                    selectedValue={userSelected}
                    setSelectedValue={setUserSelected}
                  />
                </div>
              )}
            </Box>
            {activeTab !== "Tasks" ? (
              loading ? (
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
                </Grid>
              ) : (
                <Box
                  flex={1}
                  sx={{
                    marginTop: "10px",
                    padding: "10px",
                    overflowY: "auto",
                    ...ScrollbarStyles,
                  }}
                >
                  {inboxData?.length === 0 ? (
                    <Grid
                      item
                      xs={12}
                      container
                      sx={{
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography sx={fontStyling}>
                        Looks like you have'nt started a conversation yet
                      </Typography>
                    </Grid>
                  ) : (
                    <>
                      {activePreview?.active ? (
                        <Box
                          display="flex"
                          flexDirection="column"
                          marginBottom="5px"
                        >
                          <div>
                            <IconButton
                              onClick={() => {
                                setActivePreview({ id: 0, active: false }),
                                  setExpandedEmails([]);
                              }}
                            >
                              <ArrowBack />
                            </IconButton>
                          </div>
                          <div
                            initial={{
                              opacity: 0,
                            }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{
                              duration: 0.4,
                              ease: "easeOut",
                            }}
                          >
                            <Box
                              sx={{
                                maxWidth: "100%",
                                margin: "auto",
                                p: 2,
                              }}
                            >
                              {/* Header */}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  mb: 2,
                                  pl: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Mail
                                    sx={{ mr: 1, color: Colors.SKY_BLUE }}
                                  />
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 600,
                                      fontFamily: "Nunito",
                                    }}
                                  >
                                    {threadMessages?.previousMessages?.length >
                                      0 &&
                                      threadMessages?.previousMessages[0]
                                        ?.subject}
                                  </Typography>
                                </Box>
                              </Box>

                              <Paper
                                sx={{
                                  border: "1px solid #e0e0e0",
                                  fontFamily: "Nunito",
                                }}
                              >
                                {threadMessages?.previousMessages?.map(
                                  (email, index) => (
                                    <Box
                                      key={index}
                                      sx={{ fontFamily: "Nunito" }}
                                    >
                                      {!expandedEmails[email._id] ? (
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            p: 2,
                                            cursor: "pointer",
                                            "&:hover": {
                                              backgroundColor: "#f5f5f5",
                                            },
                                            fontFamily: "Nunito",
                                          }}
                                          onClick={() => toggleEmail(email._id)}
                                        >
                                          <IconButton
                                            size="small"
                                            sx={{ mr: 1, p: 0.5 }}
                                          >
                                            <ChevronRight
                                              sx={{ fontSize: 20 }}
                                            />
                                          </IconButton>
                                          <Box
                                            sx={{
                                              flex: 1,
                                              fontFamily: "Nunito",
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                fontFamily: "Nunito",
                                              }}
                                            >
                                              <Typography
                                                variant="subtitle2"
                                                sx={{
                                                  fontWeight: 600,
                                                  mr: 1,
                                                  gap: ".5rem",
                                                  display: "flex",
                                                  alignItems: "center",
                                                  fontFamily: "Nunito",
                                                }}
                                              >
                                                {email?.debtorCompanyName ||
                                                  "Composed"}
                                                {getTypeIcon(email?.type)}
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                                  whiteSpace: "nowrap",
                                                  fontFamily: "Nunito",
                                                }}
                                              >
                                                -- {email?.subject}
                                              </Typography>
                                            </Box>
                                          </Box>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                              mr: 2,
                                              fontFamily: "Nunito",
                                            }}
                                          >
                                            {email?.updatedAt &&
                                              new Date(
                                                email?.updatedAt
                                              ).toLocaleString("en-US", {
                                                month: "numeric",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                              })}
                                          </Typography>
                                        </Box>
                                      ) : (
                                        <Box
                                          sx={{
                                            fontFamily: "Nunito",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              p: 2,
                                              cursor: "pointer",
                                              borderBottom: "1px solid #e0e0e0",
                                              "&:hover": {
                                                backgroundColor: "#f5f5f5",
                                              },
                                              fontFamily: "Nunito",
                                            }}
                                            onClick={() =>
                                              toggleEmail(email._id)
                                            }
                                          >
                                            <IconButton
                                              size="small"
                                              sx={{ mr: 1, p: 0.5 }}
                                            >
                                              <ExpandMore
                                                sx={{ fontSize: 20 }}
                                              />
                                            </IconButton>
                                            <Typography
                                              variant="body2"
                                              sx={{
                                                flex: 1,
                                                color: "text.secondary",
                                                fontFamily: "Nunito",
                                              }}
                                            >
                                              From:{" "}
                                              <strong>
                                                {email?.debtorCompanyName}
                                              </strong>{" "}
                                              &lt;{email?.from}&gt;
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                              sx={{
                                                fontFamily: "Nunito",
                                              }}
                                            >
                                              {email?.updatedAt &&
                                                new Date(
                                                  email?.updatedAt
                                                ).toLocaleString("en-US", {
                                                  month: "numeric",
                                                  day: "numeric",
                                                  year: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  hour12: false,
                                                })}
                                            </Typography>
                                          </Box>
                                          <Box
                                            sx={{
                                              p: 2,
                                              fontFamily: "Nunito",
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                mb: 2,
                                                fontFamily: "Nunito",
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  fontFamily: "Nunito",
                                                }}
                                              >
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    mb: 1,
                                                  }}
                                                >
                                                  <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                      minWidth: "40px",
                                                      mr: 1,
                                                      fontFamily: "Nunito",
                                                    }}
                                                  >
                                                    From:
                                                  </Typography>
                                                  <Typography
                                                    variant="body2"
                                                    sx={{
                                                      fontWeight: 600,
                                                      mr: 1,
                                                      fontFamily: "Nunito",
                                                    }}
                                                  >
                                                    {email?.debtorCompanyName}
                                                  </Typography>
                                                  <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                      fontFamily: "Nunito",
                                                    }}
                                                  >
                                                    &lt;{email?.from}
                                                    &gt;
                                                  </Typography>
                                                  <span
                                                    style={{
                                                      marginLeft: ".5rem",
                                                      marginTop: "6px",
                                                    }}
                                                  >
                                                    {email?.type === "sent" ? (
                                                      <Drafts
                                                        sx={{
                                                          color:
                                                            Colors.SKY_BLUE,
                                                          fontSize: "16px",
                                                        }}
                                                      />
                                                    ) : (
                                                      getTypeIcon(email?.type)
                                                    )}
                                                  </span>
                                                </Box>
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    mb: 2,
                                                  }}
                                                >
                                                  <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                      minWidth: "40px",
                                                      mr: 1,
                                                      fontFamily: "Nunito",
                                                    }}
                                                  >
                                                    To:
                                                  </Typography>
                                                  <Typography
                                                    variant="body2"
                                                    color="primary.main"
                                                    sx={{
                                                      fontFamily: "Nunito",
                                                    }}
                                                  >
                                                    {email?.to}
                                                  </Typography>
                                                </Box>
                                              </Box>
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 1,
                                                }}
                                              >
                                                <TextButton
                                                  buttonText="REPLY"
                                                  height="2rem"
                                                  marginRight="1rem"
                                                  width="6rem"
                                                  onClick={handleReplyClick}
                                                  backgroundColor={
                                                    Colors.SKY_BLUE
                                                  }
                                                  hoverColor={Colors.SKY_BLUE}
                                                />
                                              </Box>
                                            </Box>

                                            <span
                                              style={{
                                                whiteSpace: "pre-wrap",
                                                color: "#424242",
                                                lineHeight: 1,
                                                fontSize: "14px",
                                                fontFamily: "Nunito",
                                              }}
                                              dangerouslySetInnerHTML={{
                                                __html: `<div style="margin: 0;"><style>p { margin: 0 0 4px 0; }</style>${email?.textAsHtml}</div>`,
                                              }}
                                            ></span>

                                            {showSendEmailCase && (
                                              <div
                                                ref={sendEmailRef}
                                                style={{
                                                  padding: "12px 16px",
                                                  margin: "8px 0",
                                                  boxShadow:
                                                    "0px 1px 3px rgba(0, 0, 0, 0.12)",
                                                  borderRadius: "8px",
                                                  backgroundColor: "#ffffff",
                                                  border: "1px solid #d0d0d0",
                                                  transition:
                                                    "box-shadow 0.2s ease",
                                                  "&:hover": {
                                                    boxShadow:
                                                      "0px 2px 8px rgba(0, 0, 0, 0.15)",
                                                  },
                                                  marginTop: "1rem",
                                                }}
                                              >
                                                <SendEmailCase
                                                  from={email?.to}
                                                  to={email?.from}
                                                  content={email?.textAsHtml}
                                                  data={notificationTemplate}
                                                  // attachment={
                                                  // }
                                                  emailSubject={email?.subject}
                                                  emailOrCompose={
                                                    email?.caseId ? true : false
                                                  }
                                                  buttonName="sendEmailCase"
                                                  iconColor={Colors.BLACK}
                                                  maxHeight="78vh"
                                                  replyCheck={true}
                                                  caseDataId={email?.caseId}
                                                  getAllInboxData={() =>
                                                    handlePreviewClick(
                                                      email?.threadId
                                                    )
                                                  }
                                                  cc={email?.cc}
                                                  threadId={email?.threadId}
                                                  handleClose={handleCloseReply}
                                                />
                                              </div>
                                            )}
                                            <EmailThreading email={email} />
                                          </Box>
                                        </Box>
                                      )}
                                    </Box>
                                  )
                                )}
                              </Paper>
                            </Box>
                          </div>
                        </Box>
                      ) : (
                        inboxData?.map((item, index) => (
                          <Box
                            key={index}
                            display="flex"
                            flexDirection="column"
                            marginBottom="10px"
                          >
                            <CardContent
                              style={{
                                backgroundColor: Colors.BG_LIGHT_GRAY,
                                borderRadius: "8px",
                                marginTop: "5px",
                                padding: "10px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setActivePreview({
                                  id: index,
                                  active: true,
                                });
                                handlePreviewClick(item?.threadId);
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Email
                                  sx={{
                                    color: Colors.SKY_BLUE,
                                    fontSize: "20px",
                                  }}
                                />
                                <Typography
                                  sx={{ ...boldTextStyling, width: "18%" }}
                                >
                                  {item?.firstInboxMessage?.debtorCompanyName ||
                                    "Composed"}
                                </Typography>
                                <Typography
                                  sx={{ ...boldTextStyling, width: "69%" }}
                                >
                                  {item?.firstInboxMessage?.subject}
                                </Typography>
                                <Typography
                                  sx={{ ...boldTextStyling, width: "10%" }}
                                >
                                  {item?.firstInboxMessage?.createdAt &&
                                    new Date(
                                      item.firstInboxMessage.createdAt
                                    ).toLocaleString("en-US", {
                                      month: "numeric",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })}
                                </Typography>
                              </div>
                            </CardContent>
                          </Box>
                        ))
                      )}
                    </>
                  )}
                </Box>
              )
            ) : (
              <Grid
                container
                xs={12}
                sx={{
                  justifyContent: "space-between",
                  overflowY: "auto",
                  ...ScrollbarStyles,
                }}
              >
                <Grid
                  xs={2}
                  sx={{
                    padding: "10px 0px",
                  }}
                >
                  {renderBox(alltasks, selectedUser, setSelectedUser)}
                </Grid>
                <Grid
                  xs={9.5}
                  sx={{
                    overflowY: "auto",
                    ...ScrollbarStyles,
                  }}
                >
                  {Array.isArray(alltasks[selectedUser]) &&
                    alltasks[selectedUser]?.map((tasks) => (
                      <React.Fragment key={tasks?._id}>
                        {undoStates[tasks?._id] && (
                          <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              marginTop: "1rem",
                              marginBottom: "1rem",
                              backgroundColor: Colors.BG_LIGHT_GRAY,
                              borderRadius: "8px",
                              height: "4rem",
                            }}
                          >
                            <Button
                              variant="outlined"
                              sx={{
                                textAlign: "center",
                                cursor: "pointer",
                                padding: "5px",
                                borderRadius: "10px",
                                border: `2px solid ${Colors.SKY_BLUE}`,
                                color: Colors.SKY_BLUE,
                                fontFamily: "Nunito",
                                fontSize: "1rem",
                                fontWeight: "600",
                                textTransform: "none",
                                marginRight: "1rem",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUndo(tasks?._id);
                              }}
                            >
                              UNDO TASK
                            </Button>
                          </motion.div>
                        )}

                        {/* Render Task if not hidden */}
                        <AnimatePresence>
                          {!hiddenTasks[tasks?._id] && (
                            <motion.div
                              key={tasks?.caseId}
                              initial={{
                                opacity: 0,
                                x: undoStates[tasks?._id] ? -30 : 0,
                              }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 50 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                              <CardContent
                                key={tasks?.caseId}
                                onClick={() =>
                                  navigateToCaseDetail(tasks?.caseId)
                                }
                                sx={{
                                  backgroundColor: Colors.BG_LIGHT_GRAY,
                                  borderRadius: "8px",
                                  marginTop: "5px",
                                  padding: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                <div
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div style={{ display: "flex", gap: "10px" }}>
                                    <Typography sx={boldTextStyling}>
                                      Title:
                                    </Typography>
                                    <Typography sx={fontStyling}>
                                      {tasks?.title || "-"}
                                    </Typography>
                                  </div>
                                  <div>
                                    <IconButton
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCompleteStatus(tasks?._id);
                                      }}
                                    >
                                      <CheckIcon
                                        style={{
                                          color: "gray",
                                          fontSize: 24,
                                          cursor: "pointer",
                                        }}
                                      />
                                    </IconButton>
                                  </div>
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                  <Typography sx={boldTextStyling}>
                                    Assignee:
                                  </Typography>
                                  <Typography sx={fontStyling}>
                                    {tasks?.assignee || "-"}
                                  </Typography>
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                  <Typography sx={boldTextStyling}>
                                    Due Date:
                                  </Typography>
                                  <Typography sx={fontStyling}>
                                    {formatDateString(tasks?.dueDate) || "-"}
                                  </Typography>
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                  <Typography sx={boldTextStyling}>
                                    Status:
                                  </Typography>
                                  <Typography sx={fontStyling}>
                                    {tasks?.status || "-"}
                                  </Typography>
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                  <Typography sx={boldTextStyling}>
                                    Notes:
                                  </Typography>
                                  <Typography sx={fontStyling}>
                                    {tasks?.notes || "-"}
                                  </Typography>
                                </div>
                              </CardContent>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    ))}
                </Grid>
              </Grid>
            )}
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Inbox;
