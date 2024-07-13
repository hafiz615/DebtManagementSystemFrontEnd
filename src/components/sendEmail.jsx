import React, { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { useToast } from "../toast/toastContext";
import { Colors } from "../config/default";
import TextButton from "./button";

const lineStyle = {
  width: "100%",
  height: "1px",
  backgroundColor: "#EAEBEB",
  margin: "1rem 0",
};

export default function SendEmail({ handleClose }) {
  const [sendTo, setSendTo] = useState("");
  const [subject, setSubject] = useState("");
  const [preview, setPreview] = useState("");
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  //   const handleSend = async () => {
  //     setLoading(true);
  //     const params = {
  //       email: sendTo,
  //       subject: subject,
  //       preview: preview,
  //     };
  //     const resEmail = await UpdateStatusPipeline(params);
  //     if (resEmail?.status === 200) {
  //       showToast(resEmail?.data?.message, "success");
  //     } else {
  //       const errorMessage = resEmail?.response?.data?.message;
  //       showToast(errorMessage, "error");
  //     }
  //     setLoading(false);
  //     handleClose();
  //   };

  const disable = !sendTo || !subject || !preview;

  return (
    <>
      <Grid item>
        <Typography
          sx={{ fontWeight: "500", fontFamily: "Nunito", color: Colors.BLACK }}
        >
          Send Email
        </Typography>
        <Box sx={lineStyle} />
      </Grid>

      <input
        type="text"
        placeholder="Send To"
        value={sendTo}
        onChange={(e) => setSendTo(e.target.value)}
        style={{
          backgroundColor: Colors.BG_LIGHT_GRAY,
          marginTop: "1rem",
          marginBottom: "1rem",
          height: "2.5rem",
          color: Colors.DIM_LIGHT_GRAY,
          paddingLeft: "1rem",
          border: "none",
          outline: "none",
          borderRadius: "5px",
          width: "100%",
        }}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{
          backgroundColor: Colors.BG_LIGHT_GRAY,
          marginBottom: "1rem",
          height: "2.5rem",
          color: Colors.DIM_LIGHT_GRAY,
          paddingLeft: "1rem",
          border: "none",
          outline: "none",
          borderRadius: "5px",
          width: "100%",
        }}
      />
      <textarea
        placeholder="Preview"
        rows="10"
        style={{
          fontFamily: "Nunito",
          backgroundColor: Colors.BG_LIGHT_GRAY,
          border: "none",
          outline: "none",
          minWidth: "100%",
          maxWidth: "100%",
          padding: "1rem",
          borderRadius: "10px",
        }}
        value={preview}
        onChange={(e) => setPreview(e.target.value)}
      />

      <Box sx={lineStyle} />
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}
      >
        <TextButton
          buttonText="CANCEL"
          height="2rem"
          marginRight="1rem"
          width="6rem"
          onClick={handleClose}
          backgroundColor={Colors.ORANGE_COLOR}
          hoverColor={Colors.ORANGE_COLOR}
        />
        <TextButton
          buttonText="SEND"
          height="2rem"
          width="6rem"
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          //   onClick={handleSend}
          disabled={disable}
          loading={loading}
        />
      </Box>
    </>
  );
}
