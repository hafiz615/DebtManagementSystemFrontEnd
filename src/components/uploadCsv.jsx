import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

import { Box, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";

import Papa from "papaparse";
import { Colors } from "../config/default";
import { useToast } from "../toast/toastContext";
import TextButton from "./button";

export default function UploadCsv({ handleModalClose }) {
  const navigate = useNavigate();
  const [filename, setFilename] = useState(null);
  const [data, setData] = useState(null);
  const { showToast } = useToast();

  const smallScreen = useMediaQuery("(min-width:900px) and (max-width:1200px)");
  const extraSmallScreen = useMediaQuery(
    "(min-width:300px) and (max-width:900px)"
  );

  const onDrop = (acceptedFiles, fileRejections) => {
    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0];
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const csvData = results;
          if (results.meta.fields[0] !== "debtor_name") {
            showToast("CSV format is not correct.", "error");
            setData(null);
            setFilename(null);
            return;
          }
          setFilename(file.name);
          setData(csvData);
          const numColumns = results.meta.fields.length;
          localStorage.setItem("Columns", numColumns);
          localStorage.setItem("csvData", JSON.stringify(csvData));
        },
        error: (err) => {
          showToast("Error parsing CSV file.", "error");
          setFilename(null);
        },
      });
    }
    if (fileRejections?.length > 0) {
      setFilename(null);
      showToast("Please upload a valid CSV file.", "error");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
  });

  const handleUpload = () => {
    if (data) {
      localStorage.setItem("route", "bulk-cases");
      navigate("/bulk-cases");

      handleModalClose();
    } else {
      showToast("Please upload a CSV file first.", "error");
    }
  };
  const isDisabled = !data;

  return (
    <Box
      sx={{
        width: extraSmallScreen ? "90%" : smallScreen ? "70vw" : "45vw",
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
        {...getRootProps()}
        style={{
          display: "flex",
          width: "60%",
          margin: "10px 20%",
          border: "1px solid black",
          height: "35vh",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "15px",
          backgroundColor: Colors.LIGHT_BLUE_COLOR,
          cursor: "pointer",
          flexDirection: "column",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography sx={{ fontWeight: "600", fontFamily: "Nunito" }}>
            Drop the files here...
          </Typography>
        ) : (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "600", fontFamily: "Nunito" }}
          >
            Drag & drop a CSV file here, or click to select files
          </Typography>
        )}
      </div>
      {filename && (
        <Typography
          sx={{ marginTop: "1em", fontSize: "14px", textAlign: "center" }}
        >
          {filename}
        </Typography>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1em",
        }}
      >
        <TextButton
          disabled={isDisabled}
          buttonText="Upload"
          height="2rem"
          width="8rem"
          onClick={handleUpload}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      </div>
    </Box>
  );
}
