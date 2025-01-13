import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  Tabs,
  Tab,
  Divider,
  Tooltip,
} from "@mui/material";
import MuiModels from "./models";
import SearchBar from "./searchBar";
import {
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  FilterListOutlined,
} from "@mui/icons-material";
import TextButton from "./button";
import {
  GetAllCasesTasks,
  GetAllInbox,
  GetAllSenders,
} from "../services/services";
import { formatDateString } from "../common";
import { useNavigate } from "react-router-dom";

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
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
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
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const [inboxData, setInboxData] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [selectedUserData, setSelectedUserData] = useState();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [creditorCompany, setCreditorCompany] = useState("");
  const [debtorCompany, setDebtorCompany] = useState("");
  const [caseCode, setCaseCode] = useState("");
  const [negotiator, setNegotiator] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [verifiedSenders, setVerified] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [alltasks, setAllTasks] = useState([]);
  const open = Boolean(anchorEl);
  const [expandedMessages, setExpandedMessages] = useState({});
  const navigate = useNavigate();

  const handleToggleContent = (index) => {
    setExpandedMessages((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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
    const response = await GetAllInbox(1, 5, search, filter, payload);
    if (response?.status === 200) {
      const data = response?.data?.data;
      setInboxData(data);
      const firstKey = data && Object.keys(data)?.[0];
      const value = data && data[firstKey];
      setSelectedUser(firstKey);
      setSelectedUserData(value);
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
    getVerifiedIdentites();
    getAllTasks();
  }, []);

  useEffect(() => {
    if (activeTab === 2) {
      const firstKey = alltasks && Object.keys(alltasks)?.[0];
      const value = alltasks && alltasks[firstKey];
      setSelectedUser(firstKey);
      setSelectedUserData(value);
    } else {
      const firstKey = inboxData && Object.keys(inboxData)?.[0];
      const value = inboxData && inboxData[firstKey];
      setSelectedUser(firstKey);
      setSelectedUserData(value);
    }
  }, [activeTab]);

  const disabled = caseCode || debtorCompany || creditorCompany || negotiator;

  const handleClear = async () => {
    setCaseCode("");
    setDebtorCompany("");
    setCreditorCompany("");
    setNegotiator("");
    getAllInboxData(true, false);
  };

  const navigateToCaseDetail = (id) => {
    localStorage.setItem("route", "all-cases");
    navigate(`/all-cases/${id}`);
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
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "2rem",
            fontFamily: "Nunito",
            color: Colors.BLACK,
          }}
        >
          Inbox
        </Typography>
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
          <MuiModels
            show="sendEmailCase"
            buttonName="composeEmail"
            compose={true}
            iconColor={Colors.BLACK}
            maxHeight="78vh"
            GetLogsById={getAllInboxData}
            verifiedSenders={verifiedSenders}
          />
        </div>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{
          borderRadius: "10px",
          height: "80vh",
        }}
        spacing={2}
      >
        <Grid item xs={3}>
          <Card
            sx={{
              padding: "10px",
              borderRadius: "8px",
              height: "75vh",
              overflowY: "auto",
              ...ScrollbarStyles,
            }}
          >
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
                <CircularProgress size={40} sx={{ color: Colors.SKY_BLUE }} />
              </Grid>
            ) : (
              <>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  centered
                  textColor="primary"
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: Colors.SKY_BLUE,
                    },
                  }}
                  sx={{ mb: "10px", width: "100%" }}
                >
                  <Tab
                    sx={{
                      textTransform: "none",
                      color: Colors.SKY_BLUE,
                      "&.Mui-selected": {
                        color: Colors.SKY_BLUE,
                      },
                    }}
                    label="Inbox"
                  />
                  <Tab
                    sx={{
                      textTransform: "none",
                      color: Colors.SKY_BLUE,
                      "&.Mui-selected": {
                        color: Colors.SKY_BLUE,
                      },
                    }}
                    label="Outbox"
                  />
                  <Tab
                    sx={{
                      textTransform: "none",
                      color: Colors.SKY_BLUE,
                      "&.Mui-selected": {
                        color: Colors.SKY_BLUE,
                      },
                    }}
                    label="Tasks"
                  />
                </Tabs>
                <Divider sx={{ mb: "10px" }} />
                {activeTab === 2
                  ? alltasks &&
                    Object.keys(alltasks)?.map((key) => {
                      const value = alltasks[key];
                      return (
                        <Box
                          key={key}
                          onClick={() => {
                            setSelectedUser(key);
                            setSelectedUserData(value);
                            setExpandedMessages({});
                          }}
                          sx={{
                            ...boxStyling,
                            backgroundColor:
                              selectedUser === key
                                ? Colors.lIGHT_PURPLE
                                : "transparent",
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
                  : inboxData &&
                    Object.keys(inboxData)?.map((key) => {
                      const value = inboxData[key];
                      return (
                        <Box
                          key={key}
                          onClick={() => {
                            setSelectedUser(key);
                            setSelectedUserData(value);
                            setExpandedMessages({});
                          }}
                          sx={{
                            ...boxStyling,
                            backgroundColor:
                              selectedUser === key
                                ? Colors.lIGHT_PURPLE
                                : "transparent",
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
                            <Typography
                              sx={{
                                fontFamily: "Nunito",
                                fontSize: FONT_SIZE_MEDIUM,
                              }}
                            >
                              {inboxData?.[key]?.[0]?.subject?.length > 50
                                ? `${inboxData?.[key]?.[0]?.subject?.slice(
                                    0,
                                    50
                                  )}...`
                                : inboxData?.[key]?.[0]?.subject}
                            </Typography>
                          </Typography>
                        </Box>
                      );
                    })}
              </>
            )}
          </Card>
        </Grid>

        <Grid item xs={9}>
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
            {activeTab !== 2 ? (
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
              ) : inboxData ? (
                <>
                  <Box
                    display="flex"
                    alignItems="center"
                    padding="10px"
                    style={{
                      backgroundColor: Colors.lIGHT_PURPLE,
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Nunito",
                        fontWeight: "700",
                        fontSize: FONT_SIZE_LARGE,
                      }}
                    >
                      {selectedUser}
                    </Typography>
                  </Box>
                  <Box
                    flex={1}
                    sx={{
                      marginTop: "10px",
                      padding: "10px",
                      overflowY: "auto",
                      ...ScrollbarStyles,
                    }}
                  >
                    {selectedUserData?.filter((item) =>
                      activeTab === 0
                        ? item?.type === "received"
                        : item?.type === "sent"
                    )?.length === 0 ? (
                      <Typography
                        sx={{
                          textAlign: "center",
                          marginTop: "20px",
                          color: Colors.GRAY,
                          fontFamily: "Nunito",
                        }}
                      >
                        No messages found.
                      </Typography>
                    ) : (
                      selectedUserData
                        ?.filter((item) =>
                          activeTab === 0
                            ? item?.type === "received"
                            : item?.type === "sent"
                        )
                        ?.map((item, index) => (
                          <Box
                            key={index}
                            display="flex"
                            flexDirection="column"
                            marginBottom="10px"
                          >
                            <CardContent
                              style={{
                                backgroundColor:
                                  item?.type === "sent"
                                    ? Colors.lIGHT_PURPLE
                                    : Colors.BG_LIGHT_GRAY,
                                borderRadius: "8px",
                                marginTop: "5px",
                                padding: "10px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  // paddingLeft: "20px",
                                }}
                              >
                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        // marginTop: "10px",
                                        // marginBottom: "10px",
                                      }}
                                    >
                                      <Typography
                                        onClick={() =>
                                          handleToggleContent(index)
                                        } // Pass index to toggle specific message
                                      >
                                        {expandedMessages[index] ? (
                                          <IconButton>
                                            <ExpandMore
                                              sx={{
                                                color: Colors.SKY_BLUE,
                                                cursor: "pointer",
                                              }}
                                            />
                                          </IconButton>
                                        ) : (
                                          <IconButton>
                                            <ChevronRight
                                              sx={{
                                                color: Colors.SKY_BLUE,
                                                cursor: "pointer",
                                              }}
                                            />
                                          </IconButton>
                                        )}
                                      </Typography>
                                    </Box>
                                    <Typography
                                      sx={{
                                        fontFamily: "Nunito",
                                        fontSize: FONT_SIZE_MEDIUM,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {`${
                                        item?.debtorCompanyName
                                      } ${"-"} ${formatDateString(
                                        item?.createdAt
                                      )} `}
                                    </Typography>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      paddingLeft: "3.2rem",
                                    }}
                                  >
                                    <Typography sx={boldTextStyling}>
                                      To:
                                    </Typography>

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
                                      paddingLeft: "3.2rem",
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
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      paddingLeft: "3.2rem",
                                    }}
                                  >
                                    <Typography sx={boldTextStyling}>
                                      Subject:
                                    </Typography>

                                    <Typography sx={fontStyling}>
                                      {item?.subject || "-"}
                                    </Typography>
                                  </div>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                  }}
                                >
                                  {item?.type === "received" && (
                                    <MuiModels
                                      show="sendEmailCase"
                                      replyButton={true}
                                      from={item?.from}
                                      to={item?.to}
                                      content={item?.textAsHtml}
                                      emailSubject={item?.subject}
                                      buttonName="sendEmailCase"
                                      iconColor={Colors.BLACK}
                                      maxHeight="78vh"
                                      replyCheck={true}
                                      caseDataId={item?.caseId}
                                    />
                                  )}
                                </div>
                              </div>
                              {expandedMessages[index] && (
                                <div style={{ paddingLeft: "3.2rem" }}>
                                  <div style={{ display: "flex", gap: "10px" }}>
                                    <Typography sx={boldTextStyling}>
                                      Case Code:
                                    </Typography>
                                    <Typography sx={fontStyling}>
                                      {item?.caseCode}
                                    </Typography>
                                  </div>
                                  <div style={{ display: "flex", gap: "10px" }}>
                                    <Typography sx={boldTextStyling}>
                                      Creditor Company Name:
                                    </Typography>
                                    <Typography sx={fontStyling}>
                                      {item?.creditorCompanyName || "-"}
                                    </Typography>
                                  </div>
                                  <div style={{ display: "flex", gap: "10px" }}>
                                    <Typography sx={boldTextStyling}>
                                      Negotiator Name:
                                    </Typography>
                                    <Typography sx={fontStyling}>
                                      {item?.negotiatorName || "-"}
                                    </Typography>
                                  </div>
                                  <div>
                                    <>
                                      <Typography sx={boldTextStyling}>
                                        Content:
                                      </Typography>
                                      <Typography
                                        sx={fontStyling}
                                        dangerouslySetInnerHTML={{
                                          __html: item?.textAsHtml,
                                        }}
                                      />
                                    </>
                                    {/* )} */}

                                    {/* Show More / Show Less button */}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Box>
                        ))
                    )}
                  </Box>
                </>
              ) : (
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
              )
            ) : alltasks ? (
              alltasks[selectedUser]?.map((tasks) => (
                <CardContent
                  onClick={() => navigateToCaseDetail(tasks?.caseId)}
                  sx={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    borderRadius: "8px",
                    marginTop: "5px",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Typography sx={boldTextStyling}>Title:</Typography>
                    <Typography sx={fontStyling}>
                      {tasks?.title || "-"}
                    </Typography>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Typography sx={boldTextStyling}>Assignee:</Typography>
                    <Typography sx={fontStyling}>
                      {tasks?.assignee || "-"}
                    </Typography>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Typography sx={boldTextStyling}>Due Date:</Typography>
                    <Typography sx={fontStyling}>
                      {formatDateString(tasks?.dueDate) || "-"}
                    </Typography>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Typography sx={boldTextStyling}>Status:</Typography>
                    <Typography sx={fontStyling}>
                      {tasks?.status || "-"}
                    </Typography>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Typography sx={boldTextStyling}>Notes:</Typography>
                    <Typography sx={fontStyling}>
                      {tasks?.notes || "-"}
                    </Typography>
                  </div>
                </CardContent>
              ))
            ) : (
              <Grid
                container
                xs={12}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontSize: FONT_SIZE_MEDIUM,
                }}
              >
                No Tasks Yet
              </Grid>
            )}
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Inbox;
