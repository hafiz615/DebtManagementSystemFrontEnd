import React, { useState } from "react";
import {
  Box,
  Card,
  IconButton,
  Tooltip,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from "@mui/lab";
import {
  ArrowLeft,
  ArrowRight,
  Attachment,
  CallOutlined,
  ChevronRight,
  Email,
  ExpandMore,
  NoteAlt,
  Sms,
  Work,
} from "@mui/icons-material";
import { Colors } from "../../config/default";
import ConversationHistory from "../callHistory";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";
import TextButton from "../button";
import SendEmailCase from "./sendEmailCase";

export default function TimelineData({
  callLogs,
  value,
  date,
  notes,
  caseDataId,
  GetLogsById,
  iconValue,
  caseData,
  currentCallPage,
  setCurrentCallPage,
  totalCallPage,
  verifiedSenders,
}) {
  const [showReplyCard, setShowReplyCard] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hideShowMore, setHideShowMore] = useState(true);
  const [showViewer, setShowViewer] = useState(false);
  const [fileUrl, setFileUrl] = useState();

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

  const handleShowFile = (url) => {
    setShowViewer(true);
    setFileUrl(url);
  };

  const handleClose = () => {
    setShowReplyCard(false);
    setHideShowMore(true);
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
            <>
              {callLogs?.length > 0 ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Typography
                      sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
                    >
                      {totalCallPage === 0 ? 0 : currentCallPage} of{" "}
                      {totalCallPage}
                    </Typography>
                    <IconButton
                      onClick={() => setCurrentCallPage(currentCallPage - 1)}
                      disabled={currentCallPage === 1}
                    >
                      <ArrowLeft />
                    </IconButton>
                    <IconButton
                      onClick={() => setCurrentCallPage(currentCallPage + 1)}
                      disabled={
                        totalCallPage === 0 || currentCallPage === totalCallPage
                      }
                    >
                      <ArrowRight />
                    </IconButton>
                  </div>
                  {callLogs?.map((callDetails) => (
                    <ConversationHistory callDetails={callDetails} />
                  ))}
                </>
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
              )}
            </>
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
                <SendEmailCase
                  caseDataId={caseDataId}
                  headerName={false}
                  GetLogsById={GetLogsById}
                  emailSubject={value?.Subject}
                  data={caseData}
                  buttonName="sendEmailCase"
                  verifiedSenders={verifiedSenders}
                  handleClose={handleClose}
                  from={value?.From}
                  to={value?.To}
                  content={value?.Content}
                  attachment={value?.Attachments}
                  replyCheck={true}
                />
              ) : (
                <>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {hideShowMore && (
                        <Box>
                          {value?.Action === "EMAIL" && (
                            <Typography
                              onClick={() => setIsExpanded(!isExpanded)}
                            >
                              {isExpanded ? (
                                <IconButton>
                                  <ExpandMore
                                    sx={{
                                      color: Colors.SKY_BLUE,
                                      cursor: "pointer",
                                    }}
                                  />
                                </IconButton>
                              ) : (
                                <IconButton>
                                  <ChevronRight
                                    sx={{
                                      color: Colors.SKY_BLUE,
                                      cursor: "pointer",
                                    }}
                                  />
                                </IconButton>
                              )}
                            </Typography>
                          )}
                        </Box>
                      )}
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontFamily: "Nunito",
                          fontWeight: "700",
                        }}
                      >
                        {value?.Action} {formatDate(value?.Time)}
                      </Typography>
                    </div>

                    {value?.Action === "EMAIL" && !Array.isArray(value?.To) && (
                      <TextButton
                        buttonText="Reply"
                        onClick={() => {
                          setShowReplyCard(true);
                          setHideShowMore(false);
                        }}
                        backgroundColor={Colors.SKY_BLUE}
                        hoverColor={Colors.SKY_BLUE}
                      />
                    )}
                  </div>

                  {value?.Action === "EMAIL" ? (
                    isExpanded ? (
                      Object.entries(value)
                        ?.filter(([key]) => key !== "Action" && key !== "Time")
                        ?.map(([key, value]) => (
                          <Box key={key} sx={{ paddingLeft: "2.5rem" }}>
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
                                  dangerouslySetInnerHTML={{
                                    __html: value,
                                  }}
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
                            ) : key === "Attachments" ? (
                              <>
                                {value?.length > 0 && (
                                  <Typography
                                    sx={{
                                      fontSize: "13px",
                                      fontFamily: "Nunito",
                                      mb: "10px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    Attachments:
                                  </Typography>
                                )}

                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {value?.map((item) => (
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
                                        <Attachment
                                          sx={{ color: Colors.SKY_BLUE }}
                                        />{" "}
                                        {item?.originalFileName}
                                      </Typography>
                                    </Grid>
                                  ))}
                                </div>
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
                            paddingLeft: "2.5rem",
                          }}
                        >
                          <strong>From:</strong> {value?.From}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontFamily: "Nunito",
                            mb: "10px",
                            paddingLeft: "2.5rem",
                          }}
                        >
                          <strong>To:</strong>{" "}
                          {Array.isArray(value?.To) ? (
                            <Tooltip
                              title={value?.To.join(", ")}
                              placement="top"
                              arrow
                            >
                              <span>
                                {value?.To.join(", ").length > 70
                                  ? value?.To.join(", ").slice(0, 70) + "..."
                                  : value?.To.join(", ")}
                              </span>
                            </Tooltip>
                          ) : (
                            <Tooltip title={value?.To} placement="top" arrow>
                              <span>
                                {value?.To?.length > 70
                                  ? value?.To.slice(0, 70) + "..."
                                  : value?.To}
                              </span>
                            </Tooltip>
                          )}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontFamily: "Nunito",
                            mb: "10px",
                            paddingLeft: "2.5rem",
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
            </Card>
          )}
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
