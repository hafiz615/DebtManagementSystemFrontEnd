// import React, { useState, useRef, useEffect } from "react";
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
import TextButton from "./../button";
import { Colors } from "../../config/default";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";
import styled from "styled-components";
// import {
//   EditSettings,
//   GetAllSettings,
//   GetCustomVariable,
//   GetEvents,
//   SaveSettings,
// } from "../../services/services";
// import { useToast } from "../toast/toastContext";
import { ArrowRight, ExpandMore } from "@mui/icons-material";
import Dropdown from "./../dropdown";

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

export default function SendEmailCase({
  froalaEditor,
  setFroalaEditor,
  //   templateType,
  //   handleClose,
  //   getSettings,
  //   row,
  //   buttonText,
  //   loading,
  //   setLoading,
}) {
  //   const { showToast } = useToast();
  //   const [emailTemplate, setEmailTemplate] = useState({
  //     subject: row?.subject || "",
  //     name: row?.name || "",
  //     event: row?.event || "",
  //     content: row?.content || "",
  //     from: row?.from || "",
  //     type: "email",
  //   });

  //   const [smsTemplate, setSmsTemplate] = useState({
  //     name: row?.name || "",
  //     event: row?.event || "",
  //     content: row?.content || "",
  //     type: "sms",
  //   });

  //   const [anchorEl, setAnchorEl] = useState(null);
  //   const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  //   const [selectedCategory, setSelectedCategory] = useState(null);
  //   const [allEvents, setAllEvents] = useState([]);
  //   const [customVariables, setCustomVariables] = useState({});

  //   const editorRef = useRef(null);

  //   useEffect(() => {
  //     if (row?.content) {
  //       setFroalaEditor(row?.content);
  //     }
  //   }, [row, setFroalaEditor]);

  //   const getVariableAndEvents = async () => {
  //     const resVariable = await GetCustomVariable();
  //     if (resVariable?.status === 200) {
  //       setCustomVariables(resVariable?.data?.data);
  //     }
  //     const resEvents = await GetEvents("all");
  //     if (resEvents?.status === 200) {
  //       setAllEvents(resEvents?.data?.data);
  //     }
  //   };

  //   useEffect(() => {
  //     getVariableAndEvents();
  //   }, []);

  //   const handleSubjectChange = (e) => {
  //     setEmailTemplate((prev) => ({
  //       ...prev,
  //       subject: e.target.value,
  //     }));
  //   };

  //   const handleFromChange = (e) => {
  //     setEmailTemplate((prev) => ({
  //       ...prev,
  //       from: e.target.value,
  //     }));
  //   };

  //   const handleNameChange = (e) => {
  //     if (templateType === "email") {
  //       setEmailTemplate((prev) => ({
  //         ...prev,
  //         name: e.target.value,
  //       }));
  //     } else {
  //       setSmsTemplate((prev) => ({
  //         ...prev,
  //         name: e.target.value,
  //       }));
  //     }
  //   };

  //   const handleChange = (content) => {
  //     if (templateType === "email") {
  //       setEmailTemplate((prev) => ({
  //         ...prev,
  //         content: content,
  //       }));
  //     } else {
  //       setSmsTemplate((prev) => ({
  //         ...prev,
  //         content: content,
  //       }));
  //     }
  //     setFroalaEditor(content);
  //   };

  //   const handleCloseMenu = () => {
  //     setAnchorEl(null);
  //     setSubMenuAnchorEl(null);
  //   };

  //   const handleOpenSubMenu = (event, category) => {
  //     setSubMenuAnchorEl(event.currentTarget);
  //     setSelectedCategory(category);
  //   };

  //   const handleMenuClick = (action, selectedCategory) => {
  //     setSubMenuAnchorEl(null);
  //     setAnchorEl(null);
  //     if (action) {
  //       const newContent = `{{${selectedCategory}.${action}}}`;
  //       if (templateType === "email") {
  //         setFroalaEditor((prevContent) => {
  //           if (prevContent.endsWith("</p>")) {
  //             return prevContent.replace(/<\/p>$/, newContent + "</p>");
  //           } else {
  //             return prevContent + newContent;
  //           }
  //         });
  //       } else {
  //         setSmsTemplate((prev) => ({
  //           ...prev,
  //           content: smsTemplate.content + newContent,
  //         }));
  //         setFroalaEditor((prev) => prev + newContent);
  //       }
  //     }
  //   };

  //   const handleEventChange = (event) => {
  //     const selectedEvent = event;
  //     if (templateType === "email") {
  //       setEmailTemplate((prev) => ({
  //         ...prev,
  //         event: selectedEvent,
  //       }));
  //     } else {
  //       setSmsTemplate((prev) => ({
  //         ...prev,
  //         event: selectedEvent,
  //       }));
  //     }
  //   };

  //   const handleSave = async () => {
  //     setLoading(true);
  //     const newTemplate = {
  //       subject: emailTemplate.subject,
  //       name: templateType === "email" ? emailTemplate.name : smsTemplate.name,
  //       event: templateType === "email" ? emailTemplate.event : smsTemplate.event,
  //       content:
  //         templateType === "email" ? emailTemplate.content : smsTemplate.content,
  //       type: templateType,
  //       ...(templateType === "email" && { from: emailTemplate.from }),
  //     };
  //     const resSetting = await GetAllSettings();
  //     if (resSetting?.status === 200) {
  //       const templates = resSetting?.data?.data?.notificationTemplates;
  //       templates.push(newTemplate);
  //       const params = { notificationTemplates: templates };
  //       const resNotificationTemplate = await SaveSettings(params);
  //       if (resNotificationTemplate?.status === 200) {
  //         showToast(resNotificationTemplate?.data?.message, "success");
  //         getSettings();
  //         setFroalaEditor("");
  //         handleClose();
  //         setEmailTemplate({
  //           subject: "",
  //           name: "",
  //           event: "",
  //           content: "",
  //         });
  //         setSmsTemplate({
  //           name: "",
  //           event: "",
  //           content: "",
  //         });
  //       } else {
  //         const errorMessage = resNotificationTemplate?.response?.data?.message;
  //         showToast(errorMessage, "error");
  //       }
  //     }
  //     setLoading(false);
  //   };

  //   const handleEdit = async () => {
  //     setLoading(true);
  //     const newTemplate = {
  //       subject: emailTemplate.subject,
  //       name: templateType === "email" ? emailTemplate.name : smsTemplate.name,
  //       event: templateType === "email" ? emailTemplate.event : smsTemplate.event,
  //       content:
  //         templateType === "email" ? emailTemplate.content : smsTemplate.content,
  //       type: templateType,
  //       templateId: row?.templateId,
  //       ...(templateType === "email" && { from: emailTemplate.from }),
  //     };

  //     const resNotificationTemplate = await EditSettings(newTemplate);
  //     if (resNotificationTemplate?.status === 200) {
  //       showToast(resNotificationTemplate?.data?.message, "success");
  //       getSettings();
  //       handleClose();
  //     } else {
  //       const errorMessage = resNotificationTemplate?.response?.data?.message;
  //       showToast(errorMessage, "error");
  //     }
  //     setLoading(false);
  //   };

  //   const isFieldEmpty = (field) => {
  //     return !field.trim();
  //   };

  //   const allExistingEvents =
  //     allEvents &&
  //     allEvents?.map((item) => ({
  //       label: item?.label
  //         ? item.label.charAt(0).toUpperCase() + item.label.slice(1)
  //         : "",
  //       value: item?.value,
  //     }));

  //   const isSaveDisabled =
  //     templateType === "email"
  //       ? isFieldEmpty(emailTemplate?.subject) ||
  //         isFieldEmpty(emailTemplate?.name) ||
  //         isFieldEmpty(emailTemplate?.event) ||
  //         isFieldEmpty(emailTemplate?.content) ||
  //         isFieldEmpty(emailTemplate?.from)
  //       : isFieldEmpty(smsTemplate?.name) ||
  //         isFieldEmpty(smsTemplate?.event) ||
  //         isFieldEmpty(smsTemplate?.content);

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
            // value={
            //   templateType === "email" ? emailTemplate?.name : smsTemplate?.name
            // }
            // onChange={handleNameChange}
          />
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
              // value={emailTemplate?.subject}
              // onChange={handleSubjectChange}
            />
          </>
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
              placeholder="Add Email"
              // value={emailTemplate?.from}
              // onChange={handleFromChange}
            />
          </>
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
            //   anchorEl={anchorEl}
            //   open={Boolean(anchorEl)}
            //   onClose={handleCloseMenu}
            >
              {/* {Object.keys(customVariables)?.map((category) => ( */}
              <MenuItem
                //   key={category}
                //   onClick={(event) => handleOpenSubMenu(event, category)}
                sx={{
                  ...fontStyling,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {/* {category?.charAt(0).toUpperCase() + category?.slice(1)} */}
                <ArrowRight />
              </MenuItem>
              {/* //   ))} */}
            </Menu>
            <Popover
            //   anchorEl={subMenuAnchorEl}
            //   open={Boolean(subMenuAnchorEl)}
            //   onClose={() => setSubMenuAnchorEl(null)}
            //   anchorOrigin={{
            //     vertical: "top",
            //     horizontal: "right",
            //   }}
            //   transformOrigin={{
            //     vertical: "top",
            //     horizontal: "left",
            //   }}
            >
              <Grid sx={{ maxHeight: "300px", overflowY: "auto" }}>
                {/* {selectedCategory && */}
                {/* Object.entries(customVariables[selectedCategory])?.map( */}
                {/* ([label, action]) => ( */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Button
                    sx={buttonStyling}
                    //   onClick={() =>
                    //     handleMenuClick(label, selectedCategory)
                    //   }
                  >
                    {/* {action} */}
                  </Button>
                </div>
                {/* )
                  )} */}
              </Grid>
            </Popover>
          </div>
        </Grid>
        <Grid item xs={6}>
          <Dropdown
            menuWidth="16rem"
            // menuItems={allExistingEvents}
            height="2.5rem"
            placeholder="Select Events"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            width="100%"
            // selectedValue={
            //   templateType === "email" ? emailTemplate.event : smsTemplate.event
            // }
            // setSelectedValue={handleEventChange}
          />
        </Grid>
      </Grid>

      <FroalaEditorComponent
        tag="textarea"
        model={froalaEditor}
        // onModelChange={handleChange}
        // ref={editorRef}
      />

      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}
      >
        <TextButton
          //   disabled={isSaveDisabled}
          //   buttonText={buttonText}
          height="2rem"
          //   onClick={buttonText === "SAVE" ? handleSave : handleEdit}
          //   loading={loading}
        />
      </Box>
    </>
  );
}
