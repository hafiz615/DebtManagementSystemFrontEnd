import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Menu,
  MenuItem,
  Popover,
} from "@mui/material";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditorComponent from "react-froala-wysiwyg";
import TextButton from "./button";
import { Colors } from "../config/default";
import { FONT_SIZE_LARGE } from "../constants/appConstants";
import styled from "styled-components";
import {
  EditSettings,
  GetAllSettings,
  GetCustomVariable,
  GetEvents,
  SaveSettings,
} from "../services/services";
import { useToast } from "../toast/toastContext";
import { ArrowRight, ExpandMore } from "@mui/icons-material";

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

export default function FroalaEditor({
  froalaEditor,
  setFroalaEditor,
  templateType,
  handleClose,
  getSettings,
  row,
  buttonText,
  loading,
  setLoading,
}) {
  const { showToast } = useToast();
  const [emailTemplate, setEmailTemplate] = useState({
    subject: row?.subject || "",
    name: row?.name || "",
    event: row?.event || "",
    content: row?.content || "",
    type: "email",
  });

  const [smsTemplate, setSmsTemplate] = useState({
    name: row?.name || "",
    event: row?.event || "",
    content: row?.content || "",
    type: "sms",
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNew, setAnchorElNew] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [customVariables, setCustomVariables] = useState({});

  const editorRef = useRef(null);

  useEffect(() => {
    if (row?.content) {
      setFroalaEditor(row?.content);
    }
  }, [row, setFroalaEditor]);

  const getVariableAndEvents = async () => {
    const resVariable = await GetCustomVariable();
    if (resVariable?.status === 200) {
      setCustomVariables(resVariable?.data?.data);
    }
    const resEvents = await GetEvents("all");
    if (resEvents?.status === 200) {
      setAllEvents(resEvents?.data?.data);
    }
  };

  useEffect(() => {
    getVariableAndEvents();
  }, []);

  const handleSubjectChange = (e) => {
    setEmailTemplate((prev) => ({
      ...prev,
      subject: e.target.value,
    }));
  };

  const handleNameChange = (e) => {
    if (templateType === "email") {
      setEmailTemplate((prev) => ({
        ...prev,
        name: e.target.value,
      }));
    } else {
      setSmsTemplate((prev) => ({
        ...prev,
        name: e.target.value,
      }));
    }
  };

  const handleChange = (content) => {
    if (templateType === "email") {
      setEmailTemplate((prev) => ({
        ...prev,
        content: content,
      }));
    } else {
      setSmsTemplate((prev) => ({
        ...prev,
        content: content,
      }));
    }
    setFroalaEditor(content);
  };

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
    const selectedVariable = action;
    if (selectedVariable) {
      const newContent =
        froalaEditor + `{{${selectedCategory}.${selectedVariable}}}`;
      setFroalaEditor(newContent);
    }
  };

  const handleEventChange = (event) => {
    setAnchorElNew(null);
    const selectedEvent = event.currentTarget.getAttribute("data-value");
    if (templateType === "email") {
      setEmailTemplate((prev) => ({
        ...prev,
        event: selectedEvent,
      }));
    } else {
      setSmsTemplate((prev) => ({
        ...prev,
        event: selectedEvent,
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const newTemplate = {
      subject: emailTemplate.subject,
      name: templateType === "email" ? emailTemplate.name : smsTemplate.name,
      event: templateType === "email" ? emailTemplate.event : smsTemplate.event,
      content:
        templateType === "email" ? emailTemplate.content : smsTemplate.content,
      type: templateType,
    };
    const resSetting = await GetAllSettings();
    if (resSetting?.status === 200) {
      const templates = resSetting?.data?.data?.notificationTemplates;
      templates.push(newTemplate);
      const params = { notificationTemplates: templates };
      const resNotificationTemplate = await SaveSettings(params);
      if (resNotificationTemplate?.status === 200) {
        showToast(resNotificationTemplate?.data?.message, "success");
        getSettings();
        setFroalaEditor("");
        handleClose();
        setEmailTemplate({
          subject: "",
          name: "",
          event: "",
          content: "",
        });
        setSmsTemplate({
          name: "",
          event: "",
          content: "",
        });
      } else {
        const errorMessage = resNotificationTemplate?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    }
    setLoading(false);
  };

  const handleEdit = async () => {
    setLoading(true);
    const newTemplate = {
      subject: emailTemplate.subject,
      name: templateType === "email" ? emailTemplate.name : smsTemplate.name,
      event: templateType === "email" ? emailTemplate.event : smsTemplate.event,
      content:
        templateType === "email" ? emailTemplate.content : smsTemplate.content,
      templateId: row?.templateId,
      type: templateType,
    };

    const resNotificationTemplate = await EditSettings(newTemplate);
    if (resNotificationTemplate?.status === 200) {
      showToast(resNotificationTemplate?.data?.message, "success");
      getSettings();
      handleClose();
    } else {
      const errorMessage = resNotificationTemplate?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  const isFieldEmpty = (field) => {
    return !field.trim();
  };

  const isSaveDisabled =
    templateType === "email"
      ? isFieldEmpty(emailTemplate?.subject) ||
        isFieldEmpty(emailTemplate?.name) ||
        isFieldEmpty(emailTemplate?.event) ||
        isFieldEmpty(emailTemplate?.content)
      : isFieldEmpty(smsTemplate?.name) ||
        isFieldEmpty(smsTemplate?.event) ||
        isFieldEmpty(smsTemplate?.content);

  const buttonStyling = {
    textTransform: "none",
    color: Colors.BLACK,
    fontFamily: "Nunito",
    fontSize: FONT_SIZE_LARGE,
    textAlign: "left",
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
  };

  return (
    <>
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
            Name
          </Typography>
          <StyledInput
            type="text"
            placeholder="Add Name"
            value={
              templateType === "email" ? emailTemplate?.name : smsTemplate?.name
            }
            onChange={handleNameChange}
          />
        </Grid>
        <Grid item xs={6}>
          {templateType === "email" && (
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
                value={emailTemplate?.subject}
                onChange={handleSubjectChange}
              />
            </>
          )}
        </Grid>
      </Grid>

      <Grid
        container
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
      >
        <Grid item xs={6}>
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
              {Object.keys(customVariables)?.map((category) => (
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
              <Grid sx={{ maxHeight: "300px", overflowY: "auto" }}>
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
          <div style={divStyling} onClick={(e) => setAnchorElNew(e.target)}>
            <span>Select Events</span>
            <span style={{ marginTop: "5px" }}>
              <ExpandMore />
            </span>
          </div>
          <Menu
            anchorEl={anchorElNew}
            open={Boolean(anchorElNew)}
            onClose={() => setAnchorElNew(null)}
            PaperProps={{
              sx: {
                maxHeight: 300,
                overflowY: "auto",
              },
            }}
          >
            {allEvents?.map((item) => (
              <MenuItem
                key={item?.label}
                data-value={item?.value}
                onClick={(event) => handleEventChange(event)}
                sx={fontStyling}
              >
                {item?.label.charAt(0).toUpperCase() + item?.label.slice(1)}
              </MenuItem>
            ))}
          </Menu>
        </Grid>
      </Grid>

      <FroalaEditorComponent
        tag="textarea"
        model={froalaEditor}
        onModelChange={handleChange}
        ref={editorRef}
      />
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}
      >
        <TextButton
          disabled={isSaveDisabled}
          buttonText={buttonText}
          height="2rem"
          onClick={buttonText === "SAVE" ? handleSave : handleEdit}
          loading={loading}
        />
      </Box>
    </>
  );
}
