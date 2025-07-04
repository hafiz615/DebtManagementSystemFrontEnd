import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  Box,
  Card,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import {
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
  TWILIO_ACCOUNT_ID,
  TWILIO_ACCOUNT_PASS,
  UserListPage,
} from "../../constants/appConstants";
import { Colors } from "../../config/default";
import { CallSummary, GetVoiceMails } from "../../services/services";
import ScrollbarStyles from "../customScroll";
import { formatDateString } from "../../common";
import {
  Close,
  Description,
  RemoveRedEye,
  ReplayOutlined,
} from "@mui/icons-material";
import axios from "axios";
import MuiModels from "../models";
import Prompt from "../prompt";
import { useNavigate } from "react-router-dom";

const headingFontStyling = {
  fontFamily: "Nunito",
  fontSize: FONT_SIZE_LARGE,
  fontWeight: "600",
};

const divStyling = {
  display: "flex",
  padding: "0px 1rem",
  height: "3rem",
  backgroundColor: Colors.BG_LIGHT_GRAY,
  borderRadius: "10px",
  marginTop: "10px",
  alignItems: "center",
};

function VoiceMail() {
  const [voiceMailData, setVoiceMailData] = useState([]);
  const [mainLoading, setMainLoading] = useState(false);
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;
  const [showTranscript, setShowTranscript] = useState({});
  const [sentences, setSentences] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState({});
  const navigate = useNavigate();

  const fetchSentences = async (id, url, username, password, maxRetries) => {
    setLoading((prev) => ({
      ...prev,
      [id]: true,
    }));
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { data } = await axios.get(url, { auth: { username, password } });
        if (data.sentences && data.sentences.length > 0) {
          setSentences((prev) => ({
            ...prev,
            [id]: data.sentences,
          }));
          getCallSummary(data?.sentences, id);
          return;
        }
      } catch (error) {
        if (error.response?.status === 404) {
          await new Promise((r) => setTimeout(r, 5000));
        } else {
          setLoading(false);
          return;
        }
      }
    }
    setLoading((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const handleFetch = (transcriptUrl, id) => {
    const url = transcriptUrl;
    const username = TWILIO_ACCOUNT_ID;
    const password = TWILIO_ACCOUNT_PASS;
    fetchSentences(id, url, username, password, 10);
  };

  const toggleTranscript = (id) => {
    setShowTranscript((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getCallSummary = async (sentencesArray, id) => {
    const payload = {
      transcriptText: sentencesArray
        ? sentencesArray?.map((item) => item?.transcript).join(" ")
        : "",
    };
    const res = await CallSummary(payload);
    if (res?.status === 200) {
      setSummary((prev) => ({
        ...prev,
        [id]: res?.data?.data,
      }));
      setLoading((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
  };

  const getVoiceMails = async (loadingPrompt) => {
    if (!loadingPrompt) {
      setMainLoading(true);
    }
    const res = await GetVoiceMails();
    if (res?.status === 200) {
      setVoiceMailData(res?.data?.data);
    }
    setMainLoading(false);
  };

  useEffect(() => {
    getVoiceMails();
  }, []);

  const moveToCaseDetail = (id) => {
    localStorage.setItem("route", "all-cases");
    navigate(`/all-cases/${id}`);
  };

  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        paddingLeft: "2rem",
        paddingRight: "2rem",
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: smallScreen ? "flex-start" : "flex-end",
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
          {AUTHORITY_TEXT} <span>{role}</span>
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: "1.5rem",
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
            Voicemail
          </Typography>
          <IconButton
            onClick={() => {
              getVoiceMails();
              setShowTranscript({});
            }}
          >
            <ReplayOutlined />
          </IconButton>
        </div>
      </Grid>
      <Card
        sx={{
          marginTop: "1.5rem",
          height: "70vh",
          borderRadius: "10px",
          backgroundColor: Colors.WHITE,
          width: "100%",
          padding: "10px",
        }}
      >
        {mainLoading ? (
          <Grid
            container
            sx={{
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress sx={{ color: Colors.SKY_BLUE }} size={70} />
          </Grid>
        ) : voiceMailData?.length === 0 ? (
          <Grid
            container
            sx={{
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
            >
              No Voice Mail Exists
            </Typography>
          </Grid>
        ) : (
          <Grid>
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "3.5rem",
                padding: "0px 1rem",
                borderRadius: "10px",
                alignItems: "center",
                backgroundColor: Colors.lIGHT_PURPLE,
              }}
            >
              <Typography sx={{ ...headingFontStyling, width: "20%" }}>
                Date
              </Typography>
              <Typography sx={{ ...headingFontStyling, width: "20%" }}>
                Client
              </Typography>
              <Typography sx={{ ...headingFontStyling, width: "20%" }}>
                Phone Number
              </Typography>
              <Typography sx={{ ...headingFontStyling, width: "30%" }}>
                Recording
              </Typography>
              <Typography sx={{ ...headingFontStyling, width: "10%" }}>
                Action
              </Typography>
            </div>
            <Grid
              sx={{
                height: "calc( 70vh - 3.5rem )",
                overflowY: "auto",
                padding: "10px 0px",
                ...ScrollbarStyles,
              }}
            >
              {voiceMailData?.voiceMails?.map((item) => (
                <>
                  <div style={divStyling}>
                    <Typography
                      sx={{
                        width: "20%",
                        fontFamily: "Nunito",
                        fontSize: FONT_SIZE_LARGE,
                      }}
                    >
                      {formatDateString(item?.createdAt) || "--"}
                    </Typography>
                    <Typography
                      sx={{
                        width: "20%",
                        fontFamily: "Nunito",
                        fontSize: FONT_SIZE_LARGE,
                      }}
                    >
                      {item?.callerName || "--"}
                    </Typography>
                    <Typography
                      sx={{
                        width: "20%",
                        fontFamily: "Nunito",
                        fontSize: FONT_SIZE_LARGE,
                      }}
                    >
                      {item?.callFrom?.replace("client:", "")?.trim() || "--"}
                    </Typography>
                    <div style={{ width: "30%" }}>
                      <audio
                        controls
                        style={{
                          width: "90%",
                          height: "2rem",
                          border: "1px solid gray",
                          borderRadius: "10px",
                        }}
                      >
                        <source src={item?.voicemailUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                    <Tooltip
                      title="View transcript and summary"
                      placement="top"
                    >
                      <IconButton
                        onClick={() => {
                          toggleTranscript(item?._id);
                          if (!showTranscript[item?._id]) {
                            handleFetch(item?.transcriptUrl, item?._id);
                          }
                        }}
                      >
                        {showTranscript[item?._id] ? (
                          <Close sx={{ color: Colors.ORANGE_COLOR }} />
                        ) : (
                          <Description sx={{ color: Colors.SKY_BLUE }} />
                        )}
                      </IconButton>
                    </Tooltip>
                    <MuiModels
                      disabled={item?.caseId}
                      show="saveCallInCase"
                      data={item}
                      getVoiceMails={getVoiceMails}
                    />
                    <Prompt
                      item={item?._id}
                      text="Are you sure you want to delete this voicemail?"
                      iconSize="1.5rem"
                      deleting="deleteVoiceMesssage"
                      getVoiceMails={getVoiceMails}
                    />
                    <Tooltip placement="top" title="View case detail">
                      <IconButton
                        disabled={!item?.caseId}
                        onClick={() => moveToCaseDetail(item?.caseId)}
                      >
                        <RemoveRedEye />
                      </IconButton>
                    </Tooltip>
                  </div>
                  {showTranscript[item?._id] && (
                    <>
                      <Box
                        sx={{
                          backgroundColor: "#f9f9f9",
                          p: "10px",
                          borderRadius: "10px",
                        }}
                      >
                        {loading?.[item?._id] ? (
                          <Grid
                            container
                            xs={12}
                            sx={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <CircularProgress
                              size={20}
                              sx={{ color: Colors.SKY_BLUE }}
                            />
                          </Grid>
                        ) : (
                          <>
                            <Typography
                              sx={{
                                fontFamily: "Nunito",
                                fontWeight: 600,
                                fontSize: FONT_SIZE_LARGE,
                              }}
                            >
                              Summary:
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                              <Typography
                                sx={{
                                  fontFamily: "Nunito",
                                  fontSize: FONT_SIZE_LARGE,
                                }}
                              >
                                {summary[item?._id]}
                              </Typography>
                            </Box>
                            <Divider sx={{ m: "10px 0px" }} />
                            <Typography
                              sx={{
                                fontFamily: "Nunito",
                                fontWeight: 600,
                                fontSize: FONT_SIZE_LARGE,
                                mb: 2,
                              }}
                            >
                              Transcript:
                            </Typography>
                            {sentences[item?._id]?.map((line, idx) => (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    width: "100%",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography
                                    key={idx}
                                    sx={{
                                      fontFamily: "Nunito",
                                      fontWeight: 600,
                                      fontSize: FONT_SIZE_LARGE,
                                    }}
                                  >
                                    {line?.media_channel === 1
                                      ? item?.callerName || "Caller"
                                      : "Receiver"}
                                    :
                                  </Typography>
                                  <Typography
                                    key={idx}
                                    sx={{
                                      fontFamily: "Nunito",
                                      fontSize: FONT_SIZE_MEDIUM,
                                    }}
                                  >
                                    {line?.start_time}s
                                  </Typography>
                                </div>
                                <Typography
                                  key={idx}
                                  sx={{
                                    mb: 2,
                                    fontFamily: "Nunito",
                                    fontSize: FONT_SIZE_LARGE,
                                  }}
                                >
                                  {line?.transcript}
                                </Typography>
                              </>
                            ))}
                          </>
                        )}
                      </Box>
                    </>
                  )}
                </>
              ))}
            </Grid>
          </Grid>
        )}
      </Card>
    </Grid>
  );
}

export default VoiceMail;
