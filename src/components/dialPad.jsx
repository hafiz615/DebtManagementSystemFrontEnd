import React, { useState, useEffect } from "react";
import { Button, Grid, Box, Typography } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { Colors } from "../config/default";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { DialCall } from "../services/services";

const DialPad = ({ caseId, data, handleClose }) => {
  const [phoneNumber, setPhoneNumber] = useState(data || "");
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [timer, setTimer] = useState(null);

  const handleNumberClick = (num) => {
    setPhoneNumber((prev) => prev + num);
  };

  const handleCall = async () => {
    if (phoneNumber) {
      setIsCalling(true);
      setCallDuration(0);
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      setTimer(interval);
      //   const payload = {
      //     toNumber: phoneNumber,
      //   };
      //   const res = await DialCall(payload, caseId);
      //   if (res?.status === 200) {
      //   }
    }
  };

  const handleEndCall = () => {
    setIsCalling(false);
    handleClose();
    setPhoneNumber("");
    clearInterval(timer);
    setCallDuration(0);
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <>
      <Box>
        <Typography
          sx={{ fontSize: "16px", fontFamily: "Nunito", mb: "10px" }}
          gutterBottom
          textAlign="center"
        >
          {isCalling ? `Calling...` : "Dial or Enter a Phone Number"}
        </Typography>
        {isCalling && (
          <Typography
            sx={{ fontSize: "16px", fontFamily: "Nunito", mb: "10px" }}
            gutterBottom
            textAlign="center"
          >
            {`(${formatDuration(callDuration)})`}
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          <ReactPhoneInput
            country={"us"}
            value={phoneNumber}
            onChange={setPhoneNumber}
            onlyCountries={["us"]}
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
                  onClick={() => handleNumberClick(num.toString())}
                >
                  {num}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {!isCalling ? (
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
            onClick={handleCall}
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
            onClick={handleEndCall}
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
