import React, { useEffect, useState } from "react";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import {
  Button,
  Grid,
  Box,
  Typography,
  Fade,
  Checkbox,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Colors } from "../config/default";
import TextButton from "./button";
import { UpdateCallByCase } from "../services/services";
import { useToast } from "../toast/toastContext";
import { FONT_SIZE_LARGE, FONT_SIZE_MEDIUM } from "../constants/appConstants";
import ScrollbarStyles from "./customScroll";
import { KeyboardVoice, MicOff } from "@mui/icons-material";

export default function IncomingCall({
  incomingCall,
  setIncomingCall,
  isModalOpen,
  setIsModalOpen,
  callDuration,
  setCallDuration,
  callInterval,
  setCallInterval,
  allCases,
  callSid,
  caseMenuActive,
  setCaseMenuActive,
  callerName,
}) {
  const [selected, setSelected] = useState([]);
  const [selectedCase, setSelectedCase] = useState();
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // <-- Added for search
  const { showToast } = useToast();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleCaseCheckboxChange = (debtor) => {
    setSelectedCase(debtor);
  };

  const handleCheckboxChange = (caseId) => {
    setSelected((prevSelected) =>
      prevSelected?.includes(caseId)
        ? prevSelected?.filter((id) => id !== caseId)
        : [...prevSelected, caseId]
    );
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const acceptIncomingCall = () => {
    if (incomingCall) {
      incomingCall.accept();
      setCallDuration(0);
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      setCallInterval(interval);
    }
  };

  const rejectIncomingCall = () => {
    if (incomingCall) {
      incomingCall.reject();
      setIncomingCall(null);
      setIsModalOpen(false);
      clearInterval(callInterval);
      setCallInterval(null);
      setCaseMenuActive(false);
      setMuted(false);
    }
  };

  const endCall = () => {
    if (incomingCall) {
      incomingCall.disconnect();
      clearInterval(callInterval);
      setCallInterval(null);
      setCallDuration(0);
      setMuted(false);
      if (!callerName) {
        setCaseMenuActive(true);
      } else if (!callerName?.caseId && callerName?.debtorId) {
        setCaseMenuActive(true);
      } else if (!callerName?.caseId && callerName?.debtorId) {
        setCaseMenuActive(true);
      } else {
        setCaseMenuActive(false);
        setIsModalOpen(false);
      }
    }
  };

  const muteCall = () => {
    if (!muted && incomingCall) {
      incomingCall.mute(true);
      setMuted(true);
    } else {
      incomingCall.mute(false);
      setMuted(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      caseIds: selected,
    };
    const res = await UpdateCallByCase(payload, callSid);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      setIsModalOpen(false);
      setCaseMenuActive(false);
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    setSelected([]);
  }, [selectedCase]);

  const filteredClientCompanies = Object.keys(allCases).filter((client) =>
    client.toLowerCase().includes(searchTerm)
  );

  return (
    isModalOpen && (
      <Fade in={isModalOpen}>
        <Box
          sx={{
            position: "fixed",
            bottom: "2%",
            right: "1%",
            width: 380,
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
          }}
        >
          {caseMenuActive ? (
            <>
              <Typography sx={{ mb: 2, fontFamily: "Nunito" }}>
                Save Call Log
              </Typography>

              {/* 🔍 Search Field */}
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
              {!callInterval && (
                <Typography
                  variant="h6"
                  sx={{ mb: "6px", fontFamily: "Nunito" }}
                >
                  Incoming Call
                </Typography>
              )}
              <Typography variant="body1" sx={{ fontFamily: "Nunito" }}>
                {callerName?.debtorName ||
                  callerName?.creditorName ||
                  "Unknown Caller"}
              </Typography>
              {callerName?.companyName && (
                <Typography variant="body1" sx={{ fontFamily: "Nunito" }}>
                  {callerName?.companyName}
                </Typography>
              )}
              <Typography variant="body1" sx={{ mb: 3, fontFamily: "Nunito" }}>
                {incomingCall?.parameters?.From?.replace(/^client:/, "")}
              </Typography>
              {callInterval ? (
                <>
                  <Box>
                    <IconButton onClick={muteCall}>
                      {muted ? <MicOff /> : <KeyboardVoice />}
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ mb: 3, fontFamily: "Nunito" }}
                    >
                      {formatDuration(callDuration)}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={endCall}
                      sx={{
                        fontFamily: "Nunito",
                        borderRadius: "10px",
                        backgroundColor: Colors.ORANGE_COLOR,
                        textTransform: "none",
                        "&:hover": {
                          background: Colors.ORANGE_COLOR,
                        },
                      }}
                      startIcon={<CallEndIcon />}
                    >
                      End Call
                    </Button>
                  </Box>
                </>
              ) : (
                <Grid
                  xs={12}
                  item
                  container
                  sx={{ p: "0px 20px", justifyContent: "space-between" }}
                >
                  <Grid item xs={5.75}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        fontFamily: "Nunito",
                        borderRadius: "10px",
                        backgroundColor: Colors.SKY_BLUE,
                        textTransform: "none",
                        "&:hover": {
                          background: Colors.SKY_BLUE,
                        },
                      }}
                      onClick={acceptIncomingCall}
                      startIcon={<CallIcon />}
                    >
                      Accept
                    </Button>
                  </Grid>
                  <Grid item xs={5.75}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        fontFamily: "Nunito",
                        borderRadius: "10px",
                        backgroundColor: Colors.ORANGE_COLOR,
                        textTransform: "none",
                        "&:hover": {
                          background: Colors.ORANGE_COLOR,
                        },
                      }}
                      onClick={rejectIncomingCall}
                      startIcon={<CallEndIcon />}
                    >
                      Reject
                    </Button>
                  </Grid>
                </Grid>
              )}
            </>
          )}
        </Box>
      </Fade>
    )
  );
}
