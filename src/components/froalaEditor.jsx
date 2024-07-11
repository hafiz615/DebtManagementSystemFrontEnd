import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
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
  SaveSettings,
} from "../services/services";
import { useToast } from "../toast/toastContext";

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

  const [notificationTemplates, setNotificationTemplates] = useState({
    email: [],
    sms: [],
  });

  const editorRef = useRef(null);

  useEffect(() => {
    const getTemplateSettings = async () => {
      const getSetting = await GetAllSettings();
      if (getSetting?.status === 200) {
        setNotificationTemplates({
          email: getSetting?.data?.data?.notificationTemplates?.email,
          sms: getSetting?.data?.data?.notificationTemplates?.sms,
        });
      }
    };
    getTemplateSettings();
  }, [templateType]);

  useEffect(() => {
    if (row?.html) {
      setFroalaEditor(row?.html);
    }
  }, [row, setFroalaEditor]);

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

  const handleVariableChange = (e) => {
    const selectedVariable = e.target.value;
    if (selectedVariable) {
      const newContent = froalaEditor + selectedVariable;
      setFroalaEditor(newContent);
    }
  };

  const handleEventChange = (e) => {
    const selectedEvent = e.target.value;
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
      ? isFieldEmpty(emailTemplate.subject) ||
        isFieldEmpty(emailTemplate.name) ||
        isFieldEmpty(emailTemplate.event) ||
        isFieldEmpty(emailTemplate.html)
      : isFieldEmpty(smsTemplate.name) ||
        isFieldEmpty(smsTemplate.event) ||
        isFieldEmpty(smsTemplate.text);

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
          <StyledSelect defaultValue="" onChange={handleVariableChange}>
            <option value="" disabled>
              Select Variable
            </option>
            <option value="{{clientName}}">Client Name</option>
            <option value="{{creditorName}}">Creditor Name</option>
            <option value="{{paymentDate}}"> Payment Date</option>
            <option value="{{paymentAmount}}"> Payment Amount</option>
            <option value="{{remainingAmount}}"> Remaining Debt</option>
          </StyledSelect>
        </Grid>
        <Grid item xs={6}>
          <StyledSelect
            value={
              templateType === "email"
                ? emailTemplate?.event
                : smsTemplate?.event
            }
            onChange={handleEventChange}
          >
            <option value="" disabled>
              Select Event
            </option>
            <option value="success payment">Successful Payment</option>
            <option value="failure payment">Failure Payment</option>
            <option value="success auth">Successful Authorization</option>
            <option value="failure auth">Failure Authorization</option>
          </StyledSelect>
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
