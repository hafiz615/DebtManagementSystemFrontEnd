import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Chip,
} from "@mui/material";
import { useToast } from "../toast/toastContext";
import { Colors } from "../config/default";
import TextButton from "./button";
import { Editor } from "@tinymce/tinymce-react";
import ScrollbarStyles from "./customScroll";
import { GetAllCc, SendSettlementEmail } from "../services/services";
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
import {
  FONT_SIZE_MEDIUM,
  initialHtmlContent,
  TEXT_EDITOR_KEY,
} from "../constants/appConstants";
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
  backgroundColor: Colors.BG_LIGHT_GRAY,
  marginBottom: "1rem",
  height: "2.5rem",
  color: Colors.DIM_LIGHT_GRAY,
  paddingLeft: "1rem",
  border: "none",
  outline: "none",
  borderRadius: "5px",
  width: "48%",
};
export default function SendEmail({
  handleClose,
  payableAmount,
  debtorInfo,
  creditorInfo,
  data,
  selectedCreditor,
  lumpSump,
  caseId,
  paymentData,
  debtorId,
  to,
  cc,
}) {
  const [sendTo, setSendTo] = useState(to || "");
  const [sendFrom, setSendFrom] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [strategy, setStrategy] = useState("Strategy 1");
  const [recommendation, setRecommendation] = useState("recommendation 1");
  const [rangeMinToMax, setRangeMinToMax] = useState("min");
  // const [cc, setCc] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [subject, setSubject] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const allStrategies = [
    { label: "Strategy 1", value: "Strategy 1" },
    { label: "Strategy 2", value: "Strategy 2" },
    { label: "Strategy 3", value: "Strategy 3" },
  ];

  const allRanges = [
    { label: "Minimum", value: "min" },
    { label: "Maximum", value: "max" },
  ];

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
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
    const currentDate = new Date();
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);
    const paymentInterval = "Weekly";

    const payment =
      strategy === "Strategy 1"
        ? data?.settlement_range?.[selectedCreditor]?.["recommendation 1"]?.[
            rangeMinToMax
          ]
        : strategy === "Strategy 2"
        ? lumpSump?.lumpsum_settlement?.[selectedCreditor]
            ?.remaining_principle_amount
        : data?.settlement_range?.[selectedCreditor]?.["recommendation 1"]?.[
            rangeMinToMax
          ];

    const formatedPayment =
      typeof payment === "string"
        ? payment && payment?.includes("$")
          ? payment
          : `$${payment}`
        : `$${payment}`;

    const formatedValue =
      typeof payableAmount === "string"
        ? payableAmount && payableAmount?.includes("$")
          ? payableAmount
          : `$${payableAmount}`
        : `$${payableAmount}`;

    const htmlContent = initialHtmlContent(
      formattedDate,
      debtorInfo,
      creditorInfo,
      formatedValue,
      paymentInterval,
      paymentData ? `$${paymentData}` : formatedPayment
    );
    setPreview(htmlContent);
  }, [strategy, rangeMinToMax, recommendation, paymentData]);

  const [selectedKey, setSelectedKey] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [manualEmails, setManualEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
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

  return (
    <div style={{ width: "100%" }}>
      <Grid item>
        <Typography
          sx={{
            fontWeight: "500",
            fontFamily: "Nunito",
            color: Colors.BLACK,
          }}
        >
          Send Email
        </Typography>
      </Grid>
      <Box sx={lineStyle} />
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        {!paymentData && (
          <Dropdown
            menuWidth="22rem"
            menuItems={allStrategies}
            placeholder="Type"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            width="48%"
            selectedValue={strategy}
            setSelectedValue={setStrategy}
          />
        )}

        {!paymentData && strategy === "Strategy 1" ? (
          <Dropdown
            menuWidth="22rem"
            menuItems={allRanges}
            placeholder="Type"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            width="48%"
            selectedValue={rangeMinToMax}
            setSelectedValue={setRangeMinToMax}
          />
        ) : !paymentData && strategy === "Strategy 3" ? (
          <Dropdown
            menuWidth="22rem"
            menuItems={allRanges}
            placeholder="Type"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            width="48%"
            selectedValue={rangeMinToMax}
            setSelectedValue={setRangeMinToMax}
          />
        ) : (
          ""
        )}
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
          <FormControl
            sx={{
              fontFamily: "Nunito",
              width: "100%",
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
          )}

          {selectedKey && selectedKey !== "Custom" && (
            <FormGroup
              sx={{
                marginTop: "10px",
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
                <Typography sx={{ fontFamily: "Nunito", fontWeight: 600 }}>
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
                  <Typography color="textSecondary">No email exists</Typography>
                )}
              </Box>
            </FormGroup>
          )}
        </div>
      </div>

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
