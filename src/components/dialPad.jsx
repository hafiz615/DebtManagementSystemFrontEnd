import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  Fade,
  Tooltip,
  Modal,
} from "@mui/material";
import { useToast } from "../toast/toastContext";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { Colors } from "../config/default";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  CreateParticipant,
  GetCallToken,
  GetAllParticipant,
  EndConference,
  GetAllUsersNumbers,
} from "../services/services";
import { Device } from "@twilio/voice-sdk";
import { useDispatch, useSelector } from "react-redux";
import { Close, KeyboardVoice, MicOff } from "@mui/icons-material";
import { FONT_SIZE_LARGE, baseUrl } from "../constants/appConstants";
import { setDialState } from "../redux/action/action";
import AddIcon from "@mui/icons-material/Add";
import AddAnotherPerson from "./caseDetail/addAnotherPerson";
import { io } from "socket.io-client";

// dev to main
const DialPad = () => {
  const { showToast } = useToast();
  const phoneNumberState = useSelector((state) => state?.dial?.phoneNumber);
  const caseId = useSelector((state) => state?.dial?.caseId);
  const modalState = useSelector((state) => state?.dial?.isModalOpen);
  const fetchCalls = useSelector((state) => state?.dial?.fetchCalls);
  const userEmail = useSelector((state) => state?.signIn?.signIn?.user?.email);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(null);
  const [device, setDevice] = useState(null);
  const [call, setCall] = useState(null);
  const [muted, setMuted] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (modalState) {
      setPhoneNumber(phoneNumberState || "");
    }
  }, [modalState, phoneNumberState]);

  const initializeDevice = (token) => {
    const twilioDevice = new Device(token, {
      logLevel: 1,
      codecPreferences: ["opus", "pcmu"],
    });

    twilioDevice.register();
    setDevice(twilioDevice);
  };

  const startupClient = async () => {
    try {
      const response = await GetCallToken();
      initializeDevice(response.data.data.token);
    } catch (err) {}
  };

  const handleClose = () => {
    dispatch(
      setDialState({
        isModalOpen: false,
      })
    );
  };
  const [userNumbers, setUsersNumbers] = useState([]);

  const getAllUsersNumber = async () => {
    const res = await GetAllUsersNumbers();
    setUsersNumbers(res?.data?.data);
  };
  useEffect(() => {
    getAllUsersNumber();
  }, []);

  const [openAddModal, setOpenAddModal] = useState(false);

  const [conferenceSid, setConferenceSid] = useState("");
  const [participants, setParticipants] = useState([]);
  const [socket, setSocket] = useState(null);
  const BASE_URL = baseUrl();
  const updatedBaseUrl = BASE_URL?.replace(/\/api$/, "");
  const countRef = useRef(0);

  const getAllParticipant = async (conferenceSid) => {
    const params = { conferenceSid };
    const res = await GetAllParticipant(params);
    setParticipants(res?.data?.data?.participants);
  };

  const createParticipant = async (phoneNumber, conferenceSid) => {
    const params = {
      to: phoneNumber,
      conferenceSid,
    };
    const res = await CreateParticipant(params);
    if (res?.status === 201) {
      showToast(res?.data?.message, "success");
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  useEffect(() => {
    const socketInstance = io(updatedBaseUrl);
    setSocket(socketInstance);

    socketInstance.on("conferenceEvent", async (arg) => {
      const callStatus = arg?.callStatus;
      const conferenceSid = arg?.conferenceSid;
      const eventType = arg?.event;
      const sequenceNumber = arg?.sequenceNumber;

      if (conferenceSid) {
        setConferenceSid(conferenceSid);
        getAllParticipant(conferenceSid);

        if (eventType === "participant-join") {
          countRef.current += 1;
          if (countRef.current === 2) {
            setOpenAddModal(true);
          }
        }

        if (eventType === "participant-leave") {
          countRef.current -= 1;
          if (countRef.current === 1) {
            deleteConferenceCall(conferenceSid);
          }
        }

        if (
          (countRef.current === 0 && callStatus === "busy") ||
          callStatus === "no-answer"
        ) {
          countRef.current -= 1;
          deleteConferenceCall(conferenceSid);
        }

        if (eventType === "participant-join" && sequenceNumber === "1") {
          if (phoneNumber) {
            await createParticipant(phoneNumber, conferenceSid);
          } else {
            showToast("Phone number is not set", "error");
          }
        }
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [phoneNumber, phoneNumberState]);

  const makeOutgoingCall = async () => {
    countRef.current = 0;
    if (!device || !phoneNumber) {
      return;
    }
    const conferenceRoomData = `conf-${uuidv4()}`;
    const params = {
      To: `+${phoneNumber}`,
      record: true,
      CaseId: caseId,
      email: userEmail,
      ConferenceName: conferenceRoomData,
    };
    setIsCalling(true);
    const newCall = await device.connect({ params });
    setCall(newCall);
    newCall.on("accept", () => {
      setIsCalling(false);
      setStartTimer(true);
    });

    newCall.on("disconnect", async () => {
      endCall();
      dispatch(
        setDialState({
          isModalOpen: false,
        })
      );
      setIsCalling(false);
      setStartTimer(false);
      setMuted(false);
      setOpenAddModal(false);
    });

    newCall.on("cancel", () => {
      endCall();
      dispatch(
        setDialState({
          isModalOpen: false,
        })
      );
      setIsCalling(false);
      setStartTimer(false);
      setMuted(false);
      setOpenAddModal(false);
    });
  };

  const endCall = () => {
    if (call) {
      call.disconnect();
      setIsCalling(false);
      setCall(null);
      clearInterval(timer);
      setTimer(null);
      setStartTimer(false);
      setMuted(false);
      deleteConferenceCall(conferenceSid);
      dispatch(
        setDialState({
          isModalOpen: false,
        })
      );
    }
    fetchCalls && fetchCalls();
  };

  const deleteConferenceCall = async (conferenceSid) => {
    const payload = {
      conferenceSid: conferenceSid,
    };
    const res = await EndConference(payload);
    if (res?.status === 200) {
      setIsCalling(false);
      setCall(null);
      clearInterval(timer);
      setTimer(null);
      setStartTimer(false);
      setMuted(false);
      dispatch(
        setDialState({
          isModalOpen: false,
        })
      );
    }
  };

  // const muteCall = () => {
  //   if (!muted && call) {
  //     call.mute(true);
  //     setMuted(true);
  //   } else {
  //     call.mute(false);
  //     setMuted(false);
  //   }
  // };

  useEffect(() => {
    startupClient();
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const textStyling = {
    fontSize: FONT_SIZE_LARGE,
    fontFamily: "Nunito",
    color: Colors.BLACK,
    fontWeight: "700",
  };

  return (
    modalState && (
      <>
        <Fade in={modalState}>
          <Box
            sx={{
              position: "fixed",
              bottom: "2%",
              right: "1%",
              border: "5px solid red",
              width: 300,
              bgcolor: Colors.lIGHT_PURPLE,
              borderRadius: "10px",
              boxShadow: 24,
              p: 2,
              border: `2px solid ${Colors.SKY_BLUE}`,
              textAlign: "center",
              zIndex: 1300,
              pointerEvents: "auto",
            }}
          >
            <Box
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={textStyling}>Dial Pad</Typography>
              {!isCalling && !startTimer && (
                <IconButton onClick={handleClose}>
                  <Close />
                </IconButton>
              )}
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "16px", fontFamily: "Nunito", mb: "10px" }}
                gutterBottom
                textAlign="center"
              >
                {isCalling
                  ? `Calling...`
                  : startTimer
                  ? "Ringing..."
                  : "Dial or Enter a Phone Number"}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <ReactPhoneInput
                  country={"us"}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  inputStyle={{
                    padding: "1rem 3rem",
                    width: "100%",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    fontFamily: "Nunito",
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"]?.map((num) => (
                    <Grid item xs={4} key={num}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          fontFamily: "Nunito",
                          height: 40,
                          borderColor: Colors.SKY_BLUE,
                          color: Colors.SKY_BLUE,
                        }}
                        onClick={() => setPhoneNumber((prev) => prev + num)}
                      >
                        {num}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {!isCalling && !startTimer ? (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: Colors.SKY_BLUE,
                    borderRadius: "10px",
                    fontFamily: "Nunito",
                    "&:hover": {
                      background: Colors.SKY_BLUE,
                    },
                  }}
                  startIcon={<CallIcon />}
                  onClick={makeOutgoingCall}
                  fullWidth
                >
                  Call
                </Button>
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: ".5rem",
                    }}
                  >
                    {/* <IconButton onClick={muteCall}>
                      {muted ? <MicOff /> : <KeyboardVoice />}
                    </IconButton> */}
                    {openAddModal && (
                      <Tooltip title="Add Participant" placement="top-start">
                        <IconButton onClick={() => setOpenAddModal(true)}>
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  <Button
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: "10px", fontFamily: "Nunito" }}
                    startIcon={<CallEndIcon />}
                    onClick={endCall}
                    fullWidth
                  >
                    End Call
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Fade>

        {openAddModal && (
          <Box
            sx={{
              position: "fixed",
              bottom: "2%",
              right: "calc(350px - 1%)",
              width: 350,
              height: "auto",
              bgcolor: Colors.lIGHT_PURPLE,
              borderRadius: "10px",
              boxShadow: 24,
              p: 2,
              border: `2px solid ${Colors.SKY_BLUE}`,
              textAlign: "center",
              zIndex: 1300,
              pointerEvents: "auto",
              overflow: "hidden",
            }}
          >
            <AddAnotherPerson
              handleClose={() => setOpenAddModal(false)}
              participants={participants}
              setParticipants={setParticipants}
              getAllParticipant={getAllParticipant}
              conferenceSid={conferenceSid}
              endCall={endCall}
              userNumbers={userNumbers}
              setUsersNumbers={setUsersNumbers}
            />
          </Box>
        )}
      </>
    )
  );
};

export default DialPad;
