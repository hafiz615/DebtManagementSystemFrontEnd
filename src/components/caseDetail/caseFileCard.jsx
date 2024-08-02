import React, { useState } from "react";
import { Grid, Box, Button } from "@mui/material";
import { Colors } from "../../config/default";
import MuiModels from "../models";
import { RemoveRedEye } from "@mui/icons-material";

function CaseFileCard({ caseData, GetCaseDetails }) {
  const [url, setUrl] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleFileView = (url) => {
    setUrl(url);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setUrl("");
    setIsViewerOpen(false);
  };

  return (
    <Grid
      item
      xs={12}
      sx={{
        backgroundColor: Colors.WHITE,
        borderRadius: "10px",
        padding: "0px 10px",
        height: "13rem",
        marginBottom: "0.5rem",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "5px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#E5E5E5",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: Colors.WHITE,
          borderRadius: "8px",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontWeight: "600",
            fontSize: "13px",
            fontFamily: "Nunito",
          }}
        >
          Files
        </p>
        <Box sx={{ marginTop: "0.5rem" }}>
          <MuiModels
            show="uploadFile"
            height="max-content"
            GetCaseDetails={GetCaseDetails}
          />
        </Box>
      </div>
      {caseData?.debtor?.documents?.map((item, index) => (
        <Grid
          container
          key={index}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor:
              index % 2 === 0 ? Colors.WHITE : "rgba(85, 148, 242, 0.06)",
            paddingRight: ".2rem",
            paddingLeft: ".2rem",
            height: "2rem",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: Colors.DIM_LIGHT_GRAY,
              fontWeight: "700",
              fontFamily: "Nunito",
              fontSize: "11px",
            }}
          >
            {item?.originalFileName}
          </span>
          <RemoveRedEye
            sx={{ color: Colors.SKY_BLUE, cursor: "pointer" }}
            onClick={() => handleFileView(item?.url)}
          />
        </Grid>
      ))}

      {isViewerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <Button
            onClick={handleCloseViewer}
            style={{
              position: "fixed",
              top: "5rem",
              right: "1rem",
              backgroundColor: "white",
              border: "none",
              borderRadius: "4px",
              padding: "0.5rem",
              cursor: "pointer",
              zIndex: 1100,
            }}
          >
            Close
          </Button>
          {url ? (
            <iframe
              title="document"
              src={url}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                position: "relative",
              }}
            />
          ) : (
            <p style={{ color: "white" }}>Loading...</p>
          )}
        </div>
      )}
    </Grid>
  );
}

export default CaseFileCard;
