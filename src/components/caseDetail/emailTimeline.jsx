import { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  IconButton,
  Tooltip,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
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
  CallReceived,
  ChevronRight,
  Drafts,
  Email,
  ExpandMore,
  MailOutline,
  NoteAlt,
  Sms,
  Work,
} from "@mui/icons-material";
import { Colors } from "../../config/default";
import ConversationHistory from "../callHistory";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
} from "../../constants/appConstants";
import TextButton from "../button";
import SendEmailCase from "./sendEmailCase";
import {
  GetEmailDataByThreadId,
  GetEmailThreadById,
  GetNotificationTemplates,
} from "../../services/services";
import EmailThreading from "../emailThreading";
import TimelineData from "./timelineData";

export default function EmailTimeline({ caseData, creditorsTabs }) {
  const [showViewer, setShowViewer] = useState(false);
  const [fileUrl, setFileUrl] = useState();
  const [threadData, setThreadData] = useState();
  const [expandedEmails, setExpandedEmails] = useState({});
  const [showSendEmailCase, setShowSendEmailCase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notificationTemplate, setNotificationTemplate] = useState();

  const sendEmailRef = useRef(null);

  const handleCloseReply = () => {
    setShowSendEmailCase(false);
  };

  const getNotificationTemplates = async () => {
    const res = await GetNotificationTemplates();
    if (res?.status === 200) {
      setNotificationTemplate(res?.data?.data);
    }
  };

  const getThreadData = async () => {
    setLoading(true);
    const caseId =
      creditorsTabs === "singleCreditor"
        ? caseData?._id
        : caseData?.creditors[creditorsTabs]?._id;
    const res = await GetEmailThreadById(caseId);
    if (res?.status) {
      setThreadData(res?.data?.data?.previousMessages);
    }
    setLoading(false);
  };

  const getTypeIcon = (type) => {
    if (type === "sent") {
      return (
        <MailOutline sx={{ fontSize: 16, color: Colors.SKY_BLUE, mr: 1 }} />
      );
    } else {
      return <CallReceived sx={{ fontSize: 16, color: "#2e7d32", mr: 1 }} />;
    }
  };

  const toggleEmail = (id) => {
    setExpandedEmails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReplyClick = () => {
    setShowSendEmailCase(true);
    setTimeout(() => {
      sendEmailRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    getThreadData();
  }, [creditorsTabs]);

  useEffect(() => {
    getNotificationTemplates();
  }, []);

  return (
    <Timeline sx={{ padding: 0, margin: "0" }}>
      <TimelineItem>
        <TimelineOppositeContent sx={{ flex: 0, padding: 1, margin: 0 }} />
        <TimelineSeparator>
          <TimelineConnector />
          <Email />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ flex: 1 }}>
          {loading ? (
            <Card
              sx={{
                py: "16px",
                px: "16px",
                boxShadow: "none",
                borderRadius: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={30} sx={{ color: Colors.SKY_BLUE }} />
            </Card>
          ) : threadData?.length > 0 ? (
            <Paper
              sx={{
                border: "1px solid #e0e0e0",
                fontFamily: "Nunito",
              }}
            >
              {threadData?.map((email, index) => (
                <Box
                  key={index}
                  sx={{
                    fontFamily: "Nunito",
                  }}
                >
                  {!expandedEmails[email._id] ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                        fontFamily: "Nunito",
                      }}
                      onClick={() => toggleEmail(email._id)}
                    >
                      <IconButton size="small" sx={{ mr: 1, p: 0.5 }}>
                        <ChevronRight sx={{ fontSize: 20 }} />
                      </IconButton>
                      <Box
                        sx={{
                          flex: 1,
                          fontFamily: "Nunito",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            fontFamily: "Nunito",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              mr: 1,

                              gap: ".5rem",
                              display: "flex",
                              alignItems: "center",
                              fontFamily: "Nunito",
                            }}
                          >
                            {email?.creditorCompanyName
                              ? email?.creditorCompanyName
                              : email?.type === "received"
                              ? "Received"
                              : "Composed"}
                            {getTypeIcon(email?.type)}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontFamily: "Nunito",
                            }}
                          >
                            -- {email?.subject}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          mr: 2,
                          fontFamily: "Nunito",
                        }}
                      >
                        {email?.updatedAt &&
                          new Date(email?.updatedAt).toLocaleString("en-US", {
                            month: "numeric",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        fontFamily: "Nunito",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 2,
                          cursor: "pointer",
                          borderBottom: "1px solid #e0e0e0",
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                          fontFamily: "Nunito",
                        }}
                        onClick={() => toggleEmail(email._id)}
                      >
                        <IconButton size="small" sx={{ mr: 1, p: 0.5 }}>
                          <ExpandMore sx={{ fontSize: 20 }} />
                        </IconButton>
                        <Typography
                          variant="body2"
                          sx={{
                            flex: 1,
                            color: "text.secondary",
                            fontFamily: "Nunito",
                          }}
                        >
                          From: <strong>{email?.creditorCompanyName}</strong>{" "}
                          &lt;
                          {email?.from}&gt;
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontFamily: "Nunito",
                          }}
                        >
                          {email?.updatedAt &&
                            new Date(email?.updatedAt).toLocaleString("en-US", {
                              month: "numeric",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          fontFamily: "Nunito",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                            fontFamily: "Nunito",
                          }}
                        >
                          <Box
                            sx={{
                              fontFamily: "Nunito",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  minWidth: "40px",
                                  mr: 1,
                                  fontFamily: "Nunito",
                                }}
                              >
                                From:
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  mr: 1,
                                  fontFamily: "Nunito",
                                }}
                              >
                                {email?.creditorCompanyName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  fontFamily: "Nunito",
                                }}
                              >
                                &lt;{email?.from}
                                &gt;
                              </Typography>
                              <span
                                style={{
                                  marginLeft: ".5rem",
                                  marginTop: "6px",
                                }}
                              >
                                {email?.type === "sent" ? (
                                  <Drafts
                                    sx={{
                                      color: Colors.SKY_BLUE,
                                      fontSize: "16px",
                                    }}
                                  />
                                ) : (
                                  getTypeIcon(email?.type)
                                )}
                              </span>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                mb: 2,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  minWidth: "40px",
                                  mr: 1,
                                  fontFamily: "Nunito",
                                }}
                              >
                                To:
                              </Typography>
                              <Typography
                                variant="body2"
                                color="primary.main"
                                sx={{
                                  fontFamily: "Nunito",
                                }}
                              >
                                {email?.to}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <TextButton
                              buttonText="REPLY"
                              height="2rem"
                              marginRight="1rem"
                              width="6rem"
                              onClick={handleReplyClick}
                              backgroundColor={Colors.SKY_BLUE}
                              hoverColor={Colors.SKY_BLUE}
                            />
                          </Box>
                        </Box>

                        <div
                          style={{
                            maxHeight: "150px", // or any desired height
                            maxWidth: "100%", // ensure it doesn't overflow horizontally
                            overflow: "auto", // enables scrollbars
                            fontFamily: "Nunito",
                            fontSize: "14px",
                            color: "#424242",
                            lineHeight: 1.4,
                          }}
                          dangerouslySetInnerHTML={{
                            __html: `<div style="margin: 0;"><style>p { margin: 0 0 4px 0; word-break: break-word; }</style>${email?.textAsHtml}</div>`,
                          }}
                        ></div>

                        {showSendEmailCase && (
                          <div
                            ref={sendEmailRef}
                            style={{
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
                              marginTop: "1rem",
                            }}
                          >
                            <SendEmailCase
                              from={email?.from}
                              to={email?.to}
                              emailType={email?.type}
                              content={email?.textAsHtml}
                              data={notificationTemplate}
                              attachment={email?.attachments}
                              emailSubject={email?.subject}
                              emailOrCompose={email?.caseId ? true : false}
                              buttonName="sendEmailCase"
                              iconColor={Colors.BLACK}
                              maxHeight="78vh"
                              replyCheck={true}
                              caseDataId={email?.caseId}
                              getAllInboxData={getThreadData}
                              cc={email?.cc?.length > 0 ? email?.cc : []}
                              threadId={email?.threadId}
                              handleClose={handleCloseReply}
                            />
                          </div>
                        )}

                        <EmailThreading email={email} />
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}
            </Paper>
          ) : (
            <Card
              sx={{
                py: "16px",
                px: "16px",
                boxShadow: "none",
                borderRadius: "10px",
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_MEDIUM,
              }}
            >
              No Emails
            </Card>
          )}
        </TimelineContent>
      </TimelineItem>
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
    </Timeline>
  );
}
