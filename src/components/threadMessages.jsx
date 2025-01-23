import { Attachment } from "@mui/icons-material";
import { Button, Grid, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { FONT_SIZE_MEDIUM } from "../constants/appConstants";
import { formatDateString } from "../common";
import { Colors } from "../config/default";

const boldTextStyling = {
  fontFamily: "Nunito",
  fontSize: FONT_SIZE_MEDIUM,
  m: "6px 0px",
  fontWeight: 600,
};

const fontStyling = {
  fontFamily: "Nunito",
  fontSize: FONT_SIZE_MEDIUM,
  m: "6px 0px",
};

export default function ThreadMessages({ data }) {
  const [showViewer, setShowViewer] = useState(false);
  const [fileUrl, setFileUrl] = useState();

  const handleShowFile = (url) => {
    setShowViewer(true);
    setFileUrl(url);
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <Typography sx={boldTextStyling}>
              {`${
                data?.debtorCompanyName || "Composed At"
              } ${"-"} ${formatDateString(data?.createdAt)} `}
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <Typography sx={boldTextStyling}>Subject:</Typography>
            <Typography sx={fontStyling}>{data?.subject || "-"}</Typography>
          </div>
        </div>
      </div>

      <div>
        {data?.creditorCompanyName && (
          <div style={{ display: "flex", gap: "10px" }}>
            <Typography sx={boldTextStyling}>Creditor Company Name:</Typography>
            <Typography sx={fontStyling}>
              {data?.creditorCompanyName || "-"}
            </Typography>
          </div>
        )}
        {data?.negotiatorName && (
          <div style={{ display: "flex", gap: "10px" }}>
            <Typography sx={boldTextStyling}>Negotiator Name:</Typography>
            <Typography sx={fontStyling}>
              {data?.negotiatorName || "-"}
            </Typography>
          </div>
        )}
        <Typography sx={boldTextStyling}>Content:</Typography>

        <div>
          <Typography
            sx={fontStyling}
            dangerouslySetInnerHTML={{
              __html: data?.textAsHtml,
            }}
          />
        </div>
        <div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {data?.attachments?.map((attachment) => (
              <Grid
                container
                sx={{
                  display: "flex",
                  border: `1px solid ${Colors.SKY_BLUE}`,
                  width: "20%",
                  borderRadius: "10px",
                  justifyContent: "space-between",
                  aligndatas: "center",
                  padding: "10px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: Colors.lIGHT_PURPLE,
                  },
                }}
                onClick={() => handleShowFile(attachment?.url)}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontFamily: "Nunito",
                    display: "flex",
                    aligndatas: "center",
                    gap: "10px",
                  }}
                >
                  <Attachment sx={{ color: Colors.SKY_BLUE }} />
                  {attachment?.originalFileName}
                </Typography>
              </Grid>
            ))}
          </div>
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
      </div>
    </div>
  );
}
