import React, { useState, useEffect } from "react";
import { Button, Grid, Box, Typography } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { Colors } from "../config/default";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { GetCallToken } from "../services/services";
import { Device } from "@twilio/voice-sdk";

const DialPad = ({ data, handleClose }) => {
  const [phoneNumber, setPhoneNumber] = useState(data || "");
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(null);
  const [device, setDevice] = useState(null);
  const [token, setToken] = useState("");
  const [logMessages, setLogMessages] = useState([]);
  const [call, setCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [recordingUrl, setRecordingUrl] = useState("");
  const [transcript, setTranscript] = useState("");

  const log = (message) => {
    setLogMessages((prevLogs) => [...prevLogs, message]);
  };

  const initializeDevice = (token) => {
    log("Initializing device");
    const twilioDevice = new Device(token, {
      logLevel: 1,
      codecPreferences: ["opus", "pcmu"],
    });

    addDeviceListeners(twilioDevice);
    twilioDevice.register();
    setDevice(twilioDevice);
  };

  const addDeviceListeners = (twilioDevice) => {
    twilioDevice.on("registered", () => {
      log("Twilio.Device ready to make and receive calls!");
    });

    twilioDevice.on("error", (error) => {
      log(`Twilio.Device Error: ${error.message}`);
    });

    twilioDevice.on("incoming", (incomingCall) => {
      log(`Incoming call from ${incomingCall.parameters.From}`);
      setIncomingCall(incomingCall);
    });
  };

  const startupClient = async () => {
    log("Requesting Access Token...");
    try {
      const response = await GetCallToken();
      log("Got a token.");
      setToken(response.data.data.token);
      initializeDevice(response.data.data.token);
    } catch (err) {
      console.error(err);
      log("An error occurred. See the browser console for more information.");
    }
  };

  const makeOutgoingCall = async () => {
    if (!device || !phoneNumber) {
      log(
        "Unable to make call. Device is not initialized or phone number is missing."
      );
      return;
    }

    const params = { To: phoneNumber, record: true };
    log(`Attempting to call ${params.To}...`);
    setIsCalling(true);

    const newCall = await device.connect({ params });
    setCall(newCall);

    newCall.on("accept", () => {
      log("Call in progress...");
      setIsCalling(false);
      startCallTimer();
      setStartTimer(true);
    });

    newCall.on("disconnect", async () => {
      log("Call disconnected.");
      // await fetchRecording();
      endCall();
    });

    newCall.on("cancel", () => {
      log("Call canceled.");
      endCall();
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
  };

  // const fetchRecording = async () => {
  //   try {
  //     log("Fetching call recording...");
  //     const response = await GetRecordingTranscript(); // Fetch recording and transcript
  //     const { recordingUrl, transcript } = response.data;
  //     setRecordingUrl(recordingUrl);
  //     setTranscript(transcript);
  //     log("Recording and transcript fetched.");
  //   } catch (error) {
  //     console.error("Error fetching recording or transcript:", error);
  //     log("Failed to fetch recording or transcript.");
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

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
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
      {/* {startTimer && (
        <Typography
          sx={{ fontSize: "16px", fontFamily: "Nunito", mb: "10px" }}
          gutterBottom
          textAlign="center"
        >
          {`(${formatDuration(callDuration)})`}
        </Typography>
      )} */}

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

      {recordingUrl && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1">Recording:</Typography>
          <audio controls src={recordingUrl} style={{ width: "100%" }} />
        </Box>
      )}

      {transcript && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1">Transcript:</Typography>
          <Typography variant="body2">{transcript}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default DialPad;
