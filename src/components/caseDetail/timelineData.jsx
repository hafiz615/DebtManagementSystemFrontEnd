import React from "react";
import { Box, Card, Typography } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from "@mui/lab";
import EmailIcon from "@mui/icons-material/Email";

export default function TimelineData({ value, date, notes }) {
  const formattedDate = new Date(date);

  // Convert the Date object to EST time zone
  const estTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(formattedDate);

  function formatDate(dateString) {
    const datePart = new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const timePart = new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
    return `${datePart} at ${timePart}`;
  }
  return (
    <Timeline sx={{ padding: 0, margin: "0" }}>
      <TimelineItem>
        <TimelineOppositeContent sx={{ flex: 0, padding: 1, margin: 0 }} />
        <TimelineSeparator>
          <TimelineConnector />
          <EmailIcon />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ flex: 1 }}>
          {notes ? (
            <Card
              sx={{
                py: "16px",
                px: "16px",
                boxShadow: "none",
                borderRadius: "10px",
              }}
            >
              {date !== null && (
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    fontFamily: "Nunito",
                  }}
                >
                  Note added {estTime}
                </p>
              )}
              <Typography sx={{ fontSize: "13px", fontFamily: "Nunito" }}>
                {value}
              </Typography>
            </Card>
          ) : (
            <Card
              sx={{
                py: "16px",
                px: "16px",
                boxShadow: "none",
                borderRadius: "10px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontFamily: "Nunito",
                  mb: "10px",
                  fontWeight: "700",
                }}
              >
                {value?.Action} {formatDate(value?.Time)}
              </Typography>
              {Object.entries(value)
                .filter(([key]) => key !== "Action" && key !== "Time")
                ?.map(([key, value]) => (
                  <Box key={key}>
                    {key === "Content" ? (
                      <>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontFamily: "Nunito",
                            mb: "10px",
                            fontWeight: "700",
                          }}
                        >
                          {key}:
                        </Typography>
                        <div
                          dangerouslySetInnerHTML={{ __html: value }}
                          style={{
                            fontSize: "13px",
                            fontFamily: "Nunito",
                            marginBottom: "10px",
                            width: "100%",
                            borderRadius: "10px",
                          }}
                        />
                      </>
                    ) : key === "To" ? (
                      <>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontFamily: "Nunito",
                            mb: "10px",
                          }}
                        >
                          <strong>{key}:</strong>{" "}
                          {Array.isArray(value) ? value.join(", ") : value}
                        </Typography>
                      </>
                    ) : key === "Notes" ? (
                      <>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontFamily: "Nunito",
                            mb: "10px",
                            fontWeight: "700",
                          }}
                        >
                          {key}:
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontFamily: "Nunito",
                            mb: "10px",
                          }}
                        >
                          {value}
                        </Typography>
                      </>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontFamily: "Nunito",
                          mb: "10px",
                        }}
                      >
                        <strong>{key}:</strong>{" "}
                        {key === "Due Date" || key === "Time"
                          ? formatDate(value)
                          : value}
                      </Typography>
                    )}
                  </Box>
                ))}
            </Card>
          )}
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
