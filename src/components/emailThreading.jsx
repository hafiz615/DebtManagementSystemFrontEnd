import React, { useState } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { Colors } from "../config/default";
import { Attachment } from "@mui/icons-material";

const EmailThreading = ({ email }) => {
  const [showAll, setShowAll] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [fileUrl, setFileUrl] = useState();

  const thread = email?.previousMessages || [];
  const visibleMessages = showAll ? thread : thread?.slice(0, 2);

  const handleShowFile = (url) => {
    setShowViewer(true);
    setFileUrl(url);
  };

  return (
    <Box>
      {visibleMessages.map((message, index) => (
        <Box
          key={index}
          sx={{
            mb: 1,
            position: "relative",
            ml: index * 2,
            fontFamily: "Nunito",
          }}
        >
          <Box
            sx={{
              padding: "12px 16px",
              margin: "8px 0",
              boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.12)",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              border: "1px solid #d0d0d0",
              transition: "box-shadow 0.2s ease",
              "&:hover": {
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
              },
              fontFamily: "Nunito",
              position: "relative",
              overflow: "visible",
              zIndex: 1,
            }}
          >
            {index > 0 && (
              <>
                {Array.from({ length: index }).map((_, lineIndex) => (
                  <Box
                    key={lineIndex}
                    sx={{
                      width: "1px",
                      height: `calc(100% + 16px)`,
                      backgroundColor: "#d0d0d0",
                      position: "absolute",
                      left: `${lineIndex * 16 - index * 16}px`,
                      top: "-8px",
                      zIndex: -1,
                    }}
                  />
                ))}
              </>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#000000",
                  fontSize: "0.875rem",
                  fontFamily: "Nunito",
                }}
              >
                {message?.debtorCompanyName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#000000",
                  fontSize: "0.75rem",
                  fontFamily: "Nunito",
                }}
              >
                {message?.updatedAt &&
                  new Date(message?.updatedAt).toLocaleString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
              </Typography>
            </Box>
            <span
              style={{
                whiteSpace: "pre-wrap",
                color: "#000000",
                lineHeight: 1.5,
                fontSize: "0.875rem",
                fontFamily: "Nunito",
              }}
              dangerouslySetInnerHTML={{ __html: message?.textAsHtml }}
            ></span>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {message?.attachments?.length > 0 &&
                message?.attachments?.map((item) => (
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      border: `1px solid ${Colors.SKY_BLUE}`,
                      width: "25%",
                      borderRadius: "10px",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: Colors.lIGHT_PURPLE,
                      },
                    }}
                    onClick={() => handleShowFile(item?.url)}
                  >
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontFamily: "Nunito",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Attachment sx={{ color: Colors.SKY_BLUE }} />{" "}
                      {item?.originalFileName}
                    </Typography>
                  </Grid>
                ))}
            </div>
          </Box>
        </Box>
      ))}
      {thread.length > 2 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
            fontFamily: "Nunito",
          }}
        >
          <Button
            onClick={() => setShowAll((prev) => !prev)}
            sx={{
              textTransform: "none",
              color: Colors.SKY_BLUE,
              fontSize: "0.875rem",
              padding: "6px 16px",
              borderRadius: "20px",
              fontFamily: "Nunito",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
            }}
          >
            {showAll ? "See less" : `See more (${thread.length - 2} more)`}
          </Button>
        </Box>
      )}
      {showViewer && (
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
            onClick={() => setShowViewer(false)}
            style={{
              position: "fixed",
              top: "5rem",
              right: "1rem",
              bottom: 0,
              backgroundColor: "white",
              border: "none",
              borderRadius: "4px",
              padding: "0.5rem",
              cursor: "pointer",
              zIndex: 1100,
              height: "2rem",
            }}
          >
            Close
          </Button>
          <iframe
            src={fileUrl}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              position: "relative",
            }}
          />
        </div>
      )}
    </Box>
  );
};

export default EmailThreading;
