import { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  IconButton,
  Typography,
  Button,
  Paper,
  CircularProgress,
  CardContent,
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
  ArrowBack,
  CallReceived,
  ChevronRight,
  Drafts,
  Email,
  ExpandMore,
  MailOutline,
} from "@mui/icons-material";
import { Colors } from "../../config/default";
import { FONT_SIZE_MEDIUM } from "../../constants/appConstants";
import TextButton from "../button";
import SendEmailCase from "./sendEmailCase";
import {
  GetEmailDataByThreadId,
  GetEmailThreadById,
  GetNotificationTemplates,
} from "../../services/services";
import EmailThreading from "../emailThreading";

// Consolidated Style Constants
const S = {
  bold: {
    fontFamily: "Nunito",
    fontSize: FONT_SIZE_MEDIUM,
    m: "6px 0px",
    fontWeight: 600,
  },
  card: { py: "16px", px: "16px", boxShadow: "none", borderRadius: "10px" },
  flex: { display: "flex", alignItems: "center" },
  threadCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: "8px",
    marginTop: "5px",
    padding: "10px",
    cursor: "pointer",
  },
  emailRow: {
    display: "flex",
    alignItems: "center",
    p: 2,
    cursor: "pointer",
    "&:hover": { backgroundColor: "#f5f5f5" },
    fontFamily: "Nunito",
  },
  nunito: { fontFamily: "Nunito" },
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";
const getTypeIcon = (type) =>
  type === "sent" ? (
    <MailOutline sx={{ fontSize: 18, color: Colors.SKY_BLUE }} />
  ) : (
    <CallReceived sx={{ fontSize: 18, color: "#2e7d32" }} />
  );

export default function EmailTimeline({
  caseData,
  creditorsTabs,
  getThreadData,
  activePreview,
  setActivePreview,
  threadData,
  loading,
  setLoading,
  cc,
}) {
  const [threadMessages, setThreadMessages] = useState([]);
  const [expandedEmails, setExpandedEmails] = useState({});
  const [notificationTemplate, setNotificationTemplate] = useState();
  const [showSendEmailCase, setShowSendEmailCase] = useState(false);
  const sendEmailRef = useRef(null);

  const getNotificationTemplates = async () => {
    const res = await GetNotificationTemplates();
    if (res?.status === 200) setNotificationTemplate(res?.data?.data);
  };

  const toggleEmail = (id) =>
    setExpandedEmails((prev) => ({ ...prev, [id]: !prev[id] }));
  const handleReplyClick = () => {
    setShowSendEmailCase(true);
    setTimeout(
      () => sendEmailRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  const handlePreviewClick = async (threadId) => {
    setLoading(true);
    const res = await GetEmailDataByThreadId(threadId);
    if (res?.status === 200) setThreadMessages(res?.data?.data);
    setLoading(false);
  };

  useEffect(() => {
    getThreadData();
  }, [creditorsTabs]);

  useEffect(() => {
    getNotificationTemplates();
  }, []);

  if (loading) {
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
            <Card
              sx={{
                ...S.card,
                ...S.flex,
                justifyContent: "center",
                width: "100%",
              }}
            >
              <CircularProgress size={30} sx={{ color: Colors.SKY_BLUE }} />
            </Card>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    );
  }

  if (threadData?.length === 0) {
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
            <Card sx={{ ...S.card, ...S.nunito, fontSize: FONT_SIZE_MEDIUM }}>
              No Emails
            </Card>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    );
  }

  return (
    <>
      <Timeline sx={{ padding: 0, margin: "0" }}>
        {!activePreview
          ? threadData?.map((item, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent
                  sx={{ flex: 0, padding: 1, margin: 0 }}
                />
                <TimelineSeparator>
                  <TimelineConnector />
                  <Email />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ flex: 1 }}>
                  <CardContent
                    style={S.threadCard}
                    onClick={() => {
                      setActivePreview(true);
                      handlePreviewClick(item?.threadId);
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <div style={{ display: "flex", gap: "10px" }}>
                        <Typography sx={{ ...S.bold, color: Colors.BLACK }}>
                          From:
                        </Typography>
                        <Typography sx={{ ...S.bold, color: Colors.SKY_BLUE }}>
                          {item?.firstInboxMessage?.from}
                        </Typography>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <Typography sx={{ ...S.bold, color: Colors.BLACK }}>
                          To:
                        </Typography>
                        <Typography sx={{ ...S.bold, color: Colors.SKY_BLUE }}>
                          {item?.firstInboxMessage?.to}
                        </Typography>
                      </div>
                    </div>
                    <Box
                      sx={{
                        ...S.flex,
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_MEDIUM,
                        }}
                      >
                        {item?.firstInboxMessage?.debtorCompanyName ||
                          "Composed"}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_MEDIUM,
                        }}
                      >
                        {item?.firstInboxMessage?.subject}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_MEDIUM,
                        }}
                      >
                        {formatDate(item?.firstInboxMessage?.createdAt)}
                      </Typography>
                    </Box>
                  </CardContent>
                </TimelineContent>
              </TimelineItem>
            ))
          : threadMessages?.previousMessages?.map((email, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent
                  sx={{ flex: 0, padding: 1, margin: 0 }}
                />
                <TimelineSeparator>
                  <TimelineConnector />
                  {expandedEmails[email._id] && email?.type === "sent" ? (
                    <Drafts sx={{ fontSize: 18, color: Colors.SKY_BLUE }} />
                  ) : (
                    getTypeIcon(email?.type)
                  )}
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ flex: 1 }}>
                  <Paper sx={{ border: "1px solid #e0e0e0", ...S.nunito }}>
                    {index === 0 && (
                      <div>
                        <IconButton onClick={() => setActivePreview(false)}>
                          <ArrowBack />
                        </IconButton>
                      </div>
                    )}
                    {!expandedEmails[email._id] ? (
                      <Box
                        sx={S.emailRow}
                        onClick={() => toggleEmail(email._id)}
                      >
                        <IconButton size="small" sx={{ mr: 1, p: 0.5 }}>
                          <ChevronRight sx={{ fontSize: 20 }} />
                        </IconButton>
                        <Box sx={{ flex: 1, ...S.nunito }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <div style={{ display: "flex", gap: "10px" }}>
                              <Typography
                                sx={{ ...S.bold, color: Colors.BLACK }}
                              >
                                From:
                              </Typography>
                              <Typography
                                sx={{ ...S.bold, color: Colors.SKY_BLUE }}
                              >
                                {email?.from}
                              </Typography>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <Typography
                                sx={{ ...S.bold, color: Colors.BLACK }}
                              >
                                To:
                              </Typography>
                              <Typography
                                sx={{ ...S.bold, color: Colors.SKY_BLUE }}
                              >
                                {email?.to}
                              </Typography>
                            </div>
                          </div>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <div style={{ display: "flex" }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 600,
                                  mr: 1,
                                  gap: ".5rem",
                                  ...S.flex,
                                  ...S.nunito,
                                }}
                              >
                                {email?.creditorCompanyName
                                  ? email?.creditorCompanyName
                                  : email?.type === "received"
                                  ? "Received"
                                  : "Composed"}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  ...S.nunito,
                                }}
                              >
                                -- {email?.subject}
                              </Typography>
                            </div>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ ...S.nunito }}
                            >
                              {formatDate(email?.updatedAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={S.nunito}>
                        <Box
                          sx={{
                            ...S.emailRow,
                            borderBottom: "1px solid #e0e0e0",
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
                              ...S.nunito,
                            }}
                          >
                            From: <strong>{email?.creditorCompanyName}</strong>{" "}
                            &lt;{email?.from}&gt;
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={S.nunito}
                          >
                            {formatDate(email?.updatedAt)}
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2, ...S.nunito }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 2,
                              ...S.nunito,
                            }}
                          >
                            <Box sx={S.nunito}>
                              <Box sx={{ ...S.flex, mb: 1 }}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ minWidth: "40px", mr: 1, ...S.nunito }}
                                >
                                  From:
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, mr: 1, ...S.nunito }}
                                >
                                  {email?.creditorCompanyName}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={S.nunito}
                                >
                                  &lt;{email?.from}&gt;
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
                              <Box sx={{ display: "flex", mb: 2 }}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ minWidth: "40px", mr: 1, ...S.nunito }}
                                >
                                  To:
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="primary.main"
                                  sx={S.nunito}
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
                              maxHeight: "150px",
                              maxWidth: "100%",
                              overflow: "auto",
                              ...S.nunito,
                              fontSize: "14px",
                              color: "#424242",
                              lineHeight: 1.4,
                            }}
                            dangerouslySetInnerHTML={{
                              __html: `<div style="margin: 0;"><style>p { margin: 0 0 4px 0; word-break: break-word; }</style>${email?.textAsHtml}</div>`,
                            }}
                          />
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
                                // cc={email?.cc?.length > 0 ? email?.cc : []}
                                cc={cc}
                                threadId={email?.threadId}
                                handleClose={() => setShowSendEmailCase(false)}
                              />
                            </div>
                          )}
                          <EmailThreading email={email} />
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
      </Timeline>
    </>
  );
}
