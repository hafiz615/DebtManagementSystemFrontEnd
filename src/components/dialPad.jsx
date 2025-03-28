import React, { useState, useEffect } from "react";
import { Button, Grid, Box, Typography, IconButton, Fade } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { Colors } from "../config/default";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { GetCallToken } from "../services/services";
import { Device } from "@twilio/voice-sdk";
import { useDispatch, useSelector } from "react-redux";
import { Close, KeyboardVoice, MicOff } from "@mui/icons-material";
import { FONT_SIZE_LARGE } from "../constants/appConstants";
import { setDialState } from "../redux/action/action";

const DialPad = () => {
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

  const makeOutgoingCall = async () => {
    if (!device || !phoneNumber) {
      return;
    }
    const params = {
      To: `+${phoneNumber}`,
      record: true,
      CaseId: caseId,
      email: userEmail,
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
                <Box>
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
    )
  );
};

export default DialPad;
