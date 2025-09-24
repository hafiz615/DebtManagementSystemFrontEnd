import { useState, useContext, useEffect, useRef } from "react";
import { Audio, TelnyxRTCContext, useNotification } from "@telnyx/react-client";
import { Box, Button, Grid, IconButton } from "@mui/material";
import ReactPhoneInput from "react-phone-input-2";
import { Colors } from "../config/default";
import { Call, CallEnd, Close } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setDialState } from "../redux/action/action";

function Phone({ user, fromNumber, caseId, phoneNumberState }) {
  const [destination, setDestination] = useState(phoneNumberState || "");
  const [callActive, setCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  const client = useContext(TelnyxRTCContext);
  const notification = useNotification();
  const dispatch = useDispatch();
  const timerRef = useRef(null);

  const call = notification?.call;

  const handleSubmit = (e) => {
    e.preventDefault();
    setCallActive(false);
    if (!client) return;

    try {
      client.newCall({
        destinationNumber: destination.startsWith("+")
          ? destination
          : `+${destination}`,
        audio: true,
        video: false,
        callerNumber: fromNumber,
        clientState: `${caseId}-${user?._id}`,
        dtmfType: "SIP_INFO",
      });
    } catch (err) {
      console.error("Call error:", err);
      setCallActive(true);
    }
  };

  const handleClose = () => {
    dispatch(setDialState({ isModalOpen: false }));
  };

  useEffect(() => {
    if (!call) return;

    if (call.state === "active") {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    if (["destroy", "hangup"].includes(call.state)) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setCallDuration(0);
      setCallActive(true);
      handleClose();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [call?.state]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const sendDTMF = (digit) => {
    if (call?.state === "active") {
      try {
        if (typeof call.dtmf === "function") {
          call.dtmf(String(digit));
        } else {
          console.warn("DTMF not supported on this call object");
        }
      } catch (err) {
        console.error("Error sending DTMF:", err);
      }
    } else {
      console.warn("No active call to send DTMF");
    }
  };

  const handleKeypadPress = (num) => {
    if (call?.state === "active") {
      sendDTMF(num);
    } else {
      setDestination((prev) => prev + num);
    }
  };

  const handleHangup = () => {
    try {
      if (call && typeof call.hangup === "function") {
        call.hangup();
      }
    } catch (err) {
      console.error("Error hanging up:", err);
    } finally {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setCallActive(true);
      setCallDuration(0);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <strong style={{ fontFamily: "Nunito" }}>Dial Pad</strong>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </div>

      {call?.state === "active" && (
        <div style={{ fontFamily: "Nunito", marginBottom: "10px" }}>
          {formatTime(callDuration)}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <ReactPhoneInput
            country={"us"}
            value={destination}
            onChange={setDestination}
            disabled={call?.state === "active"}
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((num) => (
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
                  onClick={() => handleKeypadPress(num)}
                >
                  {num}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {callActive && (
          <IconButton type="submit" color="primary">
            <Call />
          </IconButton>
        )}

        {call && call.state !== "destroy" && (
          <IconButton color="error" onClick={handleHangup}>
            <CallEnd />
          </IconButton>
        )}
      </form>

      {call?.remoteStream && <Audio stream={call.remoteStream} />}
    </div>
  );
}

export default Phone;
