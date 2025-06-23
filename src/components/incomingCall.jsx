import { useEffect, useState, useRef } from "react";
import { Box, Typography, Fade } from "@mui/material";
import { Audio, useNotification } from "@telnyx/react-client";
import { Colors } from "../config/default";
import { FONT_SIZE_LARGE } from "../constants/appConstants";
import TextButton from "./button";

// Styles
const containerStyles = {
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
};

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
  const [callActive, setCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  const notification = useNotification();
  const call = notification?.call;

  const timerRef = useRef(null);

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

  useEffect(() => {
    if (!call) return;

    if (call.direction === "inbound") {
      setIsModalOpen(true);
      playRingtone();
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
      setIsModalOpen(false);
    }

    return () => {
      stopRingtone();
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [call?.state]);

  const handleAnswer = () => {
    call?.answer();
    setCallActive(false);
  };

  const handleHangup = () => {
    call?.hangup();
    setCallActive(true);
    clearInterval(timerRef.current);
    setCallDuration(0);
  };

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  if (!isModalOpen || !call) return null;

  return (
    <Fade in={isModalOpen}>
      <Box sx={containerStyles}>
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
            onClick={handleHangup}
            backgroundColor={Colors.ORANGE_COLOR}
            hoverColor={Colors.ORANGE_COLOR}
          />
        </Box>

        {call?.remoteStream && <Audio stream={call.remoteStream} />}
      </Box>
    </Fade>
  );
}
