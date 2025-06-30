import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Fade,
  TextField,
  InputAdornment,
  Grid,
  Checkbox,
  IconButton,
} from "@mui/material";
import { Audio, useNotification } from "@telnyx/react-client";
import { Colors } from "../config/default";
import { FONT_SIZE_LARGE, FONT_SIZE_MEDIUM } from "../constants/appConstants";
import TextButton from "./button";
import { useSelector } from "react-redux";
import { Close, Search } from "@mui/icons-material";
import ScrollbarStyles from "./customScroll";
import { useToast } from "../toast/toastContext";
import {
  FindClientCreditorNumber,
  GetAllUserCases,
  UpdateCallByCase,
} from "../services/services";

// Styles

const boxStyling = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  gap: "10px",
};

const textStyle = { fontFamily: "Nunito" };
const nameNumberStyle = { fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE };

export default function IncomingCall() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caseMenuActive, setCaseMenuActive] = useState(false);
  const [callActive, setCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allCases, setAllCases] = useState({});
  const [selected, setSelected] = useState([]);
  const [selectedCase, setSelectedCase] = useState();
  const [telnyxSessionId, setTelnyxSessionId] = useState();
  const [hasRejected, setHasRejected] = useState(false);
  const [lastCallId, setLastCallId] = useState(null);

  const user = useSelector((state) => state?.signIn?.signIn?.user);
  const notification = useNotification();
  const call = notification?.call;
  const timerRef = useRef(null);
  const { showToast } = useToast();

  const containerStyles = {
    position: "fixed",
    bottom: "2%",
    right: "1%",
    width: caseMenuActive ? 600 : 380,
    bgcolor: Colors.lIGHT_PURPLE,
    borderRadius: "10px",
    boxShadow: 24,
    p: 2,
    border: `2px solid ${Colors.SKY_BLUE}`,
    textAlign: "center",
    zIndex: 1300,
    pointerEvents: "auto",
    animation: "blink-border 1s infinite alternate",
    "@keyframes blink-border": {
      "0%": { borderColor: Colors.SKY_BLUE },
      "100%": { borderColor: Colors.BG_LIGHT_GRAY },
    },
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleCaseCheckboxChange = (debtor) => {
    setSelectedCase(debtor);
    setSelected([]);
  };

  const handleCheckboxChange = (caseId) => {
    setSelected((prevSelected) =>
      prevSelected?.includes(caseId)
        ? prevSelected?.filter((id) => id !== caseId)
        : [...prevSelected, caseId]
    );
  };

  const getCreditorCompanies = async () => {
    const res = await GetAllUserCases();
    if (res?.status === 200) {
      setAllCases(res?.data?.data);
    }
  };

  const getClientCreditorNumberDetail = async (number) => {
    const res = await FindClientCreditorNumber(number);
    if (res?.status === 200) {
      const data = res?.data?.data;
      if (!data?.case && !data?.debtors) {
        setCaseMenuActive(true);
      } else if (!data?.case && data?.debtors) {
        setCaseMenuActive(true);
      } else {
        setIsModalOpen(false);
        setCaseMenuActive(false);
        setSelectedCase();
        setSelected([]);
      }
    }
  };

  const playRingtone = () => {
    const audio = document.getElementById("ringtone");
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((err) => {
        console.warn("Audio play failed (user interaction needed):", err);
      });
    }
  };

  const stopRingtone = () => {
    const audio = document.getElementById("ringtone");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const handleAnswer = () => {
    call?.answer();
    setCallActive(false);
    setTelnyxSessionId(call?.options?.telnyxSessionId);
    getCreditorCompanies();
  };

  const handleHangup = () => {
    call?.hangup();
    setCallActive(true);
    clearInterval(timerRef.current);
    setCallDuration(0);
  };

  const handleReject = () => {
    if (call?.hangup) {
      call.hangup();
    }
    setCallActive(true);
    clearInterval(timerRef.current);
    setCallDuration(0);
    setIsModalOpen(false);
    setCaseMenuActive(false);
    setHasRejected(true);
  };

  useEffect(() => {
    if (!call) return;

    if (
      call.direction === "inbound" &&
      `+${call?.options?.callerNumber}` === user?.twilioNo &&
      !isModalOpen &&
      !hasRejected
    ) {
      setCaseMenuActive(false);
      playRingtone();
      setIsModalOpen(true);
    }

    if (call.state === "active" && !timerRef.current) {
      stopRingtone();
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    if (["destroy", "hangup"].includes(call.state)) {
      stopRingtone();
      clearInterval(timerRef.current);
      timerRef.current = null;
      setCallDuration(0);
      setCallActive(true);
      getClientCreditorNumberDetail(call?.options?.callerNumber);
    }

    return () => {
      stopRingtone();
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [call?.state, hasRejected]);

  useEffect(() => {
    if (!call) return;
    const currentCallId = call?.options?.telnyxSessionId;

    if (currentCallId !== lastCallId) {
      setHasRejected(false);
      setLastCallId(currentCallId);
    }
  }, [call]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const filteredClientCompanies = Object.keys(allCases).filter((client) =>
    client.toLowerCase().includes(searchTerm)
  );

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      caseIds: selected,
    };
    const res = await UpdateCallByCase(payload, telnyxSessionId);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      setIsModalOpen(false);
      setCaseMenuActive(false);
      setSelectedCase();
      setSelected([]);
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  if (!isModalOpen || !call) return null;

  return (
    <Fade in={isModalOpen}>
      <Box sx={containerStyles}>
        {caseMenuActive ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ mb: 2, fontFamily: "Nunito" }}>
                Save Call Log
              </Typography>
              <IconButton
                onClick={() => {
                  setIsModalOpen(false);
                  setCaseMenuActive(false);
                  setSelectedCase();
                  setSelected([]);
                }}
              >
                <Close />
              </IconButton>
            </div>
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
                    <Search sx={{ color: Colors.SKY_BLUE }} />
                  </InputAdornment>
                ),
              }}
            />
            <Grid
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                height: "30vh",
                overflowY: "auto",
                ...ScrollbarStyles,
              }}
            >
              <div style={{ width: "48%" }}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    mb: "6px",
                    fontWeight: "600",
                  }}
                >
                  Client Company Name
                </Typography>

                {filteredClientCompanies?.length > 0 ? (
                  filteredClientCompanies.map((item, index) => (
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
              </div>

              <div style={{ width: "48%" }}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    mb: "6px",
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
            </Grid>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <TextButton
                buttonText="Save"
                height="2rem"
                width="10rem"
                onClick={handleSave}
                loading={loading}
                disabled={!selectedCase}
                backgroundColor={Colors.SKY_BLUE}
                hoverColor={Colors.SKY_BLUE}
              />
            </div>
          </>
        ) : (
          <>
            <Typography sx={{ ...textStyle, mb: 1, fontWeight: "bold" }}>
              Incoming Call
            </Typography>
            {call?.state === "active" && (
              <Typography sx={{ ...textStyle, mb: 1 }}>
                {formatTime(callDuration)}
              </Typography>
            )}
            <Typography sx={nameNumberStyle}>
              {call?.options?.remoteCallerName || "Unknown Caller"}
            </Typography>
            <Typography sx={nameNumberStyle}>
              {call?.options?.remoteCallerNumber?.startsWith("+1")
                ? call.options.remoteCallerNumber
                : `+1${call.options?.remoteCallerNumber || "Unknown"}`}
            </Typography>
            <Box mt={2} sx={boxStyling}>
              {callActive && (
                <TextButton
                  buttonText="Answer"
                  height="2rem"
                  width="8rem"
                  onClick={handleAnswer}
                  backgroundColor={Colors.SKY_BLUE}
                  hoverColor={Colors.SKY_BLUE}
                />
              )}
              <TextButton
                buttonText={callActive ? "Reject" : "End Call"}
                height="2rem"
                width="8rem"
                onClick={callActive ? handleReject : handleHangup}
                backgroundColor={Colors.ORANGE_COLOR}
                hoverColor={Colors.ORANGE_COLOR}
              />
            </Box>

            {call?.remoteStream && <Audio stream={call.remoteStream} />}
          </>
        )}
      </Box>
    </Fade>
  );
}
