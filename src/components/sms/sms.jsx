import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../../config/default";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_SMALL,
  FONT_SIZE_XL,
  PAGE_HEIGHT,
} from "../../constants/appConstants";
import ScrollbarStyles from "./../customScroll";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Menu,
  Tooltip,
  TextField,
} from "@mui/material";
import SearchBar from "./../searchBar";
import {
  FilterListOutlined,
  ReplayOutlined,
  ArrowBack,
} from "@mui/icons-material";
import TextButton from "./../button";
import {
  CreateSmsDraft,
  GetAllNotifications,
  GetNotificationTemplates,
  GetUsers,
  InboxData,
  SendEmailSmsCase,
} from "../../services/services";
import { formatDateString, handleNumberInput } from "../../common";
import Dropdown from "../dropdown";
import MuiModels from "../models";
import Prompt from "../prompt";
import { setCounts } from "../../redux/action/action";
import moment from "moment-timezone";
import styled from "styled-components";
import { useToast } from "../../toast/toastContext";

const StyledInput = styled.input`
  font-family: "Nunito";
  background-color: ${Colors.BG_LIGHT_GRAY};
  height: 2.5rem;
  color: ${Colors.DIM_LIGHT_GRAY};
  padding-left: 1rem;
  border: none;
  outline: none;
  border-radius: 5px;
  width: 98%;
`;

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

function Sms() {
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);

  const [inboxData, setInboxData] = useState();
  const [draftData, setDraftData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [creditorCompany, setCreditorCompany] = useState("");
  const [debtorCompany, setDebtorCompany] = useState("");
  const [caseCode, setCaseCode] = useState("");
  const [negotiator, setNegotiator] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState("Inbox");
  const [users, setUsers] = useState();
  const [userSelected, setUserSelected] = useState("");
  const [notificationTemplate, setNotificationTemplate] = useState();
  const [activeMainTab, setActiveMainTab] = useState("Primary");
  const [activePreview, setActivePreview] = useState({
    id: 0,
    active: false,
  });
  const [draftLoading, setDraftLoading] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);
  const open = Boolean(anchorEl);
  const tabs = ["Inbox", "Draft"];
  const { showToast } = useToast();

  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const { smsCount, emailCount } = useSelector((state) => state.counts);

  const disabled = caseCode || debtorCompany || creditorCompany || negotiator;

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
    const user = users?.find((user) => user.name === userSelected);
    setLoading(true);
    const payload = {
      filter: {
        caseCode: caseCode || "",
        debtorCompanyName: debtorCompany || "",
        creditorCompanyName: creditorCompany || "",
        negotiatorName: negotiator || "",
      },
      text: searchText || "",
      userId: user?._id || "",
    };
    const medium = activeTab === "Draft" ? "draft" : "SMS";
    const response = await InboxData(
      search,
      filter,
      medium,
      payload,
      userSelected === "All Users" ? true : false
    );
    if (response?.status === 200) {
      const data = response?.data?.data;
      if (activeTab === "Inbox") {
        setInboxData(data);
      } else {
        setDraftData(data);
      }
    }
    setLoading(false);
  };

  const getAllUser = async () => {
    const users = await GetUsers();

    if (users?.status === 200) {
      const userList = users?.data?.data || [];
      const allUsersOption = { name: "All Users" };
      setUsers([allUsersOption, ...userList]);
    }
  };

  const getNotificationTemplates = async () => {
    const res = await GetNotificationTemplates();
    if (res?.status === 200) {
      setNotificationTemplate(res?.data?.data);
    }
  };

  const getAllNotifications = async () => {
    dispatch(setCounts(0, emailCount));
    const payload = {
      type: "SMS",
      status: "none",
    };
    await GetAllNotifications(payload);
  };

  useEffect(() => {
    if (
      searchText &&
      (caseCode || debtorCompany || creditorCompany || negotiator)
    ) {
      getAllInboxData(true, true);
    } else if (searchText) {
      getAllInboxData(true, false);
    } else if (caseCode || debtorCompany || creditorCompany || negotiator) {
      getAllInboxData(false, true);
    } else {
      getAllInboxData(false, false);
    }
  }, [searchText, filterActive]);

  useEffect(() => {
    getAllUser();
    getNotificationTemplates();
    getAllNotifications();
  }, []);

  // Added effect to reload data when tab changes
  useEffect(() => {
    getAllInboxData(false, false);
    setActivePreview({
      id: 0,
      active: false,
    });
  }, [activeTab]);

  useEffect(() => {
    getAllInboxData(false, false);
    setActivePreview({
      id: 0,
      active: false,
    });
  }, [activeMainTab]);

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
    getAllInboxData(false, false);
  };

  const [preview, setPreview] = useState("");

  const handleSend = async () => {
    setSmsLoading(true);

    const formData = new FormData();
    formData.append("content", preview);
    formData.append("from", inboxData?.from?.toString());
    formData.append(
      "sendTo",
      inboxData?.allSms?.[activePreview?.id]?.to?.toString()
    );
    const res = await SendEmailSmsCase(inboxData?.caseId, "sms", formData);
    if (res?.status === 200) {
      getAllInboxData && getAllInboxData(false, false);
      showToast(res?.data?.message, "success");
      setPreview("");
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setSmsLoading(false);
  };

  const handleSaveDraft = async () => {
    setDraftLoading(true);
    const payload = {
      sendTo: inboxData?.allSms?.[activePreview?.id]?.to || "",
      from: inboxData?.from || "",
      content: preview || "",
      caseId: inboxData?.allSms?.[activePreview?.id]?.caseId || "",
    };
    const res = await CreateSmsDraft(payload);
    if (res?.status === 201) {
      getAllInboxData && getAllInboxData(false, false);
      showToast(res?.data?.message, "success");
      setPreview("");
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setDraftLoading(false);
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
      },
      text: searchText,
      userId: user?._id || "",
      medium: activeTab === "Draft" ? "draft" : "",
    };
    const medium = activeTab === "Draft" ? "draft" : "SMS";
    const response = await InboxData(
      false,
      false,
      medium,
      payload,
      userSelected === "All Users" ? true : false
    );
    if (response?.status === 200) {
      const data = response?.data?.data;
      if (activeTab === "Inbox") {
        setInboxData(data);
      } else {
        setDraftData(data);
      }
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
          Authority level: <span>{role}</span>
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
            SMS
          </Typography>
          <IconButton
            onClick={() => {
              getAllInboxData(false, false);
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
                  onClick={() => setFilterActive(!filterActive)}
                  disabled={!disabled}
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                />
              </div>
            </Grid>
          </Menu>
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
              height: "65vh",
              overflowY: "auto",
              ...ScrollbarStyles,
            }}
          >
            {!activePreview?.active && (
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
                <>
                  <Grid container item xs={4}>
                    {tabs?.map((tab) => (
                      <Grid
                        item
                        xs={3}
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                        }}
                        sx={{
                          textAlign: "center",
                          cursor: "pointer",
                          padding: "10px",
                          borderRadius: "10px",
                          border:
                            activeTab === tab
                              ? `2px solid ${Colors.SKY_BLUE}`
                              : "none",
                          color:
                            activeTab === tab ? Colors.SKY_BLUE : "inherit",
                        }}
                      >
                        <Typography
                          sx={{
                            textTransform: "none",
                            fontFamily: "Nunito",
                            fontWeight: "600",
                            fontSize: FONT_SIZE_LARGE,
                            color:
                              activeTab === tab ? Colors.SKY_BLUE : "inherit",
                          }}
                        >
                          {tab}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>

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
                      Viewing Sms for:
                    </Typography>
                    <Dropdown
                      menuWidth="10rem"
                      menuItems={users?.map((user) => ({
                        label: user?.name,
                        value: user?.name,
                      }))}
                      placeholder={inboxData?.userName}
                      backgroundColor={Colors.BG_LIGHT_GRAY}
                      hoverColor={Colors.BG_LIGHT_GRAY}
                      width="10rem"
                      selectedValue={userSelected}
                      setSelectedValue={setUserSelected}
                    />
                  </div>
                </>
              </Box>
            )}

            {loading ? (
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
                  height: "80%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {activePreview?.active && (
                  <Box
                    sx={{
                      backgroundColor: Colors.lIGHT_PURPLE,
                      padding: "1rem",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "2%",
                      top: 0,
                      zIndex: 2,
                    }}
                  >
                    <IconButton
                      onClick={() => setActivePreview({ id: 0, active: false })}
                    >
                      <ArrowBack />
                    </IconButton>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_MEDIUM,
                          fontWeight: 600,
                        }}
                      >
                        {inboxData?.allSms?.[activePreview?.id]?.data?.[0]
                          ?.debtorCompanyName ||
                          draftData?.allSms?.[activePreview?.id]
                            ?.debtorCompanyName ||
                          "Composed"}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Scrollable Content */}
                <Box
                  ref={containerRef}
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "5px",
                    ...ScrollbarStyles,
                    marginBottom: "3rem",
                  }}
                >
                  {activePreview?.active &&
                    (activeTab === "Inbox"
                      ? (() => {
                          const messages =
                            inboxData?.allSms?.[activePreview?.id]?.data || [];
                          const numbersArray = inboxData?.numbers || [];

                          return messages?.map((item, index) => {
                            const isSameSender = numbersArray.includes(
                              item?.from
                            );

                            const messageStyle = {
                              backgroundColor: isSameSender
                                ? Colors.SKY_BLUE
                                : Colors.BG_LIGHT_GRAY,
                              borderTopLeftRadius: "10px",
                              borderTopRightRadius: "10px",
                              borderBottomRightRadius: isSameSender
                                ? "0px"
                                : "10px",
                              borderBottomLeftRadius: isSameSender
                                ? "10px"
                                : "0px",
                              marginTop: "10px",
                              padding: "12px",
                              width: "50%",
                              color: isSameSender ? Colors.WHITE : Colors.BLACK,
                            };

                            return (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: isSameSender
                                    ? "flex-end"
                                    : "flex-start",
                                }}
                              >
                                <CardContent style={messageStyle}>
                                  <Typography sx={fontStyling}>
                                    {item?.text || "-"}
                                  </Typography>
                                </CardContent>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: isSameSender
                                      ? "flex-end"
                                      : "flex-start",
                                    width: "50%",
                                    marginTop: "4px",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontFamily: "Nunito",
                                      fontSize: FONT_SIZE_SMALL,
                                      m: "6px 0px",
                                    }}
                                  >
                                    {item?.createdAt
                                      ? moment(item.createdAt)
                                          .tz("America/New_York")
                                          .format("MM/DD/YYYY hh:mm A")
                                      : "-"}
                                  </Typography>
                                </div>
                              </div>
                            );
                          });
                        })()
                      : draftData?.allSms?.[activePreview?.id] && (
                          <CardContent
                            style={{
                              backgroundColor: Colors.BG_LIGHT_GRAY,
                              borderRadius: "8px",
                              marginTop: "5px",
                              padding: "10px",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <Typography sx={boldTextStyling}>
                                  {`${
                                    draftData.allSms[activePreview.id]
                                      ?.debtorCompanyName || "Composed"
                                  } - ${formatDateString(
                                    draftData.allSms[activePreview.id]
                                      ?.createdAt
                                  )}`}
                                </Typography>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  height: "2rem",
                                }}
                              >
                                <MuiModels
                                  show="sendEmailCase"
                                  headerName={true}
                                  from={draftData.allSms[activePreview.id]?.to}
                                  to={draftData.allSms[activePreview.id]?.from}
                                  content={
                                    draftData.allSms[activePreview.id]?.text
                                  }
                                  buttonName="draft"
                                  iconColor={Colors.BLACK}
                                  maxHeight="78vh"
                                  caseDataId={
                                    draftData.allSms[activePreview.id]?.caseId
                                  }
                                  getAllInboxData={getAllInboxData}
                                  updateDraft={true}
                                  draftId={
                                    draftData.allSms[activePreview.id]?._id
                                  }
                                  data={notificationTemplate}
                                />
                                <Prompt
                                  text="Are you sure you want to remove this draft?"
                                  item={draftData.allSms[activePreview.id]?._id}
                                  setActivePreview={setActivePreview}
                                  deleting="deleteSmsDraft"
                                  getAllInboxData={getAllInboxData}
                                />
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <Typography sx={boldTextStyling}>To:</Typography>
                              <Typography sx={fontStyling}>
                                {draftData.allSms[activePreview.id]?.to || "-"}
                              </Typography>
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                              <Typography sx={boldTextStyling}>
                                From:
                              </Typography>
                              <Typography sx={fontStyling}>
                                {draftData.allSms[activePreview.id]?.from ||
                                  "-"}
                              </Typography>
                            </div>

                            <div>
                              <Typography sx={boldTextStyling}>
                                Content:
                              </Typography>
                              <Typography sx={fontStyling}>
                                {draftData.allSms[activePreview.id]?.text ||
                                  "-"}
                              </Typography>
                            </div>
                          </CardContent>
                        ))}
                  {activePreview?.active && activeTab !== "Draft" && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        borderRadius: "10px",
                        zIndex: 1,
                        width: "98%",

                        paddingTop: ".2rem",
                        backgroundColor: Colors.WHITE,
                      }}
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <StyledInput
                        type="text"
                        placeholder="Write here...."
                        value={preview}
                        onChange={(e) => setPreview(e.target.value)}
                      />
                      <TextButton
                        buttonText="Send"
                        height="2rem"
                        width="10%"
                        fontColor={Colors.WHITE}
                        loading={smsLoading}
                        onClick={handleSend}
                        backgroundColor={Colors.SKY_BLUE}
                        hoverColor={Colors.SKY_BLUE}
                        disabled={!preview.trim()}
                      />
                      <TextButton
                        buttonText="Save As Draft"
                        height="2rem"
                        width="13rem"
                        loading={draftLoading}
                        fontColor={Colors.WHITE}
                        onClick={handleSaveDraft}
                        backgroundColor={Colors.SKY_BLUE}
                        hoverColor={Colors.SKY_BLUE}
                        disabled={!preview.trim()}
                      />
                    </Box>
                  )}

                  {/* Default List View if No Preview Active */}
                  {!activePreview?.active &&
                    (activeTab === "Inbox" ? (
                      inboxData &&
                      Object.keys(inboxData?.allSms || {}).length > 0 ? (
                        Object.entries(inboxData?.allSms || {}).map(
                          ([key, value]) => (
                            <Box
                              key={key}
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
                                  setActivePreview({ id: key, active: true });
                                  if (containerRef.current) {
                                    containerRef.current.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    });
                                  }
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
                                  <Typography
                                    sx={{ ...boldTextStyling, width: "40%" }}
                                  >
                                    {value?.data?.[0]?.debtorCompanyName ||
                                      "Composed"}
                                  </Typography>
                                  <Typography
                                    sx={{ ...boldTextStyling, width: "50%" }}
                                  >
                                    {value?.data?.[0]?.creditorCompanyName ||
                                      "Composed"}
                                  </Typography>
                                  <Typography
                                    sx={{ ...boldTextStyling, width: "10%" }}
                                  >
                                    {formatDateString(
                                      value?.data?.[0]?.createdAt
                                    )}
                                  </Typography>
                                </div>
                              </CardContent>
                            </Box>
                          )
                        )
                      ) : (
                        <Typography
                          sx={{
                            fontFamily: "Nunito",
                            fontSize: FONT_SIZE_MEDIUM,
                            m: "6px 0px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "20vh",
                          }}
                        >
                          Looks like you have'nt started a conversation yet
                        </Typography>
                      )
                    ) : draftData?.allSms?.length > 0 ? (
                      draftData.allSms.map((item, index) => (
                        <Box
                          key={item?._id || index}
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
                              setActivePreview({ id: index, active: true });
                              if (containerRef.current) {
                                containerRef.current.scrollTo({
                                  top: 0,
                                  behavior: "smooth",
                                });
                              }
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
                              <Typography
                                sx={{ ...boldTextStyling, width: "18%" }}
                              >
                                {item?.debtorCompanyName || "Composed"}
                              </Typography>
                              <Typography
                                sx={{ ...boldTextStyling, width: "69%" }}
                              >
                                {item?.text}
                              </Typography>
                              <Typography
                                sx={{ ...boldTextStyling, width: "10%" }}
                              >
                                {formatDateString(item?.createdAt)}
                              </Typography>
                            </div>
                          </CardContent>
                        </Box>
                      ))
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_MEDIUM,
                          m: "6px 0px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "20vh",
                        }}
                      >
                        Looks like you have'nt started a conversation yet
                      </Typography>
                    ))}
                </Box>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Sms;
