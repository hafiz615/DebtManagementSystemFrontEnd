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

export default function TimelineData() {
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
            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                fontFamily: "Nunito",
              }}
            >
              Success! You sent a payment to umair
            </p>
            <Typography sx={{ fontSize: "13px", fontFamily: "Nunito" }}>
              Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet
              consectetur. Lorem ipsum dolor sit amet consectetur.
            </Typography>
          </Card>
          <Card
            sx={{
              py: "10px",
              px: "10px",
              boxShadow: "none",
              borderRadius: "10px",
              mt: "10px",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                fontFamily: "Nunito",
              }}
            >
              Chase Payments
            </p>
            <Typography sx={{ fontSize: "13px", fontFamily: "Nunito" }}>
              Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet
              consectetur. Lorem ipsum dolor sit amet consectetur.
            </Typography>
          </Card>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
