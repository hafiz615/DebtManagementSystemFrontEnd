import { Button, Divider, Grid } from "@mui/material";
import React, { useState } from "react";
import ScrollbarStyles from "./customScroll";
import { Colors } from "../config/default";
import { RemoveRedEye } from "@mui/icons-material";

export default function DebtorUploadedFiles({ data }) {
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
        padding: "10px",
        height: "100%",
        marginBottom: "0.5rem",
      }}
    >
      <p
        style={{
          fontWeight: "600",
          fontSize: "14px",
          fontFamily: "Nunito",
        }}
      >
        Files
      </p>
      <Divider />
      <Grid
        container
        sx={{
          overflowY: "auto",
          ...ScrollbarStyles,
          height: "10rem",
        }}
      >
        {data?.debtor?.documents?.length > 0 ? (
          data?.debtor?.documents?.map((item, index) => (
            <Grid
              container
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: index % 2 === 0 ? Colors.WHITE : Colors.VIOLET,
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
              <Grid item sx={{ display: "flex" }}>
                <RemoveRedEye
                  sx={{ color: Colors.SKY_BLUE, cursor: "pointer" }}
                  onClick={() => handleFileView(item?.url)}
                />
              </Grid>
            </Grid>
          ))
        ) : (
          <Grid item xs={12} sx={{ textAlign: "center", marginTop: "2rem" }}>
            <p
              style={{
                color: Colors.DIM_LIGHT_GRAY,
                fontFamily: "Nunito",
                fontSize: "13px",
              }}
            >
              No files available.
            </p>
          </Grid>
        )}
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
    </Grid>
  );
}
