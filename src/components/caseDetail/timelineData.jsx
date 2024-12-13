import React, { useEffect, useState } from "react";
import { Box, Card, IconButton, Typography } from "@mui/material";
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
import { CallOutlined, Email, NoteAlt, Sms, Work } from "@mui/icons-material";
import ConversationHistory from "../callHistory";
import { GetCalls } from "../../services/services";

export default function TimelineData({
  id,
  value,
  date,
  notes,
  caseDataId,
  GetLogsById,
  caseData,
  iconValue,
}) {
  const [callLogs, setCallLogs] = useState([]);
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

  const fetchCalls = async () => {
    const res = await GetCalls(id);
    if (res?.status === 200) {
      setCallLogs(res?.data?.data);
    }
  };

  //remove this dummyCallLogs when done with integeration
  const dummyCallLogs = [
    {
      callerName: "Jim Klug",
      company: "Vice Versa Home Serv",
      duration: "8m 46s",
      timestamp: "3d ago",
      summary: `
        Jim Klug and Dawnyell Rangel discuss the legal actions taken against Jim's company and the potential consequences of filing for bankruptcy.
        They discuss the money that has been seized and the conditions under which Jim would be willing to release it.
        Dawnyell suggests being more aggressive with the recovery group, and Jim agrees, as long as they can reach a satisfactory agreement.
        They discuss the process of signing a release for the seized money and the potential next steps.
        Jim expresses his willingness to file for bankruptcy if the recovery group is not willing to work with him.
      `,
      speakers: [
        { name: "Jim Klug", percentage: "78%" },
        { name: "Dawnyell Rangel", percentage: "22%" },
      ],
      transcriptions: [
        {
          name: "Jim",
          time: "02:01",
          chat: "Hello, Dawnyell. Thank you for taking the time to discuss this matter.",
        },
        {
          name: "Dawnyell Rangel",
          time: "03:31",
          chat: "We need to discuss the legal actions and their implications.",
        },
        {
          name: "Jim",
          time: "06:29",
          chat: "I understand the challenges, but we need a mutually beneficial solution.",
        },
        {
          name: "Dawnyell Rangel",
          time: "07:15",
          chat: "Agreed. Let's finalize the conditions for releasing the funds.",
        },
      ],
    },
  ];

  useEffect(() => {
    fetchCalls();
  }, []);

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
          ) : iconValue === 5 ? (
            <IconButton sx={{ backgroundColor: "lightgreen" }}>
              <CallOutlined />
            </IconButton>
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
          ) : iconValue === 5 ? (
            //replace dummyCallLogs with callLogs when data starts coming from api
            dummyCallLogs?.map((callDetails) => (
              <ConversationHistory callDetails={callDetails} />
            ))
          ) : (
            <Card
              sx={{
                py: "16px",
                px: "16px",
                boxShadow: "none",
                borderRadius: "10px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                  <MuiModels
                    show="sendEmailCase"
                    replyButton={true}
                    from={value?.From}
                    to={value?.To}
                    content={value?.Content}
                    emailSubject={value?.Subject}
                    buttonName="sendEmailCase"
                    iconColor={Colors.BLACK}
                    maxHeight="78vh"
                    caseDataId={caseDataId}
                    GetLogsById={GetLogsById}
                    replyCheck={true}
                    data={caseData}
                  />
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
            </Card>
          )}
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
