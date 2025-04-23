import React, { useState, useEffect } from "react";
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
} from "../services/services";
import { Device } from "@twilio/voice-sdk";
import { useDispatch, useSelector } from "react-redux";
import { Close, KeyboardVoice, MicOff } from "@mui/icons-material";
import { FONT_SIZE_LARGE, baseUrl } from "../constants/appConstants";
import { setDialState } from "../redux/action/action";
import AddIcon from "@mui/icons-material/Add";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import AddAnotherPerson from "./caseDetail/addAnotherPerson";
import { io } from "socket.io-client";

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

  const [openAddModal, setOpenAddModal] = useState(false);
  const [isAddModalMinimized, setIsAddModalMinimized] = useState(false);

  useEffect(() => {
    setOpenAddModal(true);
  }, []);

  useEffect(() => {
    setPhoneNumber(phoneNumberState);
  }, [phoneNumberState]);

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

  const [conferenceRoomData, setConferenceRoomData] = useState();
  const [conferenceSid, setConferenceSid] = useState("");

  const [participants, setParticipants] = useState([]);
  const [socket, setSocket] = useState(null);
  const BASE_URL = baseUrl();
  const updatedBaseUrl = BASE_URL?.replace(/\/api$/, "");

  useEffect(() => {
    const generatedConferenceName = `conf-${uuidv4()}`;
    setConferenceRoomData(generatedConferenceName);
  }, []);

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
      const conferenceSid = arg?.conferenceSid;
      const eventType = arg?.event;
      const sequenceNumber = arg?.sequenceNumber;

      if (conferenceSid) {
        setConferenceSid(conferenceSid);
        await getAllParticipant(conferenceSid);
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
  }, [phoneNumber]);

  const makeOutgoingCall = async () => {
    if (!device || !phoneNumber) {
      return;
    }
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
      setIsAddModalMinimized(false);
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
      setIsAddModalMinimized(false);
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
      dispatch(
        setDialState({
          isModalOpen: false,
        })
      );
    }
    fetchCalls && fetchCalls();
  };

  const muteCall = () => {
    if (!muted && call) {
      call.mute(true);
      setMuted(true);
    } else {
      call.mute(false);
      setMuted(false);
    }
  };

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
                    <IconButton onClick={muteCall}>
                      {muted ? <MicOff /> : <KeyboardVoice />}
                    </IconButton>
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

        <Box
          sx={{
            position: "fixed",
            bottom: "2%",
            right: "calc(350px - 1%)",
            width: isAddModalMinimized ? 250 : 350,
            height: isAddModalMinimized ? 70 : "auto",
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
          <Box
            sx={{
              display: "flex",
              justifyContent: isAddModalMinimized
                ? "space-between"
                : "flex-end",
              alignItems: "center",
            }}
          >
            {isAddModalMinimized ? (
              <Typography sx={{ fontWeight: 600 }}>Add Participants</Typography>
            ) : (
              ""
            )}

            <Box>
              <Tooltip
                title={
                  isAddModalMinimized ? "Maximize Screen" : "Minimize Screen"
                }
                placement="top-start"
              >
                <IconButton
                  onClick={() => setIsAddModalMinimized((prev) => !prev)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isAddModalMinimized ? (
                    <OpenInFullIcon />
                  ) : (
                    <CloseFullscreenIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {!isAddModalMinimized && (
            <AddAnotherPerson
              handleClose={() => setOpenAddModal(false)}
              conferenceRoomData={conferenceRoomData}
              participants={participants}
              setParticipants={setParticipants}
              getAllParticipant={getAllParticipant}
              conferenceSid={conferenceSid}
            />
          )}
        </Box>
      </>
    )
  );
};

export default DialPad;
