import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Tooltip,
  ClickAwayListener,
  Chip,
} from "@mui/material";
import { useToast } from "../toast/toastContext";
import { Colors } from "../config/default";
import TextButton from "./button";
import ScrollbarStyles from "./customScroll";
import {
  Select,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  Menu,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { GetAllSenders, SendSettlementEmail } from "../services/services";
import { FONT_SIZE_MEDIUM, TEXT_EDITOR_KEY } from "../constants/appConstants";
import { marked } from "marked";
import { useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import Dropdown from "./dropdown";
import { isEmailValid } from "../common";

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
  cc,
}) {
  const selectRef = useRef(null);
  const [sendTo, setSendTo] = useState("");
  const [sendFrom, setSendFrom] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  // const [cc, setCc] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [subject, setSubject] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [selectedKey, setSelectedKey] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [manualEmails, setManualEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");

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
      cc: [...selectedValues],
    };
    const resEmail = await SendSettlementEmail(payload, caseId);
    if (resEmail?.status === 200) {
      showToast(resEmail?.data?.message, "success");
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

  const handleKeyChange = (e) => {
    setSelectedKey(e.target.value);
  };

  const handleCheckboxChange = (email) => {
    if (selectedValues.includes(email)) {
      setSelectedValues(selectedValues.filter((item) => item !== email));
    } else {
      setSelectedValues([...selectedValues, email]);
    }
  };

  const handleAddEmail = () => {
    const trimmedEmail = newEmail.trim();
    if (
      trimmedEmail &&
      isEmailValid(trimmedEmail) &&
      !manualEmails.includes(trimmedEmail)
    ) {
      setManualEmails((prev) => [...prev, trimmedEmail]);
      setSelectedValues((prev) => [...prev, trimmedEmail]);
      setNewEmail("");
    }
  };

  // Determine if the button should be disabled
  const isButtonDisabled = !(
    newEmail &&
    isEmailValid(newEmail) &&
    !manualEmails?.includes(newEmail)
  );

  const handleRemoveManualEmail = (email) => {
    setManualEmails(manualEmails?.filter((item) => item !== email));
  };

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

        <div style={{ width: "48%" }}>
          <Box sx={{ position: "relative", width: "100%" }} ref={selectRef}>
            <FormControl
              sx={{
                fontFamily: "Nunito",
                width: "98%",
                backgroundColor: "#f5f5f5",
                borderRadius: "5px",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiSelect-select": {
                  padding: "6px 10px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  minHeight: "30px",
                  alignItems: "flex-start",
                },
              }}
            >
              <Select
                value={selectedKey}
                onChange={handleKeyChange}
                displayEmpty
                renderValue={() => {
                  if (!selectedValues || selectedValues?.length === 0) {
                    return (
                      <Box
                        style={{
                          color: Colors.DARK_GRAY,
                          fontFamily: "Nunito",
                          fontSize: "0.875rem",
                          textAlign: "center",
                          marginTop: ".3rem",
                        }}
                      >
                        Select CC
                      </Box>
                    );
                  }

                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        maxHeight: "4rem",
                        overflowY: "auto",
                        ...ScrollbarStyles,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {selectedValues.map((email) => (
                        <Box
                          key={email}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Chip
                            label={email}
                            onDelete={() => handleCheckboxChange(email)}
                            sx={{
                              fontFamily: "Nunito",
                              backgroundColor: Colors.VIOLET,
                              color: Colors.DARK_GRAY,
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  );
                }}
                sx={{
                  fontFamily: "Nunito",
                  color: Colors.DARK_GRAY,
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 200,
                      overflowY: "auto",
                    },
                  },
                }}
              >
                <MenuItem disabled value="">
                  <em>Select CC</em>
                </MenuItem>
                <MenuItem value="Custom">Custom Email</MenuItem>
                {Object.keys(cc).map((key) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedKey === "Custom" && (
              <ClickAwayListener
                onClickAway={() => {
                  setSelectedKey("");
                }}
              >
                <FormGroup
                  sx={{
                    marginTop: "10px",
                    padding: "10px",
                    borderRadius: "5px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      maxHeight: "15rem",
                    }}
                  >
                    <TextField
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter email"
                      size="small"
                      sx={{
                        marginTop: "10px",
                        color: Colors.DARK_GRAY,
                        fontFamily: "Nunito",
                      }}
                    />
                    <Button
                      onClick={handleAddEmail}
                      sx={{
                        marginTop: "5px",
                        backgroundColor: Colors.SKY_BLUE,
                        "&:hover": {
                          background: Colors.SKY_BLUE,
                          border: "none",
                        },
                        fontFamily: "Nunito",
                      }}
                      disabled={isButtonDisabled}
                      variant="contained"
                    >
                      Add Email
                    </Button>
                  </div>
                </FormGroup>
              </ClickAwayListener>
            )}

            {selectedKey && selectedKey !== "Custom" && (
              <ClickAwayListener
                onClickAway={() => {
                  setSelectedKey("");
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "98%",
                    backgroundColor: "#fff",
                    zIndex: 1000,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    marginTop: "4px",
                  }}
                >
                  <FormGroup
                    sx={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                      ...ScrollbarStyles,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <Typography
                        sx={{ fontFamily: "Nunito", fontWeight: 600 }}
                      >
                        Emails
                      </Typography>

                      <Box>
                        <button
                          style={{
                            fontFamily: "Nunito",
                            backgroundColor: Colors.VIOLET,
                            color: Colors.SKY_BLUE,
                            fontWeight: 600,
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            const emails = cc[selectedKey];
                            const areAllSelected = emails?.every((email) =>
                              selectedValues?.includes(email)
                            );

                            if (areAllSelected) {
                              const filtered = selectedValues?.filter(
                                (email) => !emails?.includes(email)
                              );
                              setSelectedValues(filtered);
                            } else {
                              const merged = [
                                ...new Set([...selectedValues, ...emails]),
                              ];
                              setSelectedValues(merged);
                            }
                          }}
                        >
                          {cc[selectedKey]?.every((email) =>
                            selectedValues?.includes(email)
                          )
                            ? "UNSELECT All"
                            : "SELECT ALL"}
                        </button>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        maxHeight: "80px",
                        overflowY: "auto",
                        ...ScrollbarStyles,
                      }}
                    >
                      {cc[selectedKey]?.length > 0 ? (
                        cc[selectedKey]?.map((email) => (
                          <FormControlLabel
                            key={email}
                            control={
                              <Checkbox
                                checked={selectedValues?.includes(email)}
                                onChange={() => handleCheckboxChange(email)}
                                sx={{
                                  color: Colors.SKY_BLUE,
                                  "&.Mui-checked": {
                                    color: Colors.SKY_BLUE,
                                  },
                                }}
                              />
                            }
                            label={email}
                            sx={{ fontFamily: "Nunito" }}
                          />
                        ))
                      ) : (
                        <Typography color="textSecondary">
                          No email exists
                        </Typography>
                      )}
                    </Box>
                  </FormGroup>
                </Box>
              </ClickAwayListener>
            )}
          </Box>
        </div>
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
