import React, { useState, useEffect } from "react";
import { Button, Grid, Box, Typography, IconButton } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { Colors } from "../config/default";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { GetCallToken } from "../services/services";
import { Device } from "@twilio/voice-sdk";
import { useSelector } from "react-redux";
import { Close } from "@mui/icons-material";
import { FONT_SIZE_LARGE } from "../constants/appConstants";

const DialPad = ({ data, caseId, handleClose, fetchCalls }) => {
  const [phoneNumber, setPhoneNumber] = useState(data || "");
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(null);
  const [device, setDevice] = useState(null);
  const [call, setCall] = useState(null);
  const userEmail = useSelector((state) => state?.signIn?.signIn?.user?.email);

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
      startCallTimer();
      setStartTimer(true);
    });

    newCall.on("disconnect", async () => {
      endCall();
      handleClose();
    });

    newCall.on("cancel", () => {
      endCall();
      handleClose();
    });
  };

  const startCallTimer = () => {
    setTimer(
      setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000)
    );
  };

  const endCall = () => {
    if (call) {
      call.disconnect();
      setIsCalling(false);
      setCall(null);
      clearInterval(timer);
      setCallDuration(0);
      setTimer(null);
      setStartTimer(false);
      handleClose();
    }
    fetchCalls && fetchCalls();
  };

  useEffect(() => {
    startupClient();

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  const textStyling = {
    fontSize: FONT_SIZE_LARGE,
    fontFamily: "Nunito",
    color: Colors.BLACK,
    fontWeight: "700",
  };

  return (
    <>
      <Box
        sx={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={textStyling}>Dial Pad</Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
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
                    height: 50,
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
        )}
      </Box>
    </>
  );
};

export default DialPad;
