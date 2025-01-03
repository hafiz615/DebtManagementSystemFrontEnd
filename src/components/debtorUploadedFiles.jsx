import { Button, Divider, Grid } from "@mui/material";
import React, { useState } from "react";
import ScrollbarStyles from "./customScroll";
import { Colors } from "../config/default";
import { RemoveRedEye } from "@mui/icons-material";

export default function DebtorUploadedFiles({ data }) {
  const [url, setUrl] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const bankDocuments = data?.debtor?.bankStatementDocuments || [];
  const mcaDocuments = data?.debtor?.mcaDocuments || [];
  const otherDocuments = data?.debtor?.otherDocuments || [];

  const handleFileView = (url) => {
    setUrl(url);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setUrl("");
    setIsViewerOpen(false);
  };

  const renderFiles = (files, label) => {
    if (files?.length > 0) {
      return (
        <React.Fragment>
          <p
            style={{
              fontWeight: "600",
              fontSize: "13px",
              fontFamily: "Nunito",
              margin: "0.5rem 0",
              color: Colors.DARK_GRAY,
            }}
          >
            {label}
          </p>
          {files.map((item, index) => (
            <Grid
              item
              xs={12}
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
          ))}
        </React.Fragment>
      );
    }
    return null;
  };

  const hasNoFiles =
    bankDocuments?.length === 0 &&
    mcaDocuments?.length === 0 &&
    otherDocuments?.length === 0;

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
        {renderFiles(mcaDocuments, "MCA's")}
        {renderFiles(bankDocuments, "Bank Statements")}
        {renderFiles(otherDocuments, "Others")}

        {hasNoFiles && (
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
