import React, { useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import Button from "../button";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from "@mui/lab";
import MuiModels from "../models";
import { Colors } from "../../config/default";
import { Email, NoteAlt, Sms, Work } from "@mui/icons-material";
import SendEmailCase from "./sendEmailCase";
import ReplyCard from "./replyCard";

export default function TimelineData({
  value,
  date,
  notes,
  caseDataId,
  GetLogsById,
  iconValue,
}) {
  const [showReplyCard, setShowReplyCard] = useState(false);
  const formattedDate = new Date(date);

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

          {iconValue === 0 ? (
            value?.Action === "EMAIL" ? (
              <Email />
            ) : value?.Action === "SMS" ? (
              <Sms />
            ) : value?.Action === "Add Notes" ? (
              <NoteAlt />
            ) : (
              <Work />
            )
          ) : iconValue === 1 ? (
            <Email />
          ) : iconValue === 2 ? (
            <Sms />
          ) : iconValue === 3 ? (
            <NoteAlt />
          ) : (
            <Work />
          )}

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
              {showReplyCard ? (
                <ReplyCard
                  from={value?.From}
                  to={value?.To}
                  content={value?.Content}
                  emailSubject={value?.Subject}
                  caseDataId={caseDataId}
                  GetLogsById={GetLogsById}
                  setShowReplyCard={setShowReplyCard}
                />
              ) : (
                <>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
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

                    {value?.Action === "EMAIL" && !Array.isArray(value?.To) && (
                      <>
                        {!showReplyCard && (
                          <Button
                            buttonText="Reply"
                            onClick={() => {
                              setShowReplyCard(true);
                            }}
                            backgroundColor={Colors.SKY_BLUE}
                            hoverColor={Colors.SKY_BLUE}
                          />
                        )}
                      </>
                    )}
                  </div>
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
                </>
              )}
            </Card>
          )}
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
