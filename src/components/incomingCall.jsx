import React from "react";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";

import {
  Button,
  Grid,
  Box,
  Typography,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { Colors } from "../config/default";

export default function IncomingCall({
  incomingCall,
  setIncomingCall,
  isModalOpen,
  setIsModalOpen,
  callDuration,
  setCallDuration,
  callInterval,
  setCallInterval,
}) {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const acceptIncomingCall = () => {
    if (incomingCall) {
      incomingCall.accept();
      setIncomingCall(null);
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
    }
  };

  const endCall = () => {
    if (incomingCall) {
      incomingCall.disconnect();
      clearInterval(callInterval);
      setCallInterval(null);
      setCallDuration(0);
      setIsModalOpen(false);
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={rejectIncomingCall}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={isModalOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
            border: "none",
            textAlign: "center",
          }}
        >
          {!callInterval && (
            <Typography variant="h6" sx={{ mb: 2, fontFamily: "Nunito" }}>
              Incoming Call
            </Typography>
          )}

          <Typography variant="body1" sx={{ mb: 3, fontFamily: "Nunito" }}>
            {incomingCall?.parameters?.From || "Unknown Caller"}
          </Typography>
          {callInterval ? (
            <Box>
              <Typography variant="body1" sx={{ mb: 3, fontFamily: "Nunito" }}>
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
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={6}>
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
              <Grid item xs={6}>
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
        </Box>
      </Fade>
    </Modal>
  );
}
