import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Colors } from "../../config/default";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
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
} from "@mui/material";
import SearchBar from "./../searchBar";
import { FilterListOutlined, ReplayOutlined } from "@mui/icons-material";
import TextButton from "./../button";
import {
  GetAllInbox,
  GetNotificationTemplates,
  GetUsers,
} from "../../services/services";
import { formatDateString } from "../../common";
import { useNavigate } from "react-router-dom";
import Dropdown from "../dropdown";
import MuiModels from "../models";
import Prompt from "../prompt";

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
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [creditorCompany, setCreditorCompany] = useState("");
  const [debtorCompany, setDebtorCompany] = useState("");
  const [caseCode, setCaseCode] = useState("");
  const [negotiator, setNegotiator] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState("Sent");
  const [users, setUsers] = useState();
  const [userSelected, setUserSelected] = useState();
  const [notificationTemplate, setNotificationTemplate] = useState();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const tabs = ["Sent", "Received", "Draft"];
  const disabled = caseCode || debtorCompany || creditorCompany || negotiator;
  const activeInbox =
    activeTab === "Sent"
      ? "sent"
      : activeTab === "Draft"
      ? "draft"
      : "received";

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
      },
      text: searchText,
    };
    const response = await GetAllInbox(search, filter, "SMS", payload);
    if (response?.status === 200) {
      const data = response?.data?.data;
      setInboxData(data);
    }
    setLoading(false);
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
  }, []);

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
    getAllInboxData(true, false);
  };

  const handleUserChange = async () => {
    const user = users?.find((user) => user.name === userSelected);
    setLoading(true);
    const payload = {
      filter: {
        userId: user?._id,
      },
      text: searchText,
    };
    const response = await GetAllInbox(false, true, "SMS", payload);
    if (response?.status === 200) {
      const data = response?.data?.data;
      setInboxData(data);
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
          <IconButton onClick={() => getAllInboxData(false, false)}>
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
              height: "75vh",
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
            </Box>
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
                  marginTop: "10px",
                  padding: "10px",
                  overflowY: "auto",
                  ...ScrollbarStyles,
                }}
              >
                {inboxData?.[activeInbox]?.length === 0 ? (
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
                  inboxData?.[activeInbox]?.map((item, index) => (
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
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
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
                                    item?.debtorCompanyName || "Composed At"
                                  } ${"-"} ${formatDateString(
                                    item?.createdAt
                                  )} `}
                                </Typography>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                }}
                              >
                                {activeTab === "Draft" && (
                                  <div
                                    style={{ display: "flex", height: "2rem" }}
                                  >
                                    <MuiModels
                                      show="sendEmailCase"
                                      headerName={true}
                                      from={item?.to}
                                      to={item?.from}
                                      content={item?.text}
                                      buttonName="draft"
                                      iconColor={Colors.BLACK}
                                      maxHeight="78vh"
                                      caseDataId={item?.caseId}
                                      getAllInboxData={getAllInboxData}
                                      updateDraft={true}
                                      draftId={item?._id}
                                      data={notificationTemplate}
                                    />
                                    <Prompt
                                      text="Are you sure you want to remove this draft?"
                                      item={item?._id}
                                      deleting="deleteSmsDraft"
                                      getAllInboxData={getAllInboxData}
                                    />
                                  </div>
                                )}
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
                                <Tooltip
                                  placement="top"
                                  title={item?.to || "-"}
                                >
                                  {item?.to && item?.to?.length > 30
                                    ? `${item?.to?.slice(0, 70)}...`
                                    : item?.to || "-"}
                                </Tooltip>
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                              }}
                            >
                              <Typography
                                sx={{
                                  ...boldTextStyling,
                                }}
                              >
                                From:
                              </Typography>
                              <Typography sx={fontStyling}>
                                {item?.from || "-"}
                              </Typography>
                            </div>
                          </div>
                        </div>
                        <div>
                          {item?.creditorCompanyName && (
                            <div style={{ display: "flex", gap: "10px" }}>
                              <Typography sx={boldTextStyling}>
                                Creditor Company Name:
                              </Typography>
                              <Typography sx={fontStyling}>
                                {item?.creditorCompanyName || "-"}
                              </Typography>
                            </div>
                          )}
                          {item?.negotiatorName && (
                            <div style={{ display: "flex", gap: "10px" }}>
                              <Typography sx={boldTextStyling}>
                                Negotiator Name:
                              </Typography>
                              <Typography sx={fontStyling}>
                                {item?.negotiatorName || "-"}
                              </Typography>
                            </div>
                          )}
                          <Typography sx={boldTextStyling}>Content:</Typography>
                          <div>
                            <Typography sx={fontStyling}>
                              {item?.text || "-"}
                            </Typography>
                          </div>
                        </div>
                      </CardContent>
                    </Box>
                  ))
                )}
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Sms;
