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
import { FONT_SIZE_LARGE, FONT_SIZE_SMALL } from "../constants/appConstants";

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
    const requiredHeaders = [
      "display_name",
      "primary_contact_primary_email",
      "custom.SSN",
      "status_label",
      "custom.Weekly Payment",
      "custom.Plaintiffs",
      "custom.EIN",
      "custom.ClearoutPhone Location",
      "description",
      "primary_contact_primary_phone",
      "url",
    ];

    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0];
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const csvData = results;
          const parsedHeaders = results.meta.fields;
          const missingHeaders = requiredHeaders?.filter(
            (header) => !parsedHeaders?.includes(header)
          );

          if (missingHeaders?.length > 0) {
            showToast(`CSV format is not correct.`, "error");
            setFilename(null);
            return;
          }
          const filledRows = csvData?.data?.filter((row) =>
            Object.values(row).some((value) => value)
          ).length;

          if (filledRows > 10) {
            showToast(
              "Uploaded CSV file can only accept 10 or less filled rows.",
              "error"
            );
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

  return (
    <Box
      sx={{
        width: extraSmallScreen ? "90%" : smallScreen ? "65vw" : "45vw",
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
          backgroundColor: Colors.VIOLET,
          cursor: "pointer",
          flexDirection: "column",
          padding: "0 2rem",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography sx={{ fontWeight: "600", fontFamily: "Nunito" }}>
            Drop the files here...
          </Typography>
        ) : (
          <Typography
            sx={{
              fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
              fontWeight: "600",
              fontFamily: "Nunito",
            }}
          >
            Drag & drop a CSV file here, or click to select files
          </Typography>
        )}
      </div>
      {filename && (
        <Typography
          sx={{
            marginTop: "1em",
            fontSize: FONT_SIZE_LARGE,
            textAlign: "center",
          }}
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
          disabled={!data}
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
