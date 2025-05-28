import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Colors } from "../config/default";

const EmailThreading = ({ email }) => {
  const [showAll, setShowAll] = useState(false);
  const thread = email?.thread || [];

  const visibleMessages = showAll ? thread : thread.slice(0, 2);

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
          {/* Message Content Box */}
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
            {/* Vertical Threading Lines */}
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

            {/* Sender and Time Header */}
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
                {message.sender}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#000000",
                  fontSize: "0.75rem",
                  fontFamily: "Nunito",
                }}
              >
                {message.time}
              </Typography>
            </Box>

            {/* Message Content */}
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                color: "#000000",
                lineHeight: 1.5,
                fontSize: "0.875rem",
                fontFamily: "Nunito",
              }}
            >
              {message.content}
            </Typography>
          </Box>
        </Box>
      ))}

      {/* Toggle Button */}
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
    </Box>
  );
};

export default EmailThreading;
