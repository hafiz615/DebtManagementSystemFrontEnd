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
} from "@mui/material";
import MuiModels from "./models";
import SearchBar from "./searchBar";
import { FilterListOutlined } from "@mui/icons-material";
import TextButton from "./button";
import {
  GetAllCasesTasks,
  GetAllInbox,
  GetAllSenders,
} from "../services/services";
import { formatDateString } from "../common";

const users = [
  {
    name: "Mike Nelson",
    lastMessage: "Now",
    messages: ["Hi, how are you?", "I'm good, thanks!"],
  },
  { name: "Sofia Jackson", lastMessage: "1h", messages: ["Hello there!"] },
  { name: "Mathew Jackson", lastMessage: "1h", messages: ["Hello there!"] },
  { name: "Jeremy Clarkson", lastMessage: "1h", messages: ["Hello there!"] },
  { name: "Aftab Qarshi", lastMessage: "1h", messages: ["Hello there!"] },
  { name: "Marshal Mathers", lastMessage: "1h", messages: ["Hello there!"] },
  { name: "John Snow", lastMessage: "1h", messages: ["Hello there!"] },
  {
    name: "James Smith",
    lastMessage: "1h",
    messages: ["Hey, are you free tomorrow?"],
  },
  {
    name: "Natasha Miller",
    lastMessage: "12h",
    messages: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at accumsan diam, et auctor est. Ut ut tortor lectus. Phasellus at sem dapibus, hendrerit nibh at, condimentum arcu. Vestibulum ante purus, vestibulum sit amet ultricies a, efficitur in mauris. Duis arcu metus, auctor quis faucibus vel, varius quis ligula. Aliquam erat volutpat. In sagittis sollicitudin enim, eu pharetra lorem ornare vel. Nulla mollis sagittis orci. Aenean vel nulla quis justo efficitur interdum nec id nulla. Sed sed lectus laoreet, placerat purus tempus, lobortis magna. Quisque egestas tristique lorem, in cursus massa molestie sed.",
    ],
  },
];

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
  const [preview, setPreview] = useState("");
  const [creditorCompany, setCreditorCompany] = useState("");
  const [debtorCompany, setDebtorCompany] = useState("");
  const [caseCode, setCaseCode] = useState("");
  const [negotiator, setNegotiator] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [verifiedSenders, setVerified] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const open = Boolean(anchorEl);

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
      console.log(res?.data?.data);
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

  const disabled = caseCode || debtorCompany || creditorCompany || negotiator;

  const handleClear = async () => {
    setCaseCode("");
    setDebtorCompany("");
    setCreditorCompany("");
    setNegotiator("");
    getAllInboxData(true, false);
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
                placeholder="Search By Debtor Company"
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

      <>
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
                  {activeTab !== 2 &&
                    inboxData &&
                    Object.keys(inboxData)?.map((key) => {
                      const value = inboxData[key];
                      return (
                        <Box
                          key={key}
                          onClick={() => {
                            setSelectedUser(key);
                            setSelectedUserData(value);
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
                                }}
                              >
                                <div style={{ display: "flex", gap: "10px" }}>
                                  <Typography sx={boldTextStyling}>
                                    To:
                                  </Typography>
                                  <Typography sx={fontStyling}>
                                    {item?.to || "-"}
                                  </Typography>
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                  <Typography sx={fontStyling}>
                                    {formatDateString(item?.createdAt)}
                                  </Typography>
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
                              <div style={{ display: "flex", gap: "10px" }}>
                                <Typography sx={boldTextStyling}>
                                  Subject:
                                </Typography>
                                <Typography sx={fontStyling}>
                                  {item?.subject || "-"}
                                </Typography>
                              </div>
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
                                  Debtor Company Name:
                                </Typography>
                                <Typography sx={fontStyling}>
                                  {item?.debtorCompanyName || "-"}
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
                              <Typography sx={boldTextStyling}>
                                Content:
                              </Typography>
                              <Typography
                                sx={fontStyling}
                                dangerouslySetInnerHTML={{
                                  __html: item?.textAsHtml,
                                }}
                              />
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
              )}
            </Card>
          </Grid>
        </Grid>
      </>
    </Grid>
  );
}

export default Inbox;
