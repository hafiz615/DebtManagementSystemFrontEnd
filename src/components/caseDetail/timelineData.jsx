import React from "react";
import { Card, Typography } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from "@mui/lab";
import EmailIcon from "@mui/icons-material/Email";

export default function TimelineData({value,date}) {
  const formattedDate = new Date(date);

// Convert the Date object to EST time zone
const estTime = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
}).format(formattedDate);
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
          <Card
            sx={{
              py: "10px",
              px: "10px",
              boxShadow: "none",
              borderRadius: "10px",
            }}
          >
            {date!== null && <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                fontFamily: "Nunito",
              }}
            >
             Note added {estTime}
            </p>}
            <Typography sx={{ fontSize: "13px", fontFamily: "Nunito" }}>
            {value}
            </Typography>
          </Card>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
