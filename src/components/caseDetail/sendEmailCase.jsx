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
import { GetCustomVariable, SendEmailSmsCase } from "../../services/services";
import { useToast } from "../../toast/toastContext";
import { ArrowRight, ExpandMore } from "@mui/icons-material";
import ScrollbarStyles from "./../customScroll";
import { handleNumberInput } from "../../common";
import { Editor } from "@tinymce/tinymce-react";

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

export default function SendEmailCase({
  handleClose,
  headerName,
  caseDataId,
  GetLogsById,
}) {
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sendTo, setSendTo] = useState("");
  const [sendFrom, setSendFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [cc, setCc] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [preview, setPreview] = useState("");
  const editorRef = useRef(null);
  const { showToast } = useToast();
  const [errors, setErrors] = useState("");
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

  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customVariables, setCustomVariables] = useState({});

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
  const handleInputChange = (e) => {
    const value = e.target.value;

    // Update input value
    setSendTo(value);

    // Validate length
    if (value?.length > 10 || value?.length < 10) {
      setErrors("Phone number must be exactly 10 digits.");
    } else {
      setErrors("");
    }
  };
  const isFieldEmpty = (field) => {
    return !field.trim();
  };

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
    marginBottom: headerName ? "0.8rem" : "auto",
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
  const disable =
    !sendTo.trim() ||
    (!headerName && !sendFrom.trim()) ||
    (!headerName && !subject.trim()) ||
    !preview.trim() ||
    (headerName && errors);

  const handleSend = async () => {
    setLoading(true);
    const payload = {
      sendTo: sendTo,
      content: preview,
      ...(headerName ? {} : { subject: subject }),
      ...(headerName ? {} : { cc: cc }),
      ...(headerName ? {} : { from: sendFrom }),
    };
    const resEmail = await SendEmailSmsCase(
      caseDataId,
      headerName ? "sms" : "email",
      payload
    );
    if (resEmail?.status === 200) {
      showToast(resEmail?.data?.message, "success");
      setCc([]);
      setSendTo("");
      setSubject("");
      setPreview("");
      handleClose();
      GetLogsById(caseDataId);
    } else {
      const errorMessage = resEmail?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };
  return (
    <>
      <Grid container>
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "600",
            color: Colors.DARK_GRAY,
            fontSize: FONT_SIZE_LARGE,
          }}
        >
          {headerName ? "SEND SMS" : "SEND EMAIL"}
        </Typography>
      </Grid>
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
          {headerName ? (
            <>
              <StyledInput
                type="number"
                placeholder="Exclude Country Code*"
                value={sendTo}
                onChange={(e) => handleInputChange(e)}
                onKeyDown={handleNumberInput}
                error={errors}
              />
              {errors ? (
                <Box
                  sx={{
                    color: "red",
                    fontSize: "9.3px",
                    height: "0.7rem",
                  }}
                >
                  {errors}
                </Box>
              ) : (
                <Box
                  sx={{
                    color: "red",
                    height: "0.7rem",
                  }}
                ></Box>
              )}
            </>
          ) : (
            <StyledInput
              type="text"
              placeholder="Send To*"
              value={sendTo}
              onChange={(e) => setSendTo(e.target.value)}
            />
          )}
        </Grid>
        {headerName ? null : (
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
        )}
        {headerName ? null : (
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
        )}

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
        {headerName ? null : (
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
        )}
      </Grid>

      <div style={{ marginTop: "1rem" }}>
        {headerName ? (
          <textarea
            placeholder="Type something"
            rows="6"
            style={smsTemplateStyling}
            value={preview}
            onChange={(e) => setPreview(e.target.value)}
          />
        ) : (
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
        )}
      </div>

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
    </>
  );
}
