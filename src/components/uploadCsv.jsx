import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Typography, IconButton, Button } from "@mui/material";
import { Close } from "@mui/icons-material";

import { Colors } from "../config/default";

export default function UploadCsv({ handleModalClose }) {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "40vw",
        borderRadius: "10px",
        backgroundColor: Colors.WHITE,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "15px 15px 25px 15px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontWeight: "600" }}>Upload File</Typography>

        <IconButton onClick={handleModalClose}>
          <Close />
        </IconButton>
      </div>
      <div
        style={{
          display: "flex",
          width: "60%",
          margin: "10px 20%",
          border: "1px solid black",
          height: "30vh",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "15px",
          backgroundColor: Colors.LIGHT_BLUE_COLOR,
        }}
      >
        <Typography sx={{ fontWeight: "600" }}>file.csv</Typography>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1em",
        }}
      >
        <Button
          variant="contained"
          sx={{
            borderRadius: "10px",
            padding: "10px 20px",
            textTransform: "none",
          }}
          onClick={() => navigate("/bulk-cases")}
        >
          Upload File
        </Button>
      </div>
    </Box>
  );
}
