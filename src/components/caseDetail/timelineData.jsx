import React, { useState } from "react";
import Button from "../button";
import { Box, Card, IconButton, Typography } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from "@mui/lab";
import { CallOutlined, Email, NoteAlt, Sms, Work } from "@mui/icons-material";
import { Colors } from "../../config/default";
import ConversationHistory from "../callHistory";
import ReplyCard from "./replyCard";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";

export default function TimelineData({
  callLogs,
  value,
  date,
  notes,
  caseDataId,
  GetLogsById,
  iconValue,
  caseData,
}) {
  const [showReplyCard, setShowReplyCard] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hideShowMore, setHideShowMore] = useState(true);

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

  const renderIcon = () => {
    if (iconValue === 0) {
      if (value?.Action === "EMAIL") return <Email />;
      if (value?.Action === "SMS") return <Sms />;
      if (value?.Action === "Add Notes") return <NoteAlt />;
      return <Work />;
    }
    if (iconValue === 1) return <Email />;
    if (iconValue === 2) return <Sms />;
    if (iconValue === 3) return <NoteAlt />;
    if (iconValue === 5)
      return (
        <IconButton sx={{ backgroundColor: "lightgreen" }}>
          <CallOutlined />
        </IconButton>
      );
    return <Work />;
  };

  return (
    <Timeline sx={{ padding: 0, margin: "0" }}>
      <TimelineItem>
        <TimelineOppositeContent sx={{ flex: 0, padding: 1, margin: 0 }} />
        <TimelineSeparator>
          <TimelineConnector />
          {renderIcon()}
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
          ) : iconValue === 5 ? (
            callLogs?.length > 0 ? (
              callLogs?.map((callDetails) => (
                <ConversationHistory callDetails={callDetails} />
              ))
            ) : (
              <div
                style={{
                  backgroundColor: Colors.WHITE,
                  padding: "1rem 10px",
                  borderRadius: "10px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: FONT_SIZE_LARGE,
                    fontFamily: "Nunito",
                  }}
                >
                  No Calls
                </Typography>
              </div>
            )
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
                  caseData={caseData}
                  setHideShowMore={setHideShowMore}
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
                              setHideShowMore(false);
                            }}
                            backgroundColor={Colors.SKY_BLUE}
                            hoverColor={Colors.SKY_BLUE}
                          />
                        )}
                      </>
                    )}
                  </div>

                  {value?.Action === "EMAIL" ? (
                    isExpanded ? (
                      Object.entries(value)
                        ?.filter(([key]) => key !== "Action" && key !== "Time")
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
                                  {Array.isArray(value)
                                    ? value.join(", ")
                                    : value}
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
                        ))
                    ) : (
                      <>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontFamily: "Nunito",
                            mb: "10px",
                          }}
                        >
                          <strong>From:</strong> {value?.From}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontFamily: "Nunito",
                            mb: "10px",
                          }}
                        >
                          <strong>To:</strong>{" "}
                          {Array.isArray(value?.To)
                            ? value?.To.join(", ")
                            : value?.To}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontFamily: "Nunito",
                            mb: "10px",
                          }}
                        >
                          <strong>Subject:</strong> {value?.Subject}
                        </Typography>
                      </>
                    )
                  ) : (
                    Object.entries(value)
                      ?.filter(([key]) => key !== "Action" && key !== "Time")
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
                                {Array.isArray(value)
                                  ? value.join(", ")
                                  : value}
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
                      ))
                  )}
                </>
              )}
              {/* Show More / Show Less Typography for EMAIL actions */}
              {hideShowMore && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  {value?.Action === "EMAIL" && (
                    <Typography
                      onClick={() => setIsExpanded(!isExpanded)}
                      sx={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: Colors.SKY_BLUE,
                        cursor: "pointer",
                        fontFamily: "Nunito",
                      }}
                    >
                      {isExpanded ? "Show Less" : "Show More"}
                    </Typography>
                  )}
                </Box>
              )}
            </Card>
          )}
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
