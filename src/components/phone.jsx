import { useState, useContext, useEffect, useRef } from "react";
import { Audio, TelnyxRTCContext, useNotification } from "@telnyx/react-client";
import { Box, Button, Grid, IconButton } from "@mui/material";
import ReactPhoneInput from "react-phone-input-2";
import { Colors } from "../config/default";
import { Call, CallEnd, Close, Mic, MicOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setDialState } from "../redux/action/action";

function Phone({ user, caseId, phoneNumberState }) {
  const [destination, setDestination] = useState(phoneNumberState || "");
  const [callActive, setCallActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const client = useContext(TelnyxRTCContext);
  const notification = useNotification();
  const dispatch = useDispatch();
  const timerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCallActive(false);
    if (!client) {
      return;
    }
    try {
      const call = client.newCall({
        destinationNumber: destination.startsWith("+")
          ? destination
          : `+${destination}`,
        audio: true,
        video: false,
        callerNumber: "+14702030457",
        clientState: `${caseId}-${user?._id}`,
      });
    } catch (err) {
      console.error("Call error:", err);
    }
  };

  const call = notification?.call;

  const handleClose = () => {
    dispatch(
      setDialState({
        isModalOpen: false,
      })
    );
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    call?.setAudioMuted(newMuteState);
  };

  useEffect(() => {
    if (!call) return;
    if (call.state === "destroy" || call.state === "hangup") {
      setCallActive(true);
      handleClose();
    }
  }, [call?.state]);

  useEffect(() => {
    if (!call) return;

    if (call?.state === "active") {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    if (call?.state === "destroy") {
      clearInterval(timerRef.current);
      setCallDuration(0);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [call?.state]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
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
                  onClick={() => setDestination((prev) => prev + num)}
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

        {/* <IconButton onClick={toggleMute}>
          {isMuted ? <MicOff /> : <Mic />}
        </IconButton> */}

        {call && call.state !== "destroy" && (
          <IconButton
            color="error"
            onClick={() => {
              call.hangup();
              setCallActive(true);
              clearInterval(timerRef.current);
              setCallDuration(0);
            }}
          >
            <CallEnd />
          </IconButton>
        )}
      </form>

      {call?.remoteStream && <Audio stream={call.remoteStream} />}
    </div>
  );
}

export default Phone;
