import React, { useEffect, useRef, useState } from "react";
import { Grid, Box, Typography, Tooltip } from "@mui/material";
import { useToast } from "../toast/toastContext";
import { Colors } from "../config/default";
import TextButton from "./button";
import ScrollbarStyles from "./customScroll";
import { GetAllSenders, SendSettlementEmail } from "../services/services";
import { FONT_SIZE_MEDIUM, TEXT_EDITOR_KEY } from "../constants/appConstants";
import { marked } from "marked";
import { useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import Dropdown from "./dropdown";

const lineStyle = {
  width: "100%",
  height: "1px",
  backgroundColor: "#EAEBEB",
  margin: "1rem 0",
};

const inputContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "5px",
  marginBottom: "10px",
  borderRadius: "10px",
};

const emailChipStyle = {
  backgroundColor: "#EAEBEB",
  borderRadius: "3px",
  padding: "5px 10px",
  marginRight: "5px",
  display: "flex",
  alignItems: "center",
  fontFamily: "Nunito",
  fontSize: FONT_SIZE_MEDIUM,
  borderRadius: "10px",
};

const removeIconStyle = {
  marginLeft: "8px",
  cursor: "pointer",
  color: "#888",
};

const inputStyling = {
  backgroundColor: "#f0f0f0",
  marginBottom: "1rem",
  height: "2.5rem",
  color: "#333",
  paddingLeft: "1rem",
  border: "none",
  outline: "none",
  borderRadius: "5px",
  width: "48%",
};
export default function SendEmailJustification({
  handleClose,
  data,
  caseId,
  debtorId,
}) {
  const [sendTo, setSendTo] = useState("");
  const [sendFrom, setSendFrom] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [cc, setCc] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [subject, setSubject] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab" || e.key === ",") {
      e.preventDefault();
      const trimmedValue = inputValue.trim();

      if (trimmedValue && validateEmail(trimmedValue)) {
        setCc([...cc, trimmedValue]);
        setInputValue("");
      }
    }
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRemoveEmail = (index) => {
    setCc(cc?.filter((_, i) => i !== index));
  };
  const menu = debtorId?.map((name) => ({
    label: name,
    value: name,
  }));

  const handleSend = async () => {
    setLoading(true);
    const payload = {
      sendTo: sendTo,
      from: selectedValue,
      subject: subject,
      content: preview,
      cc: cc,
    };
    const resEmail = await SendSettlementEmail(payload, caseId);
    if (resEmail?.status === 200) {
      showToast(resEmail?.data?.message, "success");
      setCc([]);
      setSendTo("");
      setSubject("");
      setPreview("");
      handleClose();
    } else {
      const errorMessage = resEmail?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  const disable = !sendTo || !sendFrom || !subject || !preview;

  useEffect(() => {
    if (data) {
      const formattedData = data
        ?.map((item) => {
          if (typeof item === "string") {
            const htmlContent = marked(item);
            return htmlContent;
          } else if (typeof item === "object") {
            return Object.keys(item)
              ?.map((key) => {
                const range = item[key];
                const dynamicContent = Object.keys(range)
                  ?.map((innerKey) => {
                    const mappedSettlements = innerKey.replace(/_/g, " ");
                    const value = Array.isArray(range[innerKey])
                      ? range[innerKey].join(" - ")
                      : range[innerKey];

                    return `<p><strong>${mappedSettlements}:</strong> ${value}</p>`;
                  })
                  ?.join("");

                return `<h3>${key?.replace(/_/g, " ")}</h3>${dynamicContent}`;
              })
              .join("");
          }
          return "";
        })
        .join("");

      setPreview(formattedData);
    }
  }, [data]);

  return (
    <div>
      <Grid item>
        <Typography
          sx={{ fontWeight: "500", fontFamily: "Nunito", color: Colors.BLACK }}
        >
          Send Email
        </Typography>
        <Box sx={lineStyle} />
      </Grid>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input
          type="text"
          placeholder="Send To*"
          value={sendTo}
          onChange={(e) => setSendTo(e.target.value)}
          style={inputStyling}
        />
        <Dropdown
          height="2.5rem"
          menuItems={menu}
          menuWidth="11.7rem"
          placeholder="Send From*"
          backgroundColor={Colors.BG_LIGHT_GRAY}
          hoverColor={Colors.BG_LIGHT_GRAY}
          width={"48%"}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          emptyMessage="No Verfied Sender"
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input
          type="text"
          placeholder="Subject*"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={inputStyling}
        />
        <Tooltip title="Press Enter To Save An Email" placement="top">
          <input
            type="text"
            placeholder="Enter CC"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={inputStyling}
          />
        </Tooltip>
      </div>

      {cc?.length > 0 && (
        <div style={inputContainerStyle}>
          {cc?.map((email, index) => (
            <div key={index} style={emailChipStyle}>
              {email}
              <span
                onClick={() => handleRemoveEmail(index)}
                style={removeIconStyle}
              >
                ×
              </span>
            </div>
          ))}
        </div>
      )}

      <Grid sx={{ maxHeight: "40vh", overflowY: "auto", ...ScrollbarStyles }}>
        <Editor
          style={{ margin: "0px !important" }}
          apiKey={TEXT_EDITOR_KEY}
          init={{
            menubar: "false",
            toolbar:
              "formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat",
            height: 250,
          }}
          value={preview}
          onEditorChange={(content) => setPreview(content)}
        />
      </Grid>

      <Box sx={lineStyle} />
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}
      >
        <TextButton
          buttonText="CANCEL"
          height="2rem"
          marginRight="1rem"
          width="6rem"
          onClick={handleClose}
          backgroundColor={Colors.ORANGE_COLOR}
          hoverColor={Colors.ORANGE_COLOR}
        />
        <TextButton
          buttonText="SEND"
          height="2rem"
          width="6rem"
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          onClick={handleSend}
          disabled={disable}
          loading={loading}
        />
      </Box>
    </div>
  );
}
