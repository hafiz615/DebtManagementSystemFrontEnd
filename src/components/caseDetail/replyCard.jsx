import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
} from "@mui/material";

import TextButton from "../button";
import { Colors } from "../../config/default";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
  TEXT_EDITOR_KEY,
} from "../../constants/appConstants";
import styled from "styled-components";
import {
  GetAllSenders,
  GetCustomVariable,
  SendEmailSmsCase,
} from "../../services/services";
import { useToast } from "../../toast/toastContext";
import { ArrowRight, ExpandMore } from "@mui/icons-material";
import ScrollbarStyles from "./../customScroll";
import { handleNumberInput } from "../../common";
import { Editor } from "@tinymce/tinymce-react";
import Dropdown from "../dropdown";

const lineStyle = {
  width: "100%",
  height: "1px",
  backgroundColor: "#EAEBEB",
  margin: "1rem 0",
};
const StyledInput = styled.input`
  font-family: "Nunito";
  background-color: ${Colors.BG_LIGHT_GRAY};
  height: 2.5rem;
  color: ${Colors.DIM_LIGHT_GRAY};
  padding-left: 1rem;
  border: none;
  outline: none;
  border-radius: 5px;
  width: 98%;
`;
const buttonStyling = {
  textTransform: "none",
  color: Colors.BLACK,
  fontFamily: "Nunito",
  fontSize: FONT_SIZE_LARGE,
  textAlign: "left",
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
const fontStyling = { fontSize: FONT_SIZE_LARGE, fontFamily: "Nunito" };
const divStyling = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: Colors.BG_LIGHT_GRAY,
  borderRadius: "5px",
  height: "2.5rem",
  cursor: "pointer",
  fontSize: FONT_SIZE_LARGE,
  fontFamily: "Nunito",
  padding: "0px 10px",
  width: "98%",
  marginBottom: "auto",
};
const smsTemplateStyling = {
  backgroundColor: Colors.BG_LIGHT_GRAY,
  border: "none",
  outline: "none",
  minWidth: "100%",
  maxWidth: "100%",
  maxHeight: "40vh",
  padding: "1em",
  fontFamily: "Nunito",
  borderRadius: "5px",
};

export default function ReplyCard({
  from,
  to,
  content,
  emailSubject,
  caseDataId,
  GetLogsById,
  setShowReplyCard,
  caseData,
  setHideShowMore,
}) {
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sendTo, setSendTo] = useState(from || "");
  const [sendFrom, setSendFrom] = useState(to || []);
  const [subject, setSubject] = useState(emailSubject || "");
  const [cc, setCc] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [preview, setPreview] = useState(content || "");
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customVariables, setCustomVariables] = useState({});
  //templates
  const [selectedEmailTemplates, setSelectedEmailTemplates] = useState("");
  const [bulkEmailTemplates, setBulkEmailTemplates] = useState(
    caseData?.emailTemplates || []
  );
  const menuBulkTemplates = bulkEmailTemplates?.map((item) => ({
    label: item?.name,
    value: item?.name,
  }));
  useEffect(() => {
    const selectedTemplate = bulkEmailTemplates?.find((template) => {
      if (template?.name === selectedEmailTemplates) {
        setPreview((prevContent) => prevContent + template?.content);
      }
    });
  }, [selectedEmailTemplates]);
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

  const getVariableAndEvents = async () => {
    const resVariable = await GetCustomVariable();
    if (resVariable?.status === 200) {
      setCustomVariables(resVariable?.data?.data);
    }
  };

  useEffect(() => {
    getVariableAndEvents();
  }, []);

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };

  const handleOpenSubMenu = (event, category) => {
    setSubMenuAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClick = (action, selectedCategory) => {
    setSubMenuAnchorEl(null);
    setAnchorEl(null);
    if (action) {
      const newContent = `{{${selectedCategory}.${action}}}`;

      setPreview((prevContent) => {
        if (prevContent.endsWith("</p>")) {
          return prevContent.replace(/<\/p>$/, newContent + "</p>");
        } else {
          return prevContent + newContent;
        }
      });
    }
  };

  const handleSend = async () => {
    setLoading(true);
    const payload = {
      sendTo: sendTo,
      content: preview,
      subject: subject,
      cc: cc,
      from: sendFrom,
    };
    const resEmail = await SendEmailSmsCase(caseDataId, "email", payload);
    if (resEmail?.status === 200) {
      showToast(resEmail?.data?.message, "success");
      setCc([]);
      setSendTo("");
      setSubject("");
      setPreview("");
      setSelectedEmailTemplates("");
      setBulkEmailTemplates([]);

      GetLogsById && GetLogsById(caseDataId);
    } else {
      const errorMessage = resEmail?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };
  return (
    <>
      <Box sx={lineStyle} />
      <Grid
        container
        item
        style={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Grid item xs={6}>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "600",
              color: Colors.DARK_GRAY,
              fontSize: FONT_SIZE_LARGE,
            }}
          >
            To
          </Typography>

          <StyledInput
            type="text"
            placeholder="Send To*"
            value={sendTo}
            onChange={(e) => setSendTo(e.target.value)}
          />
        </Grid>
        <Grid xs={6}>
          <>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                color: Colors.DARK_GRAY,
                fontSize: FONT_SIZE_LARGE,
              }}
            >
              From
            </Typography>

            <StyledInput
              type="text"
              placeholder="Send From*"
              value={sendFrom}
              onChange={(e) => setSendFrom(e.target.value)}
            />
          </>
        </Grid>
        <Grid item xs={6}>
          <>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                color: Colors.DARK_GRAY,
                fontSize: FONT_SIZE_LARGE,
              }}
            >
              Subject
            </Typography>
            <StyledInput
              type="text"
              placeholder="Add Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </>
        </Grid>
        <Grid item xs={6}>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "600",
              color: Colors.DARK_GRAY,
              fontSize: FONT_SIZE_LARGE,
            }}
          >
            Variable
          </Typography>
          <div>
            <div
              style={divStyling}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <span>Select Variable</span>
              <span style={{ marginTop: "5px" }}>
                <ExpandMore />
              </span>
            </div>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              {Object.keys(customVariables)
                ?.filter((category) => category !== "event") // Exclude the 'event' key
                .map((category) => (
                  <MenuItem
                    key={category}
                    onClick={(event) => handleOpenSubMenu(event, category)}
                    sx={{
                      ...fontStyling,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {category?.charAt(0).toUpperCase() + category?.slice(1)}
                    <ArrowRight />
                  </MenuItem>
                ))}
            </Menu>
            <Popover
              anchorEl={subMenuAnchorEl}
              open={Boolean(subMenuAnchorEl)}
              onClose={() => setSubMenuAnchorEl(null)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Grid
                sx={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  ...ScrollbarStyles,
                }}
              >
                {selectedCategory &&
                  Object.entries(customVariables[selectedCategory])?.map(
                    ([label, action]) => (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Button
                          sx={buttonStyling}
                          onClick={() =>
                            handleMenuClick(label, selectedCategory)
                          }
                        >
                          {action}
                        </Button>
                      </div>
                    )
                  )}
              </Grid>
            </Popover>
          </div>
        </Grid>
        <Grid item xs={6}>
          <>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                color: Colors.DARK_GRAY,
                fontSize: FONT_SIZE_LARGE,
              }}
            >
              CC
            </Typography>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Tooltip title="Press Enter To Save An Email" placement="top">
                <StyledInput
                  type="text"
                  placeholder="Enter CC"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
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
          </>
        </Grid>
        <Grid item xs={6}>
          <>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                color: Colors.DARK_GRAY,
                fontSize: FONT_SIZE_LARGE,
              }}
            >
              Email Templates
            </Typography>
            <Dropdown
              height="2.5rem"
              menuItems={menuBulkTemplates}
              menuWidth="11.7rem"
              placeholder={"Select Email Templates"}
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
              width="98%"
              selectedValue={selectedEmailTemplates}
              setSelectedValue={setSelectedEmailTemplates}
              emptyMessage="Empty Email Templates"
            />
          </>
        </Grid>
      </Grid>

      <div style={{ marginTop: "1rem" }}>
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
      </div>

      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}
      >
        <TextButton
          buttonText="CANCEL"
          height="2rem"
          marginRight="1rem"
          width="6rem"
          onClick={() => {
            setHideShowMore(true);
            setShowReplyCard(false);
          }}
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
          loading={loading}
        />
      </Box>
    </>
  );
}
