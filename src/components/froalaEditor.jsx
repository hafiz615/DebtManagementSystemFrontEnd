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
import { ArrowRight } from "@mui/icons-material";

const StyledSelect = styled.select`
  border: none;
  padding: 0.5rem;
  height: 2.5rem;
  width: 98%;
  background-color: ${Colors.BG_LIGHT_GRAY};
  color: ${Colors.DARK_GRAY};
  font-family: "Nunito";
  border-radius: 5px;
  text-transform: none;

  &:hover {
    background-color: ${Colors.BG_LIGHT_GRAY};
  }

  & option {
    background-color: ${Colors.BG_LIGHT_GRAY};
    color: ${Colors.DARK_GRAY};
  }
  & option:checked {
    background-color: #cccccc;
    color: #ffffff;
  }
`;

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
    html: row?.html || "",
  });

  const [smsTemplate, setSmsTemplate] = useState({
    name: row?.name || "",
    event: row?.event || "",
    text: row?.text || "",
  });

  const [notificationTemplates, setNotificationTemplates] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNew, setAnchorElNew] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allEvents, setAllEvents] = useState({});
  const [customVariables, setCustomVariables] = useState({});

  const editorRef = useRef(null);

  useEffect(() => {
    const getTemplateSettings = async () => {
      const resSetting = await GetAllSettings();
      if (resSetting?.status === 200) {
        setNotificationTemplates(resSetting?.data?.data?.notificationTemplates);
      }
    };
    getTemplateSettings();
  }, [templateType]);

  useEffect(() => {
    if (row?.html) {
      setFroalaEditor(row?.html);
    }
  }, [row, setFroalaEditor]);

  const getVariableAndEvents = async () => {
    const resVariable = await GetCustomVariable();
    if (resVariable?.status === 200) {
      setCustomVariables(resVariable?.data?.data);
      console.log("variables", resVariable?.data?.data);
    }
    const resEvents = await GetEvents();
    if (resEvents?.status === 200) {
      setAllEvents(resEvents?.data?.data);
      console.log("events", resEvents?.data?.data);
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

  const handleChange = (html) => {
    if (templateType === "email") {
      setEmailTemplate((prev) => ({
        ...prev,
        html: html,
      }));
    } else {
      setSmsTemplate((prev) => ({
        ...prev,
        text: html,
      }));
    }
    setFroalaEditor(html);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };

  const handleOpenSubMenu = (event, category) => {
    setSubMenuAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClick = (action) => {
    setSubMenuAnchorEl(null);
    setAnchorEl(null);
    const selectedVariable = action;
    if (selectedVariable) {
      const newContent = froalaEditor + `{{${selectedVariable}}}`;
      setFroalaEditor(newContent);
    }
  };

  const handleEventChange = (event) => {
    setAnchorElNew(null);
    const selectedEvent = event.currentTarget.getAttribute("data-value");
    console.log(selectedEvent);
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
      html: templateType === "email" ? emailTemplate.html : smsTemplate.text,
    };

    const updatedTemplates =
      templateType === "email"
        ? {
            ...notificationTemplates,
            email: [...notificationTemplates?.email, newTemplate],
          }
        : {
            ...notificationTemplates,
            sms: [...notificationTemplates?.sms, newTemplate],
          };

    setNotificationTemplates(updatedTemplates);

    const params = { notificationTemplates: updatedTemplates };
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
        html: "",
      });
      setSmsTemplate({
        name: "",
        event: "",
        text: "",
      });
    } else {
      const errorMessage = resNotificationTemplate?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };
  const handleEdit = async () => {
    setLoading(true);
    const newTemplate = {
      subject: emailTemplate.subject,
      name: templateType === "email" ? emailTemplate.name : smsTemplate.name,
      event: templateType === "email" ? emailTemplate.event : smsTemplate.event,
      html: templateType === "email" ? emailTemplate.html : smsTemplate.text,
      templateId: row?.templateId,
    };

    const resNotificationTemplate = await EditSettings(
      newTemplate,
      templateType
    );
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
        isFieldEmpty(emailTemplate?.html)
      : isFieldEmpty(smsTemplate?.name) ||
        isFieldEmpty(smsTemplate?.event) ||
        isFieldEmpty(smsTemplate?.text);

  const dummyEvents = {
    PaymentSuccessful: "on_payment_success",
    PaymentFailure: "on_payment_fail",
    AuthorizationSuccessful: "on_auth_success",
    AuthorizationFailure: "on_auth_fail",
  };

  const dummyVariables = {
    Event: { Date: "date_time", Label: "label" },
    DebtorInformation: { Name: "name", CompanyName: "company_name" },
  };

  const buttonStyling = {
    textTransform: "none",
    color: Colors.BLACK,
    fontFamily: "Nunito",
    fontSize: FONT_SIZE_LARGE,
    textAlign: "left",
  };

  const fontStyling = { fontSize: FONT_SIZE_LARGE, fontFamily: "Nunito" };

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
            <TextButton
              buttonText="Select Variable"
              height="2.5rem"
              width="98%"
              fontColor={Colors.BLACK}
              onClick={(e) => setAnchorEl(e.target)}
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
              boxShadow="none"
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              {Object.keys(dummyVariables)?.map((category) => (
                <MenuItem
                  key={category}
                  onClick={(event) => handleOpenSubMenu(event, category)}
                  sx={{
                    ...fontStyling,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {category}
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
              <div>
                {selectedCategory &&
                  Object.entries(dummyVariables[selectedCategory])?.map(
                    ([label, action]) => (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Button
                          sx={buttonStyling}
                          onClick={() => handleMenuClick(action)}
                        >
                          {label}
                        </Button>
                      </div>
                    )
                  )}
              </div>
            </Popover>
          </div>
        </Grid>
        <Grid item xs={6}>
          <TextButton
            buttonText="Select Events"
            height="2.5rem"
            width="98%"
            fontColor={Colors.BLACK}
            onClick={(e) => setAnchorElNew(e.target)}
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            boxShadow="none"
          />
          <Menu
            anchorEl={anchorElNew}
            open={Boolean(anchorElNew)}
            onClose={() => setAnchorElNew(null)}
          >
            {Object.entries(dummyEvents)?.map(([label, action]) => (
              <MenuItem
                key={action}
                data-value={action}
                onClick={(event) => handleEventChange(event)}
                sx={fontStyling}
              >
                {label}
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
